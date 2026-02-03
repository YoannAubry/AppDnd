"use client" // Pour l'interactivité (ouvrir/fermer)
import { useState } from "react"
import { Badge } from "../ui/Badge"
import Link from "next/link"
import { PortableText } from "@portabletext/react"

export function ActView({ act, index }: { act: any, index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0) // Le premier est ouvert par défaut

  return (
    <div className="mb-8 border-l-4 border-[#7a200d] pl-6 relative">
      {/* Puce Numéro */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-[14px] top-0 w-7 h-7 bg-[#7a200d] rounded-full text-[#fdf1dc] flex items-center justify-center font-bold shadow-md hover:scale-110 transition"
      >
        {index + 1}
      </button>

      {/* Titre */}
      <div 
        className="cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-3xl font-bold text-slate-800 mb-2 font-serif group-hover:text-[#7a200d] transition">
          {act.title}
        </h3>
        <p className="italic text-slate-600 mb-4 text-lg">{act.summary}</p>
      </div>

      {/* Contenu (Lieux) */}
      {isOpen && (
        <div className="grid gap-6 mt-6 fade-in">
          {act.locations?.map((loc: any, i: number) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-[#eecfa1]">
              <h4 className="text-xl font-bold text-[#7a200d] mb-2 flex items-center gap-2">
                📍 {loc.name}
              </h4>
              
              <div className="text-slate-700 mb-4 prose prose-sm max-w-none prose-p:my-2 prose-headings:font-bold prose-strong:text-purple-700">
                {loc.description ? (
                  <PortableText value={loc.description} />
                ) : (
                  <p className="text-sm text-slate-400 italic">Pas de description.</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* PNJs */}
                {loc.npcs && loc.npcs.length > 0 && (
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">Personnages</span>
                    <div className="flex flex-col gap-2">
                      {loc.npcs.map((npc: any, k: number) => (
                        <div key={k} className="flex items-center gap-2">
                          <span className="text-lg">👤</span>
                          <div>
                            <span className="font-bold text-slate-800 block leading-tight">{npc.name}</span>
                            <span className="text-xs text-slate-500">{npc.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MONSTRES */}
                {loc.monsters && loc.monsters.length > 0 && (
                  <div className="bg-red-50 p-3 rounded border border-red-100">
                    <span className="text-xs font-bold text-red-300 uppercase tracking-wide block mb-2">Menaces</span>
                    <div className="flex flex-wrap gap-2">
                      {loc.monsters.map((monster: any, m: number) => (
                        <Link href={`/bestiary/${monster.slug}`} key={m} className="bg-white hover:bg-red-100 text-red-900 px-3 py-1 rounded border border-red-200 transition text-sm font-medium flex items-center gap-2 shadow-sm">
                          ⚔️ {monster.name}
                          {monster.cr && <span className="text-xs opacity-60">CR {monster.cr}</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))}
          {(!act.locations || act.locations.length === 0) && (
            <p className="text-slate-400 italic text-sm">Aucun lieu défini pour cet acte.</p>
          )}
        </div>
      )}
    </div>
  )
}