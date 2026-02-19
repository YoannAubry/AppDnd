"use client"
import { createLocationAction } from "@/app/actions/location"
import { useState } from "react"
import Link from "next/link"
import { MultiSelect } from "@/components/ui/MultiSelect"



export default function NewLocationForm({ allNpcs, allMonsters }: any) {
  const [selectedNpcs, setSelectedNpcs] = useState<string[]>([])
  const [selectedMonsters, setSelectedMonsters] = useState<string[]>([])

  const handleSubmit = async (formData: FormData) => {
    formData.set("npcs", JSON.stringify(selectedNpcs))
    formData.set("monsters", JSON.stringify(selectedMonsters))
    await createLocationAction(formData)
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      
      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Nom du Lieu</label>
        <input name="name" required className="w-full theme-input" placeholder="Ex: La Forêt Interdite" />
      </div>

      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Description</label>
        <textarea name="description" rows={6} className="w-full theme-input" placeholder="Décrivez l'ambiance..." />
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-[var(--border-main)]">
        <MultiSelect label="PNJ Présents" items={allNpcs} selectedIds={selectedNpcs} onChange={setSelectedNpcs} />
        <MultiSelect label="Monstres (Rencontres)" items={allMonsters} selectedIds={selectedMonsters} onChange={setSelectedMonsters} />
      </div>

      <div className="pt-6 flex justify-end gap-4 border-t border-[var(--border-main)]">
        <Link href="/locations" className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)]">Annuler</Link>
        <button type="submit" className="theme-btn-primary">Créer le Lieu</button>
      </div>

    </form>
  )
}