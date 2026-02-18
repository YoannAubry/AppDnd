import Link from "next/link"
import { AdminToolbar } from "@/components/ui/adminToolbar"
import { BackButton } from "@/components/ui/BackButton"
import { PortableText } from "@portabletext/react"
import { getLocation } from "@/app/actions/getters"


export default async function LocationPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const location = await getLocation(params.id)

  if (!location) return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center p-4 text-[var(--text-muted)]">
      <h1 className="text-2xl mb-4">Lieu introuvable 🗺️</h1>
      <Link href="/locations" className="text-[var(--accent-primary)] hover:underline">Retour à la carte</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-serif pb-20">
      
      {/* HERO IMAGE */}
      <div className="relative h-64 md:h-80 bg-black overflow-hidden shadow-xl border-b-4 border-[var(--border-accent)]">
        {location.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={location.image.width(1200).url()} 
            className="w-full h-full object-cover opacity-80" 
            alt={location.name}
          />
        )}
        
        {/* Overlay sombre dégradé pour lisibilité du titre */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-8 left-8 md:left-12 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2 tracking-wide font-serif">
            {location.name}
          </h1>
        </div>
        
        {/* BOUTON RETOUR INTELLIGENT */}
        <BackButton 
          fallbackUrl="/locations" 
          label="← Carte" 
          className="absolute top-6 left-6 bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-sm transition font-sans text-sm font-bold z-20 border border-white/10"
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 mt-12 grid md:grid-cols-3 gap-12">
        
        {/* DESCRIPTION (Gauche, 2/3) */}
        <div className="md:col-span-2 space-y-8">
          <div className="prose prose-lg prose-invert text-[var(--text-main)] leading-relaxed">
            {location.description ? (
              <PortableText value={location.description} />
            ) : (
              <p className="italic text-[var(--text-muted)]">Aucune description disponible pour ce lieu.</p>
            )}
          </div>
        </div>

        {/* SIDEBAR (Droite, 1/3) */}
        <div className="space-y-8">
          
          {/* PNJs */}
          <div className="bg-[var(--bg-card)] p-6 rounded-lg shadow border border-[var(--border-main)]">
            <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 border-b border-[var(--border-main)] pb-2 font-sans">Habitants</h3>
            <div className="space-y-3">
              {location.npcs?.map((npc: any) => (
                <Link href={`/npcs/${npc._id}`} key={npc._id} className="flex items-center gap-3 group p-2 -mx-2 rounded hover:bg-[var(--bg-input)] transition">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-input)] overflow-hidden border border-[var(--border-main)] shrink-0">
                    {npc.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={npc.image.width(50).url()} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition truncate">{npc.name}</div>
                    <div className="text-xs text-[var(--text-muted)] truncate">{npc.role}</div>
                  </div>
                </Link>
              ))}
              {(!location.npcs || location.npcs.length === 0) && <p className="text-sm text-[var(--text-muted)] italic">Personne ici.</p>}
            </div>
          </div>

          {/* MONSTRES */}
          <div className="bg-[var(--bg-input)] p-6 rounded-lg shadow-sm border border-[var(--border-main)]">
            <h3 className="text-sm font-bold text-[var(--accent-hover)] uppercase tracking-widest mb-4 border-b border-[var(--border-main)] pb-2 font-sans">Menaces</h3>
            <div className="space-y-2">
              {location.monsters?.map((monster: any) => (
                <Link href={`/bestiary/${monster.slug}`} key={monster._id} className="block bg-[var(--bg-card)] border border-[var(--border-main)] rounded px-3 py-2 text-sm text-[var(--accent-primary)] font-bold hover:bg-[var(--bg-input)] hover:border-[var(--accent-primary)] transition shadow-sm flex justify-between items-center group">
                  <span className="group-hover:translate-x-1 transition-transform truncate">{monster.name}</span>
                  <span className="text-[var(--text-muted)] text-xs font-normal whitespace-nowrap ml-2">CR {monster.cr}</span>
                </Link>
              ))}
              {(!location.monsters || location.monsters.length === 0) && <p className="text-sm text-[var(--text-muted)] italic">Zone sûre.</p>}
            </div>
          </div>

        </div>
      </div>

      <AdminToolbar id={location._id} editUrl={`/locations/${location._id}/edit`} type="location" />
    </div>
  )
}