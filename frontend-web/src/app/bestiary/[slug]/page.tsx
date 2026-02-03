import { client, urlFor } from "../../../lib/sanity"
import Link from "next/link"
import { Badge } from "../../../components/ui/Badge"

// Type pour être sûr de ce qu'on manipule
interface Monster {
  name: string;
  image?: any;
  type?: string;
  stats?: {
    ac?: number;
    hp?: string;
    speed?: string;
    challenge?: string;
    alignment?: string;
    senses?: string;
    languages?: string;
    attributes?: {
      str: number; dex: number; con: number;
      int: number; wis: number; cha: number;
    };
    traits?: { name: string; desc: string }[];
    actions?: { name: string; desc: string }[];
  };
}

async function getMonster(slug: string) {
  // On log pour voir ce qu'on reçoit (regarde ton terminal serveur)
  console.log("Fetching monster with slug:", slug);
  
  return await client.fetch(
    `*[_type == "monster" && slug.current == $slug][0]`, 
    { slug: slug } // Explicite
  )
}

export default async function MonsterDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;

  const monster: Monster = await getMonster(slug);

  if (!monster) return (
    <div className="p-20 text-center text-slate-500">
      <h1 className="text-2xl mb-4">Monstre introuvable 🕵️‍♂️</h1>
      <Link href="/bestiary" className="text-purple-400 hover:underline">Retour au Bestiaire</Link>
    </div>
  )

  // Valeur par défaut pour éviter le crash sur les attributs
  const attrs = monster.stats?.attributes || { str:10, dex:10, con:10, int:10, wis:10, cha:10 };

  return (
    <div className="min-h-screen bg-[#fdf1dc] text-slate-900 font-serif p-4 md:p-8 flex justify-center">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-lg overflow-hidden border-4 border-[#7a200d]">
        
        {/* HEADER */}
        <div className="bg-[#7a200d] text-[#fdf1dc] p-6 relative">
          <Link href="/bestiary" className="absolute top-6 right-6 text-sm font-sans opacity-80 hover:opacity-100 font-bold">
            ❌ FERMER
          </Link>
          <h1 className="text-4xl font-bold uppercase tracking-wider mb-1">{monster.name}</h1>
          <p className="italic opacity-90 text-lg">
            {monster.type || 'Créature inconnue'}
            {monster.stats?.alignment ? `, ${monster.stats.alignment}` : ''}
          </p>
        </div>

        <div className="p-6 md:p-10 grid md:grid-cols-2 gap-12">
          {/* COLONNE GAUCHE : STATS */}
          <div>
            <div className="flex flex-wrap gap-4 mb-8 text-[#7a200d] font-bold text-lg border-b border-[#7a200d]/20 pb-6">
              <span className="flex items-center gap-2">🛡️ CA {monster.stats?.ac || '?'}</span>
              <span className="flex items-center gap-2">❤️ PV {monster.stats?.hp || '?'}</span>
              <span className="flex items-center gap-2">🦶 {monster.stats?.speed || '9m'}</span>
            </div>

            {/* ATTRIBUTS */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center mb-8">
              {Object.entries(attrs).map(([key, val]) => (
                <div key={key} className="flex flex-col bg-[#fdf1dc] p-2 rounded border border-[#eecfa1]">
                  <span className="text-xs font-bold uppercase text-[#7a200d]">{key}</span>
                  <span className="font-bold text-lg">{val}</span>
                  <span className="text-xs text-slate-500 font-mono">
                    {Math.floor((Number(val) - 10) / 2) >= 0 ? '+' : ''}{Math.floor((Number(val) - 10) / 2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm text-slate-700 mb-8 bg-slate-50 p-4 rounded-lg">
              <p><strong>Sens:</strong> {monster.stats?.senses || '-'}</p>
              <p><strong>Langues:</strong> {monster.stats?.languages || '-'}</p>
              <p><strong>Challenge:</strong> {monster.stats?.challenge || '-'}</p>
            </div>

            {/* TRAITS */}
            {monster.stats?.traits && monster.stats.traits.length > 0 && (
              <div className="space-y-4">
                {monster.stats.traits.map((t, i) => (
                  <div key={i}>
                    <span className="font-bold italic text-[#7a200d]">{t.name}.</span> <span className="text-slate-800">{t.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLONNE DROITE : ACTIONS & IMAGE */}
          <div>
            {monster.image && (
              <div className="mb-8 rounded-lg overflow-hidden border-2 border-[#7a200d] shadow-md transform rotate-1 hover:rotate-0 transition duration-500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={urlFor(monster.image).width(600).url()} 
                  alt={monster.name} 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {monster.stats?.actions && monster.stats.actions.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-[#7a200d] border-b-2 border-[#7a200d] mb-4 pb-1 uppercase tracking-wide">Actions</h3>
                <div className="space-y-6">
                  {monster.stats.actions.map((a, i) => (
                    <div key={i} className="pl-4 border-l-2 border-[#7a200d]/30">
                      <span className="font-bold italic text-[#7a200d] text-lg block mb-1">{a.name}</span> 
                      <p className="text-slate-800 leading-relaxed">{a.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}