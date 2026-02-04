import { client, urlFor } from "@/lib/sanity"
import Link from "next/link"
import { AdminToolbar } from "@/components/ui/adminToolbar"

async function getNPC(id: string) {
  return await client.fetch(`*[_type == "npc" && _id == $id][0]{
    _id, name, role, personality, history, image,
    faction->{name, description, image},
    monsterTemplate->{name, "slug": slug.current},
    customStats,
    inventory, 
    spells
  }`, { id })
}

export default async function NPCDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const npc = await getNPC(params.id)

  if (!npc) return <div className="p-20 text-center text-[var(--text-muted)]">PNJ introuvable</div>

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-8 flex justify-center font-serif">
      <div className="max-w-3xl w-full bg-[var(--bg-card)] shadow-xl rounded-lg overflow-hidden border border-[var(--border-accent)] relative">
        
        {/* HEADER */}
        <div className="relative h-64 bg-[var(--bg-input)]">
          {npc.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={urlFor(npc.image).width(800).url()} className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl opacity-50">👤</div>
          )}
          <Link href="/npcs" className="absolute top-4 left-4 bg-black/40 text-white px-3 py-1 rounded text-sm hover:bg-black/60 backdrop-blur-sm transition font-sans">
            ← Retour
          </Link>
        </div>

        <div className="p-8 pb-24">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[var(--accent-primary)] mb-1 font-serif">{npc.name}</h1>
              <p className="text-[var(--text-muted)] italic text-lg">{npc.role}</p>
            </div>
            
            {npc.faction && (
              <div className="flex items-center gap-2 bg-[var(--bg-input)] px-3 py-1 rounded-full border border-[var(--border-main)] shadow-sm">
                {npc.faction.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={urlFor(npc.faction.image).width(30).url()} className="w-6 h-6 rounded-full" />
                )}
                <span className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider">{npc.faction.name}</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section>
                <h3 className="font-bold text-[var(--text-muted)] uppercase text-xs border-b border-[var(--border-main)] pb-1 mb-2 tracking-widest font-sans">Personnalité</h3>
                <p className="text-[var(--text-main)] leading-relaxed text-sm italic">{npc.personality || "Non définie."}</p>
              </section>

              <section>
                <h3 className="font-bold text-[var(--text-muted)] uppercase text-xs border-b border-[var(--border-main)] pb-1 mb-2 tracking-widest font-sans">Histoire</h3>
                <p className="text-[var(--text-main)] leading-relaxed text-sm">{npc.history || "Inconnue."}</p>
              </section>
            </div>

            <div className="space-y-6">
              {/* Inventaire */}
              <section>
                <h3 className="font-bold text-[var(--text-muted)] uppercase text-xs border-b border-[var(--border-main)] pb-1 mb-2 tracking-widest font-sans">Équipement</h3>
                <ul className="space-y-2">
                  {npc.inventory?.map((item: any, i: number) => (
                    <li key={i} className="text-sm bg-[var(--bg-input)] p-2 rounded border border-[var(--border-main)] flex justify-between">
                      <strong className="text-[var(--text-main)]">{item.name}</strong> 
                      <span className="text-[var(--text-muted)] text-xs">{item.desc}</span>
                    </li>
                  ))}
                  {!npc.inventory && <li className="text-[var(--text-muted)] italic text-sm">Rien de notable.</li>}
                </ul>
              </section>
              
              {/* Sorts */}
              {npc.spells && npc.spells.length > 0 && (
                <section>
                  <h3 className="font-bold text-[var(--text-muted)] uppercase text-xs border-b border-[var(--border-main)] pb-1 mb-2 tracking-widest font-sans">Sorts</h3>
                  <div className="flex flex-wrap gap-2">
                    {npc.spells.map((spell: string, i: number) => (
                       <span key={i} className="text-xs bg-[var(--bg-input)] text-[var(--accent-hover)] px-2 py-1 rounded border border-[var(--border-main)]">
                         ✨ {spell}
                       </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Lien Combat */}
              {npc.monsterTemplate && (
                <div className="mt-8 pt-4">
                  <Link href={`/bestiary/${npc.monsterTemplate.slug}`} className="bg-[var(--bg-input)] border border-[var(--border-accent)] px-4 py-3 rounded flex justify-between items-center hover:bg-[var(--accent-primary)] hover:text-[var(--accent-text)] transition group shadow-sm">
                    <div>
                      <span className="text-xs font-bold uppercase block mb-1 opacity-70">Fiche Technique</span>
                      <span className="font-bold font-serif group-hover:underline">{npc.monsterTemplate.name}</span>
                    </div>
                    <span>➜</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <AdminToolbar id={npc._id} editUrl={`/npcs/${params.id}/edit`} type="npc" />
      </div>
    </div>
  )
}