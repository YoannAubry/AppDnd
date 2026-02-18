"use client"
import { createLocationAction } from "@/app/actions/location"
import { useState } from "react"
import Link from "next/link"

function MultiSelect({ label, items, selectedIds, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-[var(--text-muted)] uppercase tracking-wide">{label}</label>
      <div className="h-48 overflow-y-auto bg-[var(--bg-input)] border border-[var(--border-main)] rounded p-2 space-y-1">
        {items.map((item: any) => (
          <label key={item._id} className="flex items-center gap-2 p-2 hover:bg-[var(--bg-card)] rounded cursor-pointer text-sm">
            <input 
              type="checkbox" 
              checked={selectedIds.includes(item._id)}
              onChange={(e) => {
                if (e.target.checked) onChange([...selectedIds, item._id])
                else onChange(selectedIds.filter((id: string) => id !== item._id))
              }}
              className="accent-[var(--accent-primary)] w-4 h-4"
            />
            <span className={selectedIds.includes(item._id) ? "font-bold text-[var(--text-main)]" : "text-[var(--text-muted)]"}>
              {item.name}
            </span>
          </label>
        ))}
      </div>
      <p className="text-xs text-[var(--text-muted)] text-right">{selectedIds.length} sélectionné(s)</p>
    </div>
  )
}

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