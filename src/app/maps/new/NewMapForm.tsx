"use client"
import { createBattlemapAction } from "@/app/actions/battlemap" // (Fichier que je t'ai donné avant, vérifie qu'il existe)
import { ImageUploader } from "@/components/ui/ImageUploader"
import Link from "next/link"

export default function NewMapForm({ locations }: { locations: any[] }) {
  return (
    <form action={createBattlemapAction} className="space-y-6">
      
      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Nom de la carte</label>
        <input name="name" required className="theme-input w-full" placeholder="Ex: Clairière des Loups" />
      </div>

      <ImageUploader name="image" label="Fichier Image (Map)" />

      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Lieu associé (Optionnel)</label>
        <select name="locationId" className="theme-input w-full">
          <option value="">-- Aucun --</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>

      <div className="pt-6 flex justify-end gap-4 border-t border-[var(--border-main)]">
        <Link href="/maps" className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)]">Annuler</Link>
        <button type="submit" className="theme-btn-primary">Enregistrer</button>
      </div>

    </form>
  )
}