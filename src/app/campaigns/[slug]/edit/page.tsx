import EditCampaignForm from "./EditCampaignForm"
import { getCampaign, getLocations} from "@/app/actions/getters"

export default async function EditCampaignPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  
  const [campaign, allLocations] = await Promise.all([
    getCampaign(params.slug),
    getLocations()
  ])

  if (!campaign) return <div className="p-20 text-center text-[var(--text-muted)]">Campagne introuvable</div>

  return (
    // Fond global
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex justify-center pb-20 md:p-8">
      
      {/* Carte Responsive */}
      <div className="w-full md:max-w-4xl md:bg-[var(--bg-card)] md:border border-[var(--border-main)] md:rounded-xl p-4 md:p-8 md:shadow-2xl relative transition-all">
        
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--accent-primary)] mb-8 flex items-center gap-3 font-serif">
          <span>✏️</span> Modifier : {campaign.title}
        </h1>
        
        <EditCampaignForm campaign={campaign} allLocations={allLocations} />
      </div>

    </div>
  )
}