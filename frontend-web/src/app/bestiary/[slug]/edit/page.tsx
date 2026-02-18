import { updateMonsterAction } from "../../../../app/actions/bestiary" // Vérifie ton import
import EditMonsterForm from "./EditMonsterForm" // On va créer ce composant client séparé
import { getMonster } from "@/app/actions/getters"

// Server Component pour fetcher les données
export default async function EditPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const monster = await getMonster(params.slug)

  if (!monster) return <div>Monstre introuvable</div>

  return (
    <div className="min-h-screen bg-background text-[var(--text-main)] p-8 flex justify-center pb-20">
      <div className="max-w-3xl w-full theme-card border border-[var(--border-main)] rounded-xl p-8 shadow-2xl relative">
        <h1 className="text-3xl font-bold text-blue-500 mb-8 flex items-center gap-3">
          <span>✏️</span> Modifier : {monster.name}
        </h1>
        {/* On passe les données au formulaire Client */}
        <EditMonsterForm monster={monster} />
      </div>
    </div>
  )
}