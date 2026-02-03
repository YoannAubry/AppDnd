import { client, urlFor } from "../../../lib/sanity"
import Link from "next/link"
import { Badge } from "../../../components/ui/Badge"

async function getPlayer(id: string) {
  return await client.fetch(`*[_type == "player" && _id == $id][0]{
    name, playerName, avatar, race, class, level,
    hpMax, ac, pp, spellSaveDC, initBonus,
    inventory[]->{ name, description, isMagic, rarity, value, type }
  }`, { id })
}

export default async function PlayerDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const player = await getPlayer(params.id)

  if (!player) return <div className="p-20 text-center">Héros introuvable 🤷‍♂️</div>

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      
      {/* HEADER HERO */}
      <div className="relative h-64 bg-gradient-to-r from-blue-900 to-purple-900 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 flex items-end gap-6 max-w-5xl mx-auto">
          {/* Avatar Géant */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-900 overflow-hidden shadow-2xl bg-slate-800 -mb-12 relative z-10">
            {player.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={urlFor(player.avatar).width(400).url()} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
            )}
          </div>
          
          <div className="mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-1">{player.name}</h1>
            <p className="text-blue-200 text-lg">{player.race} • {player.class} Niv {player.level}</p>
          </div>
        </div>

        <Link href="/players" className="absolute top-6 left-6 bg-black/30 hover:bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm transition font-sans text-sm font-bold">
          ← Groupe
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-16 grid md:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : STATS DE COMBAT */}
        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-bold text-blue-400 mb-4 border-b border-slate-700 pb-2">Combat</h2>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <StatBox label="PV Max" value={player.hpMax} color="text-green-400" />
              <StatBox label="Classe d'Armure" value={player.ac} color="text-blue-400" />
              <StatBox label="Initiative" value={player.initBonus >= 0 ? `+${player.initBonus}` : player.initBonus} />
              <StatBox label="Perception Pass." value={player.pp} />
              <StatBox label="DD Sorts" value={player.spellSaveDC} color="text-purple-400" />
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : INVENTAIRE & SORTS */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Inventaire */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-bold text-amber-400 mb-4 border-b border-slate-700 pb-2 flex justify-between items-center">
              <span>🎒 Inventaire</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-900 px-2 py-1 rounded-full">
                {player.inventory?.length || 0} objets
              </span>
            </h2>

            <div className="space-y-3">
              {player.inventory?.map((item: any, i: number) => (
                <div key={i} className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex items-start gap-4 hover:border-slate-600 transition">
                  <div className={`w-2 h-full rounded-l ${item.isMagic ? 'bg-purple-500' : 'bg-slate-600'}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-bold ${item.isMagic ? 'text-purple-300' : 'text-slate-200'}`}>{item.name}</h4>
                      <Badge className="text-[10px] bg-slate-800">{item.type}</Badge>
                    </div>
                    {/* Affichage description riche simplifié */}
                    {item.description && (
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                        {/* Astuce rapide pour le texte riche sans parser lourd : on affiche le premier bloc de texte */}
                        {item.description[0]?.children[0]?.text || "..."}
                      </p>
                    )}
                    <div className="mt-2 flex gap-2 text-xs text-slate-500">
                      <span>{item.rarity}</span>
                      {item.value && <span>• {item.value}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {!player.inventory && <p className="text-slate-500 italic">Sac vide...</p>}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

function StatBox({ label, value, color = "text-white" }: any) {
  return (
    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500 font-bold">{label}</div>
    </div>
  )
}