"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { client, urlFor } from "@/lib/sanity"

interface LocationListItem {
  _id: string
  name: string
  image?: any
  npcCount: number
  monsterCount: number
}

async function getLocations() {
  return await client.fetch(`*[_type == "location"] | order(name asc) {
    _id, name, image,
    "npcCount": count(npcs),
    "monsterCount": count(monsters)
  }`)
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationListItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLocations().then(data => {
      setLocations(data)
      setLoading(false)
    })
  }, [])

  const filtered = locations.filter(l => l.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      
      {/* HEADER RESPONSIVE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[var(--border-main)] pb-6 gap-4">
        
        {/* Titre */}
        <div className="w-full md:w-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent-primary)] font-serif">🗺️ Lieux</h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm md:text-base">Atlas du monde ({filtered.length})</p>
        </div>
        
        {/* Barre d'outils */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Rechercher..."
            className="theme-input w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link 
            href="/locations/new" 
            className="theme-btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>+</span> Nouveau
          </Link>
        </div>

      </div>

      {/* CHARGEMENT */}
      {loading ? (
        <div className="text-center py-20 text-[var(--text-muted)] animate-pulse">Chargement de la carte... 🌍</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(loc => (
            <Link href={`/locations/${loc._id}`} key={loc._id} className="group block h-full">
              <div className="theme-card rounded-xl overflow-hidden shadow-lg hover:border-[var(--accent-primary)] transition h-full flex flex-col hover:-translate-y-1 duration-300">
                
                {/* IMAGE */}
                <div className="h-40 bg-[var(--bg-input)] relative overflow-hidden shrink-0 flex items-center justify-center">
                  {loc.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={urlFor(loc.image).width(400).url()} 
                      alt={loc.name}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-500" 
                    />
                  ) : (
                    <div className="text-4xl opacity-50">🏰</div>
                  )}
                </div>

                {/* CONTENU */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--accent-primary)] transition font-serif">{loc.name}</h3>
                  
                  <div className="flex gap-2 mt-auto">
                    {loc.npcCount > 0 && (
                      <span className="text-xs bg-blue-900/20 text-blue-400 border border-blue-800/30 px-2 py-1 rounded flex items-center gap-1">
                        👤 {loc.npcCount}
                      </span>
                    )}
                    {loc.monsterCount > 0 && (
                      <span className="text-xs bg-red-900/20 text-red-400 border border-red-800/30 px-2 py-1 rounded flex items-center gap-1">
                        ⚔️ {loc.monsterCount}
                      </span>
                    )}
                    {loc.npcCount === 0 && loc.monsterCount === 0 && (
                      <span className="text-xs text-[var(--text-muted)] italic opacity-60">Vide</span>
                    )}
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-[var(--text-muted)] border-2 border-dashed border-[var(--border-main)] rounded-xl bg-[var(--bg-card)]/50">
          Aucun lieu trouvé.
        </div>
      )}
    </div>
  )
}