import NewCampaignForm from "./NewCampaignForm"
import Link from "next/link"
import { getCampaign } from "@/app/actions/getters"


export default async function NewCampaignPage() {
  const allLocations = await getCampaign(`*[_type == "location"] | order(name asc) { _id, name }`)

  return (
    // Fond global
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex justify-center pb-20 md:p-8">
      
      {/* Carte Responsive */}
      <div className="w-full md:max-w-4xl md:bg-[var(--bg-card)] md:border border-[var(--border-main)] md:rounded-xl p-4 md:p-8 md:shadow-2xl relative transition-all">
        
        <Link href="/campaigns" className="absolute top-4 right-4 md:top-8 md:right-8 text-[var(--text-muted)] hover:text-[var(--text-main)] transition text-sm">
          Annuler ✕
        </Link>
        
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--accent-primary)] mb-8 flex items-center gap-3 font-serif">
          <span>📜</span> Nouvelle Aventure
        </h1>
        
        <NewCampaignForm allLocations={allLocations} />
      </div>

    </div>
  )
}