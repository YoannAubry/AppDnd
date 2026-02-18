import { prisma } from "@/lib/prisma"
import NewMapForm from "./NewMapForm"

export default async function NewMapPage() {
  // On charge la liste des lieux pour le sélecteur
  const locations = await prisma.location.findMany({ 
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  })

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-8 flex justify-center">
      <div className="max-w-2xl w-full bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-[var(--accent-primary)] mb-8">Nouvelle Battlemap</h1>
        <NewMapForm locations={locations} />
      </div>
    </div>
  )
}