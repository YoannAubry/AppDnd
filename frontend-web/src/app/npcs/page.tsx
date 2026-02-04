"use client"
import { useState, useEffect } from "react"
import { client, urlFor } from "@/lib/sanity"
import Link from "next/link"

async function getNPCs() {
  return await client.fetch(`*[_type == "npc"] | order(name asc) {
    _id, name, role, image, faction->{name}
  }`)
}

export default function NPCsPage() {
  const [npcs, setNpcs] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNPCs().then(data => {
      setNpcs(data)
      setLoading(false)
    })
  }, [])

  const filtered = npcs.filter(n => n.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[var(--border-main)] pb-6 gap-4">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent-primary)] font-serif">👤 Personnages</h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm md:text-base">Contacts & Alliés ({filtered.length})</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Rechercher..."
            className="theme-input w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link href="/npcs/new" className="theme-btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
            <span>+</span> Nouveau
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[var(--text-muted)] animate-pulse">Chargement des dossiers...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((npc: any) => (
            <Link href={`/npcs/${npc._id}`} key={npc._id} className="block group h-full">
              <div className="theme-card rounded-xl p-4 flex items-center gap-4 hover:border-[var(--accent-primary)] transition cursor-pointer h-full">
                
                <div className="w-16 h-16 rounded-full bg-[var(--bg-input)] overflow-hidden border border-[var(--border-main)] shrink-0">
                  {npc.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={urlFor(npc.image).width(200).url()} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl opacity-50">👤</div>
                  )}
                </div>
                
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition truncate">{npc.name}</h3>
                  <p className="text-sm text-[var(--text-muted)] truncate">{npc.role}</p>
                  {npc.faction && <span className="text-xs text-[var(--accent-hover)] font-medium uppercase tracking-wide">{npc.faction.name}</span>}
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
      
      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-[var(--text-muted)] border-2 border-dashed border-[var(--border-main)] rounded-xl bg-[var(--bg-card)]/50">
          Aucun personnage trouvé.
        </div>
      )}
    </div>
  )
}