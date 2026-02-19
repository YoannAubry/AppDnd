import Link from "next/link"
import { AdminToolbar } from "@/components/ui/adminToolbar"
import { BackButton } from "@/components/ui/BackButton"
import { getNPC } from "@/app/actions/getters"



export default async function NPCDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const npc = await getNPC(params.id)

  if (!npc) return <div className="p-20 text-center text-[var(--text-muted)]">PNJ introuvable</div>

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-8 flex justify-center font-serif pb-20">
      <div className="max-w-3xl w-full bg-[var(--bg-card)] shadow-xl rounded-lg overflow-hidden border border-[var(--border-accent)] relative">
        
        {/* HEADER IMAGE */}
        <div className="relative h-48 md:h-64 bg-[var(--bg-input)]">
          {npc.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={npc.image} className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl opacity-50">👤</div>
          )}
          
          {/* BOUTON RETOUR INTELLIGENT */}
          {/* Si on vient de la campagne, Back() nous y ramène. Sinon, fallback vers /npcs */}
          <BackButton 
            fallbackUrl="/npcs" 
            label="← Retour" 
            className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 text-white px-3 py-1 rounded-full text-xs md:text-sm font-bold backdrop-blur-sm transition font-sans border border-white/10"
          />
          
        </div>

        {/* CONTENU */}
        <div className="p-6 md:p-8">
          
          {/* TITRE & RÔLE */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent-primary)] mb-1 font-serif leading-tight">{npc.name}</h1>
              <p className="text-[var(--text-muted)] italic text-base md:text-lg">{npc.role}</p>
            </div>
            
          </div>

          {/* GRILLE D'INFOS */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Colonne Gauche : Histoire */}
            <div className="space-y-6">
              {npc.personality && (
                <section>
                  <h3 className="font-bold text-[var(--text-muted)] uppercase text-xs border-b border-[var(--border-main)] pb-1 mb-2 tracking-widest font-sans">Personnalité</h3>
                  <p className="text-[var(--text-main)] leading-relaxed text-sm italic">{npc.personality}</p>
                </section>
              )}

              {npc.history && (
                <section>
                  <h3 className="font-bold text-[var(--text-muted)] uppercase text-xs border-b border-[var(--border-main)] pb-1 mb-2 tracking-widest font-sans">Histoire</h3>
                  <p className="text-[var(--text-main)] leading-relaxed text-sm whitespace-pre-line">{npc.history}</p>
                </section>
              )}
            </div>

            {/* Colonne Droite : Stats & Objets */}
            <div className="space-y-6">
              {/* Inventaire */}
              <section>
                <h3 className="font-bold text-[var(--text-muted)] uppercase text-xs border-b border-[var(--border-main)] pb-1 mb-2 tracking-widest font-sans">Équipement</h3>
                <ul className="space-y-2">
                  {npc.inventory?.map((item: any, i: number) => (
                    <li key={i} className="text-sm bg-[var(--bg-input)] p-2 rounded border border-[var(--border-main)] flex flex-col md:flex-row justify-between md:items-center gap-1">
                      <strong className="text-[var(--text-main)]">{item.name}</strong> 
                      <span className="text-[var(--text-muted)] text-xs italic">{item.desc}</span>
                    </li>
                  ))}
                  {(!npc.inventory || npc.inventory.length === 0) && <li className="text-[var(--text-muted)] italic text-sm">Rien de notable.</li>}
                </ul>
              </section>
              
              {/* Sorts */}
              {npc.spells && npc.spells.length > 0 && (
                <section>
                  <h3 className="font-bold text-[var(--text-muted)] uppercase text-xs border-b border-[var(--border-main)] pb-1 mb-2 tracking-widest font-sans">Sorts Connus</h3>
                  <div className="flex flex-wrap gap-2">
                    {npc.spells.map((spell: string, i: number) => (
                       <span key={i} className="text-xs bg-[var(--bg-input)] text-[var(--accent-hover)] px-2 py-1 rounded border border-[var(--border-main)] font-mono">
                         {spell}
                       </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Lien Combat */}
              {npc.monsterTemplate && (
                <div className="mt-8 pt-4 border-t border-[var(--border-main)]">
                  <Link href={`/bestiary/${npc.monsterTemplate.slug}`} className="bg-[var(--bg-input)] border border-[var(--border-accent)] px-4 py-3 rounded-lg flex justify-between items-center hover:bg-[var(--accent-primary)] hover:text-[var(--accent-text)] transition group shadow-sm">
                    <div>
                      <span className="text-[10px] font-bold uppercase block mb-1 opacity-70">Fiche Technique</span>
                      <span className="font-bold font-serif text-lg group-hover:underline">{npc.monsterTemplate.name}</span>
                    </div>
                    <span className="text-xl">⚔️</span>
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