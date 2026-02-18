import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { AppImage } from "@/components/ui/AppImage"

export default async function MapsPage() {
  const maps = await prisma.battlemap.findMany({
    orderBy: { name: 'asc' },
    include: { location: true } // On récupère le nom du lieu lié
  })

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      
      <div className="flex justify-between items-end mb-8 border-b border-[var(--border-main)] pb-6">
        <div>
          <h1 className="text-4xl font-bold text-[var(--accent-primary)] font-serif">🗺️ Battlemaps</h1>
          <p className="text-[var(--text-muted)] mt-2">Cartes tactiques ({maps.length})</p>
        </div>
        
        <Link href="/maps/new" className="theme-btn-primary flex items-center gap-2">
          <span>+</span> Ajouter une Carte
        </Link>
      </div>

      {maps.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-muted)] border-2 border-dashed border-[var(--border-main)] rounded-xl">
          Aucune carte. Ajoutez votre première battlemap !
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {maps.map(map => (
            <div key={map.id} className="theme-card rounded-xl overflow-hidden shadow-lg group hover:border-[var(--accent-primary)] transition">
              
              {/* IMAGE (Cliquable pour ouvrir la TV) */}
              <Link href={`/tv/${map.id}`} target="_blank" className="block relative h-48 bg-black overflow-hidden group-hover:opacity-90 transition">
                <AppImage src={map.image} alt={map.name} type="location" className="object-cover w-full h-full" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40">
                  <span className="text-white font-bold text-lg border border-white px-4 py-2 rounded-full">📺 Projeter</span>
                </div>
              </Link>

              <div className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-[var(--text-main)]">{map.name}</h3>
                  {map.location && (
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1">
                      📍 {map.location.name}
                    </span>
                  )}
                </div>
                
                {/* Actions Rapides (Delete / Edit) */}
                {/* (À ajouter plus tard si besoin) */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}