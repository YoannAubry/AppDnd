"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { getCampaigns } from "@/app/actions/getters"
import { Badge } from "../../components/ui/Badge"
import { AppImage } from "../../components/ui/AppImage"



export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true) // Ajout du state loading pour éviter le flash vide

  useEffect(() => {
    getCampaigns().then(data => {
      setCampaigns(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[var(--bg-main)] text-[var(--text-main)]">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER AVEC BOUTON AJOUTER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-[var(--border-main)] pb-6 gap-4">
          <div className="w-full md:w-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-[var(--accent-primary)] font-serif">📜 Mes Aventures</h1>
            <p className="text-[var(--text-muted)]">Choisis ton histoire pour ce soir.</p>
          </div>

          {/* LE BOUTON MANQUANT EST ICI 👇 */}
          <Link href="/campaigns/new" className="theme-btn-primary w-full md:w-auto flex items-center justify-center gap-2">
            <span>+</span> Nouvelle Aventure
          </Link>
        </div>

        {loading ? (
           <div className="text-center py-20 text-[var(--text-muted)] animate-pulse">Chargement des histoires... 📚</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((camp: any) => (
              <Link href={`/campaigns/${camp.slug}`} key={camp.id} className="group h-full block">
                
                <div className="theme-card rounded-xl overflow-hidden shadow-lg h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
                  
                  {/* IMAGE */}
                  <div className="h-56 bg-[var(--bg-input)] relative overflow-hidden shrink-0 flex items-center justify-center">
                    <AppImage src={camp.image} alt={camp.title} type="campaign" />

                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-[var(--accent-primary)] text-[var(--accent-text)] border-none shadow-lg">Niveau {camp.level}</Badge>
                    </div>
                  </div>

                  {/* CONTENU */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-2xl font-bold mb-3 text-[var(--text-main)] group-hover:text-[var(--accent-primary)] transition font-serif">
                      {camp.title}
                    </h2>
                    <p className="text-[var(--text-muted)] text-sm line-clamp-3 leading-relaxed mb-6 flex-1">
                      {camp.synopsis}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-[var(--border-main)] flex justify-end">
                      <span className="text-[var(--accent-primary)] text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Ouvrir le livre ➜
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
        
        {!loading && campaigns.length === 0 && (
           <div className="text-center py-20 text-[var(--text-muted)] border-2 border-dashed border-[var(--border-main)] rounded-xl bg-[var(--bg-card)]/50">
             Aucune campagne. Lancez-vous !
           </div>
        )}
      </div>
    </div>
  )
}