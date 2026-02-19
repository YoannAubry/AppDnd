"use client"
import { updateBattlemapAction } from "@/app/actions/battlemap"
import { ImageUploader } from "@/components/ui/ImageUploader"
import Link from "next/link"

export default function EditMapForm({ map, locations }: { map: any, locations: any[] }) {
  const handleSubmit = async (formData: FormData) => {
    await updateBattlemapAction(map.id, formData)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Nom</label>
        <input name="name" defaultValue={map.name} required className="theme-input w-full" />
      </div>

      <ImageUploader name="image" defaultValue={map.image} label="Fichier Image" />

      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Lieu associé</label>
        <select name="locationId" defaultValue={map.locationId || ""} className="theme-input w-full">
          <option value="">-- Aucun --</option>
          {locations.map((loc: any) => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>

      <div className="pt-6 flex justify-end gap-4 border-t border-[var(--border-main)]">
        <Link href="/maps" className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)]">Annuler</Link>
        <button type="submit" className="theme-btn-primary">Sauvegarder</button>
      </div>
    </form>
  )
}