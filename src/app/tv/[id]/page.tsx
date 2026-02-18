import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function TVPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  // 1. Chercher dans les Battlemaps
  const map = await prisma.battlemap.findUnique({
    where: { id: params.id }
  })

  // 2. Si pas trouvé, chercher dans les Lieux (Location)
  // (On déclare explicitement imageUrl pour gérer les types string | null | undefined)
  let imageUrl: string | null | undefined = map?.image
  
  if (!imageUrl) {
    const loc = await prisma.location.findUnique({ where: { id: params.id } })
    imageUrl = loc?.image
  }

  // 3. Si toujours rien, 404
  if (!imageUrl) return notFound()

  return (
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={imageUrl} 
        alt="Battlemap"
        className="w-full h-screen object-contain"
      />
    </div>
  )
}