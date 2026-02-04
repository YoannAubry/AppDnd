"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { client, urlFor } from "../../lib/sanity"
import { Badge } from "../../components/ui/Badge"

async function getCampaigns() {
  return await client.fetch(`*[_type == "campaign"] | order(title asc) {
    _id, title, "slug": slug.current, level, image, synopsis
  }`)
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])

  useEffect(() => {
    getCampaigns().then(setCampaigns)
  }, [])

  return (
    <div className="min-h-screen p-8 bg-[var(--bg-main)] text-[var(--text-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 border-b border-[var(--border-main)] pb-6">
          <h1 className="text-4xl font-bold mb-2 text-[var(--accent-primary)] font-serif">📜 Mes Aventures</h1>
          <p className="text-[var(--text-muted)]">Choisis ton histoire pour ce soir.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((camp: any) => (
            <Link href={`/campaigns/${camp.slug}`} key={camp._id} className="group h-full block">
              
              <div className="theme-card rounded-xl overflow-hidden shadow-lg h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
                
                {/* IMAGE */}
                <div className="h-56 bg-[var(--bg-input)] relative overflow-hidden shrink-0">
                  {camp.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={urlFor(camp.image).width(600).height(400).url()} 
                      alt={camp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-50">📚</div>
                  )}
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-[var(--accent-primary)] text-white border-none shadow-lg">Niveau {camp.level}</Badge>
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
      </div>
    </div>
  )
}