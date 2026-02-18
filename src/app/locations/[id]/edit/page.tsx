import { getMonster, getLocation, getNPC } from "@/app/actions/getters"
import EditLocationForm from "./EditLocationForm"

export default async function EditLocationPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  // Parallélisation des requêtes
  const [location, allNpcs, allMonsters] = await Promise.all([
    getLocation(params.id),
    getNPC(`*[_type == "npc"] | order(name asc) { _id, name }`),
    getMonster(`*[_type == "monster"] | order(name asc) { _id, name }`)
  ])

  if (!location) return <div>Introuvable</div>

  return (
    <div className="min-h-screen bg-background text-[var(--text-main)] p-8 flex justify-center pb-20">
      <div className="max-w-3xl w-full theme-card border border-[var(--border-main)] rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-amber-500 mb-8">Modifier : {location.name}</h1>
        <EditLocationForm location={location} allNpcs={allNpcs} allMonsters={allMonsters} />
      </div>
    </div>
  )
}