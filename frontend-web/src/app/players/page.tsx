import { client, urlFor } from "../../lib/sanity"
import { Badge } from "../../components/ui/Badge"

async function getPlayers() {
  return await client.fetch(`*[_type == "player"] | order(name asc) {
    _id,
    name,
    playerName,
    avatar,
    race,
    class,
    level,
    hpMax,
    ac,
    pp, // Perception Passive
    spellSaveDC,
    inventory[]->{ name, isMagic }
  }`)
}

export default async function PlayersPage() {
  const players = await getPlayers()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">🛡️ La Compagnie</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {players.map((p: any) => (
          <div key={p._id} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl relative group">
            
            {/* Bannière Classe */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

            <div className="p-6 flex items-start gap-4">
              {/* Avatar Rond */}
              <div className="w-20 h-20 rounded-full border-2 border-slate-600 overflow-hidden shrink-0 shadow-lg">
                {p.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={urlFor(p.avatar).width(200).url()} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-2xl">👤</div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white leading-none mb-1">{p.name}</h2>
                <p className="text-slate-400 text-sm mb-2">{p.race} • {p.class} {p.level}</p>
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Joué par {p.playerName}</div>
              </div>
            </div>

            {/* Stats Rapides (Utile pour le MJ) */}
            <div className="grid grid-cols-3 border-t border-b border-slate-800 bg-slate-900/50">
              <div className="p-3 text-center border-r border-slate-800">
                <span className="block text-xl font-bold text-green-400">{p.hpMax}</span>
                <span className="text-[10px] text-slate-500 uppercase">PV Max</span>
              </div>
              <div className="p-3 text-center border-r border-slate-800">
                <span className="block text-xl font-bold text-blue-400">{p.ac}</span>
                <span className="text-[10px] text-slate-500 uppercase">CA</span>
              </div>
              <div className="p-3 text-center">
                <span className="block text-xl font-bold text-purple-400">{p.pp}</span>
                <span className="text-[10px] text-slate-500 uppercase">Perception</span>
              </div>
            </div>

            {/* Inventaire Notable */}
            {p.inventory && p.inventory.length > 0 && (
              <div className="p-4 bg-slate-950/30">
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Équipement Notable</p>
                <div className="flex flex-wrap gap-2">
                  {p.inventory.map((item: any, i: number) => (
                    <Badge key={i} color={item.isMagic ? 'purple' : 'gray'} className="text-[10px]">
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}