import { client } from "../../../lib/sanity"
import NewCampaignForm from "./NewCampaignForm"

export default async function NewCampaignPage() {
  // On récupère la liste des lieux pour pouvoir les cocher dans les actes
  const allLocations = await client.fetch(`*[_type == "location"] | order(name asc) { _id, name }`)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex justify-center pb-20">
      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl relative">
        <h1 className="text-3xl font-bold text-purple-500 mb-8 flex items-center gap-3">
          <span>📜</span> Nouvelle Aventure
        </h1>
        <NewCampaignForm allLocations={allLocations} />
      </div>
    </div>
  )
}