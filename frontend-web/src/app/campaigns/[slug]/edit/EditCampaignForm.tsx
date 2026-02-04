"use client"
import { updateCampaignAction } from "../../../../app/actions/campaign"
import { ActsEditor } from "../../../../components/campaign/ActsEditor"
import Link from "next/link"

export default function EditCampaignForm({ campaign, allLocations }: any) {
  return (
    <form action={(formData) => updateCampaignAction(campaign._id, formData)} className="space-y-8">
      
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <label className="block text-sm text-slate-400 mb-1 font-bold">Titre</label>
          <input name="title" defaultValue={campaign.title} required className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-purple-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1 font-bold">Niveaux</label>
          <input name="level" defaultValue={campaign.level} required className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white text-center" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1 font-bold">Synopsis</label>
        <textarea name="synopsis" defaultValue={campaign.synopsis} rows={3} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-purple-500 outline-none resize-none" />
      </div>

      <div className="pt-4 border-t border-slate-800">
        <ActsEditor initialActs={campaign.acts || []} allLocations={allLocations} />
      </div>

      <div className="pt-6 flex justify-end gap-4 border-t border-slate-800 mt-8">
        <Link href={`/campaigns/${campaign.slug.current}`} className="px-6 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
          Annuler
        </Link>
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition transform hover:scale-105">
          Sauvegarder
        </button>
      </div>

    </form>
  )
}