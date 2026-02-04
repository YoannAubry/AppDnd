import { client, urlFor } from "@/lib/sanity"
import Link from "next/link"
import { AdminToolbar } from "@/components/ui/adminToolbar"

// (Interface Monster inchangée...)
interface Monster { name: string; image?: any; type?: string; stats?: any; _id: string; }

async function getMonster(slug: string) {
  return await client.fetch(`*[_type == "monster" && slug.current == $slug][0]`, { slug })
}

export default async function MonsterDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const monster: Monster = await getMonster(params.slug)

  if (!monster) return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center p-4 text-[var(--text-muted)]">
      <h1 className="text-2xl mb-4">Monstre introuvable 🕵️‍♂️</h1>
      <Link href="/bestiary" className="text-[var(--accent-primary)] hover:underline">Retour au Bestiaire</Link>
    </div>
  )

  const attrs = monster.stats?.attributes || { str:10, dex:10, con:10, int:10, wis:10, cha:10 };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-serif p-4 md:p-8 flex justify-center">
      <div className="max-w-4xl w-full bg-[var(--bg-card)] shadow-2xl rounded-lg overflow-hidden border border-[var(--border-accent)] relative">
        
        {/* HEADER */}
        <div className="bg-[var(--bg-input)] p-6 relative border-b border-[var(--border-main)]">
          <Link href="/bestiary" className="absolute top-6 right-6 text-sm font-sans opacity-60 hover:opacity-100 font-bold text-[var(--text-main)]">
            ❌ FERMER
          </Link>
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-1 text-[var(--accent-primary)]">{monster.name}</h1>
          <p className="italic opacity-70 text-lg text-[var(--text-muted)]">
            {monster.type || 'Créature'}
            {monster.stats?.alignment ? `, ${monster.stats.alignment}` : ''}
          </p>
        </div>

        <div className="p-6 md:p-10 grid md:grid-cols-2 gap-12 pb-24">
          {/* GAUCHE */}
          <div>
            <div className="flex flex-wrap gap-4 mb-8 font-bold text-lg border-b border-[var(--border-main)] pb-6 text-[var(--text-main)]">
              <span className="flex items-center gap-2">🛡️ CA {monster.stats?.ac || '?'}</span>
              <span className="flex items-center gap-2">❤️ PV {monster.stats?.hp || '?'}</span>
              <span className="flex items-center gap-2">🦶 {monster.stats?.speed || '9m'}</span>
              {monster.stats?.challenge && <span className="bg-[var(--accent-primary)] text-[var(--bg-main)] text-xs px-2 py-1 rounded self-center font-bold">CR {monster.stats.challenge}</span>}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center mb-8">
              {Object.entries(attrs).map(([key, val]: any) => (
                <div key={key} className="flex flex-col bg-[var(--bg-input)] p-2 rounded border border-[var(--border-main)]">
                  <span className="text-xs font-bold uppercase text-[var(--accent-primary)]">{key.substring(0,3)}</span>
                  <span className="font-bold">{val}</span>
                  <span className="text-xs text-[var(--text-muted)] font-mono">
                    {Math.floor((Number(val) - 10) / 2) >= 0 ? '+' : ''}{Math.floor((Number(val) - 10) / 2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {monster.stats?.traits?.map((t: any, i: number) => (
                <div key={i}>
                  <span className="font-bold italic text-[var(--accent-primary)]">{t.name}.</span> <span className="text-[var(--text-main)]">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DROITE */}
          <div>
            {monster.image && (
              <div className="mb-8 rounded-lg overflow-hidden border border-[var(--border-accent)] shadow-md bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={urlFor(monster.image).width(600).url()} 
                  alt={monster.name} 
                  className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition"
                />
              </div>
            )}

            {monster.stats?.actions && (
              <div>
                <h3 className="text-2xl font-bold text-[var(--accent-primary)] border-b border-[var(--border-main)] mb-4 pb-1 uppercase tracking-wide">Actions</h3>
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