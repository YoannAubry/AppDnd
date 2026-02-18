import { getNPCs, getMonsters } from "@/app/actions/getters"
import NewLocationForm from "./NewLocationForm"

// Composant serveur pour charger les listes PNJ/Monstres
export default async function NewLocationPage() {
  const [allNpcs, allMonsters] = await Promise.all([
    getNPCs(),
    getMonsters()
  ])

  return (
    <div className="min-h-screen bg-background text-[var(--text-main)] p-8 flex justify-center pb-20">
      <div className="max-w-3xl w-full theme-card border border-[var(--border-main)] rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-green-500 mb-8">Nouveau Lieu</h1>
        <NewLocationForm allNpcs={allNpcs} allMonsters={allMonsters} />
      </div>
    </div>
  )
}