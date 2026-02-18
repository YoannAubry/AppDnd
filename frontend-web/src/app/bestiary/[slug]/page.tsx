import { AdminToolbar } from "@/components/ui/adminToolbar"
import { BackButton } from "@/components/ui/BackButton"
import Link from "next/link"
import { getMonster } from "@/app/actions/getters"

interface Monster {
  _id: string;
  name: string;
  image?: any;
  type?: string;
  slug?: { current: string };
  stats?: {
    ac?: number;
    hp?: string;
    speed?: string;
    challenge?: string;
    alignment?: string;
    senses?: string;
    languages?: string;
    attributes?: { str: number; dex: number; con: number; int: number; wis: number; cha: number; };
    traits?: { name: string; desc: string }[];
    actions?: { name: string; desc: string }[];
  };
}

export default async function MonsterDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const monster: Monster = await getMonster(params.slug)

  if (!monster) return <div>Introuvable</div>

  const attrs = monster.stats?.attributes || { str:10, dex:10, con:10, int:10, wis:10, cha:10 };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-serif p-4 md:p-8 flex justify-center pb-20">
      <div className="max-w-4xl w-full bg-[var(--bg-card)] shadow-2xl rounded-lg overflow-hidden border border-[var(--border-accent)] relative">
        
        {/* HEADER */}
        <div className="bg-[var(--bg-input)] p-6 border-b border-[var(--border-main)] flex flex-col gap-2">
          
          {/* LIGNE DU HAUT : BOUTON RETOUR (Aligné à droite) */}
          <div className="flex justify-end">
            <BackButton 
              fallbackUrl="/bestiary" 
              label="✕ FERMER" 
              className="text-[10px] font-sans font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card)] px-3 py-1.5 rounded-full border border-[var(--border-main)] hover:border-[var(--accent-primary)] shadow-sm"
            />
          </div>

          {/* LIGNE DU BAS : TITRE */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-1 text-[var(--accent-primary)] leading-tight">
              {monster.name}
            </h1>
            <p className="italic opacity-70 text-lg text-[var(--text-muted)]">
              {monster.type || 'Créature'}
              {monster.stats?.alignment ? `, ${monster.stats.alignment}` : ''}
            </p>
          </div>
        </div>

        {/* CONTENU (Reste inchangé) */}
        <div className="p-6 md:p-10 grid md:grid-cols-2 gap-12">
          {/* GAUCHE : STATS */}
          <div>
            <div className="flex flex-wrap gap-4 mb-8 font-bold text-lg border-b border-[var(--border-main)] pb-6 text-[var(--text-main)]">
              <span className="flex items-center gap-2">🛡️ CA {monster.stats?.ac || '?'}</span>
              <span className="flex items-center gap-2">❤️ PV {monster.stats?.hp || '?'}</span>
              <span className="flex items-center gap-2">🦶 {monster.stats?.speed || '9m'}</span>
              {monster.stats?.challenge && <span className="bg-[var(--accent-primary)] text-[var(--bg-main)] text-xs px-2 py-1 rounded self-center font-bold font-sans">CR {monster.stats.challenge}</span>}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center mb-8">
              {Object.entries(attrs).map(([key, val]: any) => (
                <div key={key} className="flex flex-col bg-[var(--bg-input)] p-2 rounded border border-[var(--border-main)]">
                  <span className="text-xs font-bold uppercase text-[var(--accent-primary)]">{key.substring(0,3)}</span>
                  <span className="font-bold text-lg">{val}</span>
                  <span className="text-xs text-[var(--text-muted)] font-mono">
                    {Math.floor((Number(val) - 10) / 2) >= 0 ? '+' : ''}{Math.floor((Number(val) - 10) / 2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm text-[var(--text-muted)] mb-8 bg-[var(--bg-input)] p-4 rounded-lg border border-[var(--border-main)] font-sans">
              <p><strong className="text-[var(--text-main)]">Sens:</strong> {monster.stats?.senses || '-'}</p>
              <p><strong className="text-[var(--text-main)]">Langues:</strong> {monster.stats?.languages || '-'}</p>
            </div>

            {/* TRAITS */}
            <div className="space-y-4">
              {monster.stats?.traits?.map((t: any, i: number) => (
                <div key={i}>
                  <span className="font-bold italic text-[var(--accent-primary)]">{t.name}.</span> <span className="text-[var(--text-main)]">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DROITE : ACTIONS & IMAGE */}
          <div>
            {monster.image && (
              <div className="mb-8 rounded-lg overflow-hidden border border-[var(--border-accent)] shadow-md bg-black relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={monster.image as string}
                  alt={monster.name} 
                  className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition"
                />
              </div>
            )}

            {monster.stats?.actions && (
              <div>
                <h3 className="text-xl font-bold text-[var(--accent-primary)] border-b border-[var(--border-main)] mb-4 pb-1 uppercase tracking-wide font-sans">Actions</h3>
                <div className="space-y-6">
                  {monster.stats.actions.map((a: any, i: number) => (
                    <div key={i} className="pl-4 border-l-2 border-[var(--accent-primary)]/30">
                      <span className="font-bold italic text-[var(--accent-primary)] text-lg block mb-1">{a.name}</span> 
                      <p className="text-[var(--text-muted)] leading-relaxed">{a.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <AdminToolbar id={monster._id} editUrl={`/bestiary/${params.slug}/edit`} type="monster" />
      </div>
    </div>
  )
}