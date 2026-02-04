import { client } from "@/lib/sanity"
import EditPlayerForm from "./EditPlayerForm"

export default async function EditPlayerPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const player = await client.fetch(`*[_type == "player" && _id == $id][0]`, { id: params.id })

  if (!player) return <div>Joueur introuvable</div>

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex justify-center pb-20">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-500 mb-8 flex items-center gap-3">
          <span>✏️</span> Modifier {player.name}
        </h1>
        <EditPlayerForm player={player} />
      </div>
    </div>
  )
}