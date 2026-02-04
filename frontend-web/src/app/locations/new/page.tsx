import { client } from "../../../lib/sanity"
import NewLocationForm from "./NewLocationForm"

// Composant serveur pour charger les listes PNJ/Monstres
export default async function NewLocationPage() {
  const [allNpcs, allMonsters] = await Promise.all([
    client.fetch(`*[_type == "npc"] | order(name asc) { _id, name }`),
    client.fetch(`*[_type == "monster"] | order(name asc) { _id, name }`)
  ])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex justify-center pb-20">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-green-500 mb-8">Nouveau Lieu</h1>
        <NewLocationForm allNpcs={allNpcs} allMonsters={allMonsters} />
      </div>
    </div>
  )
}