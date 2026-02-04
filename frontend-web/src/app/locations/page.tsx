"use client"

import { useState, useEffect } from "react"
import { client, urlFor } from "../../lib/sanity"
import Link from "next/link"

// Type simple pour la liste
interface LocationItem {
  _id: string
  name: string
  image?: any
  npcCount: number
  monsterCount: number
}

async function getLocations() {
  // On compte les liens pour afficher des badges
  return await client.fetch(`*[_type == "location"] | order(name asc) {
    _id, name, image,
    "npcCount": count(npcs),
    "monsterCount": count(monsters)
  }`)
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationItem[]>([])
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
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-950 text-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-800 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-amber-500">🗺️ Lieux</h1>
          <p className="text-slate-400 mt-2">Atlas du monde ({filtered.length})</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg w-full md:w-64 focus:outline-none focus:border-amber-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link href="/locations/new" className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-lg transition whitespace-nowrap">
            + Nouveau
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 animate-pulse">Chargement de la carte...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(loc => (
            <Link href={`/locations/${loc._id}`} key={loc._id} className="group block">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:border-amber-500/50 transition h-full flex flex-col hover:-translate-y-1">
                
                <div className="h-40 bg-slate-800 relative overflow-hidden">
                  {loc.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={urlFor(loc.image).width(400).url()} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🏰</div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-900 to-transparent"></div>
                </div>

                <div className="p-4 flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition">{loc.name}</h3>
                  <div className="flex gap-2">
                    {loc.npcCount > 0 && <span className="text-xs bg-blue-900/50 text-blue-200 px-2 py-1 rounded border border-blue-800">👤 {loc.npcCount} PNJ</span>}
                    {loc.monsterCount > 0 && <span className="text-xs bg-red-900/50 text-red-200 px-2 py-1 rounded border border-red-800">⚔️ {loc.monsterCount} Monstres</span>}
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}