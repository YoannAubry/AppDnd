import EditPlayerForm from "./EditPlayerForm"
import { getPlayer } from "@/app/actions/getters"

export default async function EditPlayerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const player = await getPlayer(params.id )

  if (!player) return <div>Joueur introuvable</div>

  return (
    <div className="min-h-screen bg-background text-[var(--text-main)] p-8 flex justify-center pb-20">
      <div className="max-w-xl w-full theme-card border border-[var(--border-main)] rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-500 mb-8 flex items-center gap-3">
          <span>✏️</span> Modifier {player.name}
        </h1>
        <EditPlayerForm player={player} />
      </div>
    </div>
  )
}