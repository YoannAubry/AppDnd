import { client } from "../../../../lib/sanity"
import EditNPCForm from "./EditNPCForm"

export default async function EditNPCPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  // 1. Récupérer le PNJ
  const npcPromise = client.fetch(`*[_type == "npc" && _id == $id][0]`, { id: params.id })
  
  // 2. Récupérer la liste des monstres (juste ID et Nom) pour le menu déroulant
  const monstersPromise = client.fetch(`*[_type == "monster"] | order(name asc) {_id, name}`)

  // On attend les deux
  const [npc, monsters] = await Promise.all([npcPromise, monstersPromise])

  if (!npc) return <div>Introuvable</div>

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex justify-center pb-20">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-500 mb-8 flex items-center gap-3">
          <span>✏️</span> Modifier {npc.name}
        </h1>
        {/* On passe la liste des monstres au formulaire */}
        <EditNPCForm npc={npc} monstersList={monsters} />
      </div>
    </div>
  )
}