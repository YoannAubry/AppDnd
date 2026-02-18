"use client"
import { createCampaignAction } from "@/app/actions/campaign"
import { ActsEditor } from "@/components/campaign/ActsEditor"
import Link from "next/link"

export default function NewCampaignForm({ allLocations }: { allLocations: any[] }) {
  return (
    <form action={createCampaignAction} className="space-y-8">
      
      {/* Grille responsive : 1 colonne mobile, 4 colonnes desktop */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-3">
          <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Titre</label>
          <input name="title" required className="w-full theme-input" placeholder="La Malédiction de Strahd" />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Niveaux</label>
          <input name="level" required className="w-full theme-input text-center" placeholder="1-10" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Synopsis</label>
        <textarea name="synopsis" rows={4} className="w-full theme-input resize-none" placeholder="L'histoire en bref..." />
      </div>

      {/* ÉDITEUR D'ACTES */}
      <div className="pt-4 border-t border-[var(--border-main)]">
        <ActsEditor initialActs={[]} allLocations={allLocations} />
      </div>

      <div className="pt-6 flex justify-end gap-4 border-t border-[var(--border-main)] mt-8">
        <Link href="/campaigns" className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition">
          Annuler
        </Link>
        <button type="submit" className="theme-btn-primary">
          Créer l'Aventure
        </button>
      </div>

    </form>
  )
}