import { client, urlFor } from "../../../lib/sanity"
import Link from "next/link"
import { AdminToolbar } from "../../../components/ui/adminToolbar"
import { PortableText } from "@portabletext/react"

async function getLocation(id: string) {
  return await client.fetch(`*[_type == "location" && _id == $id][0]{
    _id, name, image, description,
    npcs[]->{ _id, name, role, image },
    monsters[]->{ _id, name, image, "slug": slug.current, "cr": stats.challenge }
  }`, { id })
}

export default async function LocationPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const location = await getLocation(params.id)

  if (!location) return <div>Lieu introuvable</div>

  return (
    <div className="min-h-screen bg-[#fdf1dc] text-slate-900 font-serif pb-20">
      
      {/* HERO IMAGE */}
      <div className="relative h-64 md:h-80 bg-slate-900 overflow-hidden shadow-xl border-b-4 border-[#7a200d]">
        {location.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={urlFor(location.image).width(1200).url()} className="w-full h-full object-cover opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-8 left-8 md:left-12">
          <h1 className="text-5xl font-bold text-white drop-shadow-md mb-2">{location.name}</h1>
        </div>
        <Link href="/locations" className="absolute top-6 left-6 bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-sm transition font-sans text-sm font-bold">← Carte</Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 mt-12 grid md:grid-cols-3 gap-12">
        
        {/* DESCRIPTION (Gauche, 2/3) */}
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-lg text-slate-800">
            {location.description ? (
              <PortableText value={location.description} />
            ) : (
              <p className="italic text-slate-500">Aucune description disponible.</p>
            )}
          </div>
        </div>

        {/* SIDEBAR (Droite, 1/3) */}
        <div className="space-y-8">
          
          {/* PNJs */}
          <div className="bg-white p-6 rounded-lg shadow border border-[#eecfa1]">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Habitants</h3>
            <div className="space-y-3">
              {location.npcs?.map((npc: any) => (
                <Link href={`/npcs/${npc._id}`} key={npc._id} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                    {npc.image && <img src={urlFor(npc.image).width(50).url()} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 group-hover:text-blue-600 transition">{npc.name}</div>
                    <div className="text-xs text-slate-500">{npc.role}</div>
                  </div>
                </Link>
              ))}
              {(!location.npcs || location.npcs.length === 0) && <p className="text-sm text-slate-400 italic">Personne ici.</p>}
            </div>
          </div>

          {/* MONSTRES */}
          <div className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-100">
            <h3 className="text-sm font-bold text-red-300 uppercase tracking-widest mb-4 border-b border-red-200 pb-2">Menaces</h3>
            <div className="space-y-2">
              {location.monsters?.map((monster: any) => (
                <Link href={`/bestiary/${monster.slug}`} key={monster._id} className="block bg-white border border-red-200 rounded px-3 py-2 text-sm text-red-900 font-bold hover:bg-red-100 transition shadow-sm flex justify-between">
                  <span>{monster.name}</span>
                  <span className="text-red-400 text-xs font-normal">CR {monster.cr}</span>
                </Link>
              ))}
              {(!location.monsters || location.monsters.length === 0) && <p className="text-sm text-red-300 italic">Zone sûre.</p>}
            </div>
          </div>

        </div>
      </div>

      <AdminToolbar id={location._id} editUrl={`/locations/${location._id}/edit`} type="location" />
    </div>
  )
}