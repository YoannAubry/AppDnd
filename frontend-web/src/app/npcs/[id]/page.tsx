import { client, urlFor } from "../../../lib/sanity"
import Link from "next/link"
import { Badge } from "../../../components/ui/Badge"
import { AdminToolbar } from "../../../components/ui/adminToolbar"

async function getNPC(id: string) {
  return await client.fetch(`*[_type == "npc" && _id == $id][0]{
    _id, name, role, personality, history, image,
    faction->{name, description, image},
    monsterTemplate->{name, "slug": slug.current},
    customStats,
    inventory, // Liste simple
    spells     // Liste simple
  }`, { id })
}

export default async function NPCDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const npc = await getNPC(params.id)

  if (!npc) return <div className="p-20 text-center">PNJ introuvable</div>

  return (
    <div className="min-h-screen bg-[#fdf1dc] text-slate-900 p-8 flex justify-center font-serif">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-lg overflow-hidden border border-[#eecfa1]">
        
        {/* HEADER */}
        <div className="relative h-64 bg-slate-800">
          {npc.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={urlFor(npc.image).width(800).url()} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">👤</div>
          )}
          <Link href="/npcs" className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm hover:bg-black/70 backdrop-blur-sm transition">
            ← Retour
          </Link>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#7a200d] mb-1">{npc.name}</h1>
              <p className="text-slate-500 italic text-lg">{npc.role}</p>
            </div>
            {npc.faction && (
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {npc.faction.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={urlFor(npc.faction.image).width(30).url()} className="w-6 h-6 rounded-full" />
                )}
                <span className="text-xs font-bold text-slate-600 uppercase">{npc.faction.name}</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section>
                <h3 className="font-bold text-slate-400 uppercase text-xs border-b border-slate-200 pb-1 mb-2 tracking-widest">Personnalité</h3>
                <p className="text-slate-800 leading-relaxed text-sm">{npc.personality || "Non définie."}</p>
              </section>

              <section>
                <h3 className="font-bold text-slate-400 uppercase text-xs border-b border-slate-200 pb-1 mb-2 tracking-widest">Histoire</h3>
                <p className="text-slate-800 leading-relaxed text-sm">{npc.history || "Inconnue."}</p>
              </section>
            </div>

            <div className="space-y-6">
              {/* Inventaire */}
              <section>
                <h3 className="font-bold text-slate-400 uppercase text-xs border-b border-slate-200 pb-1 mb-2 tracking-widest">Équipement</h3>
                <ul className="space-y-2">
                  {npc.inventory?.map((item: any, i: number) => (
                    <li key={i} className="text-sm bg-slate-50 p-2 rounded border border-slate-100">
                      <strong>{item.name}</strong> <span className="text-slate-500">- {item.desc}</span>
                    </li>
                  ))}
                  {!npc.inventory && <li className="text-slate-400 italic text-sm">Rien de notable.</li>}
                </ul>
              </section>

              {/* Lien Combat */}
              {npc.monsterTemplate && (
                <div className="mt-8 pt-4">
                  <Link href={`/bestiary/${npc.monsterTemplate.slug}`} className="bg-red-50 text-red-800 px-4 py-3 rounded flex justify-between items-center hover:bg-red-100 transition border border-red-100 shadow-sm group">
                    <div>
                      <span className="text-xs text-red-400 font-bold uppercase block mb-1">Stats de Combat</span>
                      <span className="font-bold group-hover:underline">{npc.monsterTemplate.name}</span>
                    </div>
                    <span>➜</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
      <AdminToolbar 
        id={npc._id} 
        editUrl={`/npcs/${params.id}/edit`} // On n'a pas encore créé cette page, mais le lien sera prêt
        type="npc" 
      />
    </div>
  )
}