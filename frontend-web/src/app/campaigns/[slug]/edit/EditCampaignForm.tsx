"use client"
import { updateCampaignAction } from "@/app/actions/campaign"
import { ActsEditor } from "@/components/campaign/ActsEditor"
import Link from "next/link"

export default function EditCampaignForm({ campaign, allLocations }: any) {
  return (
    <form action={(formData) => updateCampaignAction(campaign._id, formData)} className="space-y-8">
      
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Titre</label>
          <input name="title" defaultValue={campaign.title} required className="w-full theme-input" />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Niveaux</label>
          <input name="level" defaultValue={campaign.level} required className="w-full theme-input text-center" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Synopsis</label>
        <textarea name="synopsis" defaultValue={campaign.synopsis} rows={3} className="w-full theme-input resize-none" />
      </div>

      <div className="pt-4 border-t border-[var(--border-main)]">
        <ActsEditor initialActs={campaign.acts || []} allLocations={allLocations} />
      </div>

      <div className="pt-6 flex justify-end gap-4 border-t border-[var(--border-main)] mt-8">
        <Link href={`/campaigns/${campaign.slug.current}`} className="px-6 py-3 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-input)] transition">
          Annuler
        </Link>
        <button type="submit" className="theme-btn-primary">
          Sauvegarder
        </button>
      </div>

    </form>
  )
}