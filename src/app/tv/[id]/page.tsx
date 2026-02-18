import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function TVPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  // On cherche d'abord si c'est une Battlemap
  const map = await prisma.battlemap.findUnique({
    where: { id: params.id }
  })

  // Si ce n'est pas une map, on regarde si c'est un Lieu (Location)
  // (Pour la rétro-compatibilité si tu veux projeter l'image d'un lieu)
  let imageUrl = map?.image
  
  if (!imageUrl) {
    const loc = await prisma.location.findUnique({ where: { id: params.id } })
    imageUrl = loc?.image || null
  }

  if (!imageUrl) return notFound()

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={imageUrl} 
        alt="Battlemap"
        className="max-w-full max-h-screen object-contain"
      />
    </div>
  )
}