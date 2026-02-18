"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { getPlayers } from "@/app/actions/getters"


export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPlayers().then(data => {
      setPlayers(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-[var(--bg-main)] text-[var(--text-main)]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-[var(--border-main)] pb-6 gap-4">
        <div className="w-full md:w-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--accent-primary)] font-serif">🛡️ La Compagnie</h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm md:text-base">Groupe d'aventuriers</p>
        </div>
        
        <Link href="/players/new" className="theme-btn-primary w-full md:w-auto flex items-center justify-center gap-2">
          <span>+</span> Nouveau
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[var(--text-muted)] animate-pulse">Rassemblement du groupe...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((p: any) => (
            <Link href={`/players/${p._id}`} key={p._id} className="block group h-full">
              <div className="theme-card rounded-xl overflow-hidden shadow-lg hover:border-[var(--accent-primary)] transition h-full flex items-center p-4 gap-4 relative">
                
                {/* Bande latérale colorée (optionnelle, ou dynamique selon classe) */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-primary)] opacity-50"></div>

                <div className="w-16 h-16 rounded-full border-2 border-[var(--border-main)] overflow-hidden shrink-0 bg-[var(--bg-input)]">
                  {p.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl opacity-50">👤</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-[var(--text-main)] mb-1 truncate">{p.name}</h2>
                  <p className="text-[var(--text-muted)] text-sm truncate">{p.class} • {p.race}</p>
                </div>

                <div className="flex flex-col gap-1 text-right border-l border-[var(--border-main)] pl-4">
                  <span className="text-green-500 font-bold text-sm">PV {p.hpMax}</span>
                  <span className="text-blue-500 font-bold text-sm">CA {p.ac}</span>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && players.length === 0 && (
        <div className="text-center py-12 text-[var(--text-muted)] border-2 border-dashed border-[var(--border-main)] rounded-xl bg-[var(--bg-card)]/50">
          La compagnie est vide.
        </div>
      )}
    </div>
  )
}