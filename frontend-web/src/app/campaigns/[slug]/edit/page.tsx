import { client } from "../../../../lib/sanity"
import EditCampaignForm from "./EditCampaignForm"

export default async function EditCampaignPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  
  const [campaign, allLocations] = await Promise.all([
    client.fetch(`*[_type == "campaign" && slug.current == $slug][0]`, { slug: params.slug }),
    client.fetch(`*[_type == "location"] | order(name asc) { _id, name }`)
  ])

  if (!campaign) return <div>Introuvable</div>

  return (
    <div className="min-h-screen bg-background text-[var(--text-main)] p-8 flex justify-center pb-20">
      <div className="max-w-4xl w-full theme-card border border-[var(--border-main)] rounded-xl p-8 shadow-2xl relative">
        <h1 className="text-3xl font-bold text-blue-500 mb-8 flex items-center gap-3">
          <span>✏️</span> Modifier : {campaign.title}
        </h1>
        <EditCampaignForm campaign={campaign} allLocations={allLocations} />
      </div>
    </div>
  )
}