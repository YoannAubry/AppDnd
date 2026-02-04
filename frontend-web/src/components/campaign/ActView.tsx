"use client"
import { useState } from "react"
import Link from "next/link"
import { PortableText } from "@portabletext/react"
import { urlFor } from "@/lib/sanity"

export function ActView({ act, index }: { act: any, index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0)

  return (
    <div className={`mb-8 border-l-4 pl-6 relative transition-all duration-300 ${isOpen ? 'border-[var(--accent-primary)]' : 'border-[var(--border-main)]'}`}>
      
      {/* Puce Numéro */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute -left-[14px] top-1 w-7 h-7 rounded-full flex items-center justify-center font-bold shadow-md transition-colors ${isOpen ? 'bg-[var(--accent-primary)] text-[var(--bg-main)]' : 'bg-[var(--border-main)] text-[var(--text-muted)] hover:bg-[var(--border-accent)]'}`}
      >
        {index + 1}
      </button>

      {/* HEADER CLIQUABLE */}
      <div 
        className="cursor-pointer group flex items-start justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h3 className={`text-3xl font-bold mb-2 font-serif transition-colors ${isOpen ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'}`}>
            {act.title}
          </h3>
          <p className={`italic text-lg transition-colors ${isOpen ? 'text-[var(--text-muted)]' : 'text-[var(--text-muted)] opacity-60'}`}>{act.summary}</p>
        </div>

        {/* CHEVRON */}
        <div className={`ml-4 transform transition-transform duration-300 text-2xl text-[var(--accent-primary)] ${isOpen ? 'rotate-180' : 'rotate-0 opacity-50'}`}>
          ▼
        </div>
      </div>

      {/* CONTENU (LIEUX) */}
      {isOpen && (
        <div className="grid gap-6 mt-6 animate-in slide-in-from-top-2 fade-in duration-300">
          {act.locations?.map((loc: any, i: number) => (
            <div key={i} className="bg-[var(--bg-card)] p-6 rounded-lg shadow-sm border border-[var(--border-main)] hover:border-[var(--accent-primary)] transition">
              <h4 className="text-xl font-bold text-[var(--accent-primary)] mb-2 flex items-center gap-2 font-serif">
                📍 {loc.name}
              </h4>
              
              {/* Description Riche */}
              <div className="text-[var(--text-main)] mb-4 prose prose-sm max-w-none prose-p:my-2 prose-headings:font-bold prose-strong:text-[var(--accent-hover)] prose-em:text-[var(--text-muted)]">
                {loc.description ? (
                  <PortableText value={loc.description} />
                ) : (
                  <p className="text-sm text-[var(--text-muted)] italic">Pas de description.</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--border-main)]">
                {/* PNJs */}
                {loc.npcs && loc.npcs.length > 0 && (
                  <div className="bg-[var(--bg-input)] p-3 rounded border border-[var(--border-main)]">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide block mb-2 font-sans">Personnages</span>
                    <div className="flex flex-col gap-2">
                      {loc.npcs.map((npc: any, k: number) => (
                        <Link href={`/npcs/${npc._id}`} key={k} className="flex items-center gap-2 group cursor-pointer hover:bg-[var(--bg-card)] p-1 rounded transition">
                           <div className="w-8 h-8 rounded-full bg-[var(--bg-card)] overflow-hidden border border-[var(--border-main)] shrink-0">
                            {npc.image ? <img src={urlFor(npc.image).width(40).url()} className="w-full h-full object-cover"/> : <span className="flex items-center justify-center h-full text-xs">👤</span>}
                          </div>
                          <div>
                            <span className="font-bold text-[var(--text-main)] block leading-tight text-sm group-hover:text-[var(--accent-primary)] transition">{npc.name}</span>
                            <span className="text-xs text-[var(--text-muted)]">{npc.role}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* MONSTRES */}
                {loc.monsters && loc.monsters.length > 0 && (
                  <div className="bg-red-900/10 p-3 rounded border border-red-900/20">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wide block mb-2 font-sans">Menaces</span>
                    <div className="flex flex-wrap gap-2">
                      {loc.monsters.map((monster: any, m: number) => (
                        <Link href={`/bestiary/${monster.slug}`} key={m} className="bg-[var(--bg-card)] hover:bg-red-900/20 text-red-400 px-3 py-1 rounded border border-red-900/30 transition text-xs font-bold flex items-center gap-2 shadow-sm">
                          ⚔️ {monster.name}
                          {monster.cr && <span className="text-[10px] opacity-60 font-normal">CR {monster.cr}</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))}
          {(!act.locations || act.locations.length === 0) && (
            <p className="text-[var(--text-muted)] italic text-sm">Aucun lieu défini pour cet acte.</p>
          )}
        </div>
      )}
    </div>
  )
}