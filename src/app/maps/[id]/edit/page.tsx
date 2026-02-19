import { prisma } from "@/lib/prisma"
import EditMapForm from "./EditMapForm"

export default async function EditMapPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const [map, locations] = await Promise.all([
    prisma.battlemap.findUnique({ where: { id: params.id } }),
    prisma.location.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
  ])

  if (!map) return <div>Carte introuvable</div>

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-8 flex justify-center">
      <div className="max-w-2xl w-full bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-[var(--accent-primary)] mb-8">Modifier : {map.name}</h1>
        <EditMapForm map={map} locations={locations} />
      </div>
    </div>
  )
}