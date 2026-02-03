import { client, urlFor } from "../../lib/sanity"
import Link from "next/link"

async function getPlayers() {
  return await client.fetch(`*[_type == "player"] | order(name asc) {
    _id, name, playerName, avatar, race, class, hpMax, ac
  }`)
}

export default async function PlayersPage() {
  const players = await getPlayers()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">🛡️ La Compagnie</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((p: any) => (
          <Link href={`/players/${p._id}`} key={p._id} className="block group h-full">
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-lg hover:border-blue-500 transition h-full flex items-center p-4 gap-4">
              
              {/* Avatar Rond */}
              <div className="w-16 h-16 rounded-full border-2 border-slate-600 overflow-hidden shrink-0 bg-slate-800">
                {p.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={urlFor(p.avatar).width(100).url()} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">{p.name}</h2>
                <p className="text-slate-400 text-sm">{p.class} • {p.race}</p>
              </div>

              {/* Mini Stats */}
              <div className="flex flex-col gap-1 text-right border-l border-slate-800 pl-4">
                <span className="text-green-400 font-bold text-sm">PV {p.hpMax}</span>
                <span className="text-blue-400 font-bold text-sm">CA {p.ac}</span>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}