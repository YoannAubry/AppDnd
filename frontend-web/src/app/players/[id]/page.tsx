import { client, urlFor } from "../../../lib/sanity"
import Link from "next/link"
import { AdminToolbar } from "../../../components/ui/adminToolbar"

async function getPlayer(id: string) {
  return await client.fetch(`*[_type == "player" && _id == $id][0]{
    name, playerName, avatar, race, class, hpMax, ac, initBonus
  }`, { id })
}

export default async function PlayerDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const player = await getPlayer(params.id)

  if (!player) return <div>Introuvable</div>

  return (
    <div className="min-h-screen theme-card text-[var(--text-main)] flex items-center justify-center p-4">
      
      <div className="max-w-md w-full bg-input rounded-2xl border border-[var(--border-main)] shadow-2xl overflow-hidden relative">
        <Link href="/players" className="absolute top-4 left-4 text-[var(--text-muted)] hover:text-white z-10 font-bold">← Retour</Link>

        {/* Header Image */}
        <div className="h-32 bg-gradient-to-br from-blue-600 to-purple-700"></div>
        
        {/* Avatar centré */}
        <div className="flex justify-center -mt-16">
          <div className="w-32 h-32 rounded-full border-4 border-[var(--border-main)] overflow-hidden bg-slate-700">
            {player.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={urlFor(player.avatar).width(400).url()} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
            )}
          </div>
        </div>

        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-1">{player.name}</h1>
          <p className="text-[var(--text-muted)] mb-6">{player.race} • {player.class}</p>

          <div className="grid grid-cols-3 gap-4 border-t border-[var(--border-main)] pt-6">
            <div>
              <span className="block text-2xl font-bold text-green-400">{player.hpMax}</span>
              <span className="text-xs text-slate-500 uppercase font-bold">PV Max</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-blue-400">{player.ac}</span>
              <span className="text-xs text-slate-500 uppercase font-bold">CA</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-white">{player.initBonus >= 0 ? `+${player.initBonus}` : player.initBonus}</span>
              <span className="text-xs text-slate-500 uppercase font-bold">Init</span>
            </div>
          </div>
          
          <div className="mt-6 text-xs text-slate-600 uppercase tracking-widest">
            Joué par {player.playerName}
          </div>
        </div>

      </div>

      <AdminToolbar 
          id={player._id} 
          editUrl={`/players/${params.id}/edit`} 
          type="player"
        />
    </div>
  )
}