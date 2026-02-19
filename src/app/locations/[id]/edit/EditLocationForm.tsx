"use client"
import { updateLocationAction } from "@/app/actions/location"
import { useState } from "react"
import Link from "next/link"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { MultiSelect } from "@/components/ui/MultiSelect"


export default function EditLocationForm({ location, allNpcs, allMonsters }: any) {
  const [selectedNpcs, setSelectedNpcs] = useState<string[]>(location.npcs?.map((n:any) => n._ref) || [])
  const [selectedMonsters, setSelectedMonsters] = useState<string[]>(location.monsters?.map((m:any) => m._ref) || [])

  const handleSubmit = async (formData: FormData) => {
    formData.set("npcs", JSON.stringify(selectedNpcs))
    formData.set("monsters", JSON.stringify(selectedMonsters))
    await updateLocationAction(location._id, formData)
  }

  // Extraction texte brut (attention si c'est du rich text complexe)
  const defaultDesc = location.description?.map((block:any) => block.children?.map((c:any) => c.text).join('')).join('\n\n') || ""

  return (
    <form action={handleSubmit} className="space-y-8">
      
      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Nom du Lieu</label>
        <input name="name" defaultValue={location.name} required className="w-full theme-input" />
      </div>

      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Description (Texte Brut)</label>
        <textarea name="description" defaultValue={defaultDesc} rows={6} className="w-full theme-input" placeholder="Description..." />
        <p className="text-xs text-[var(--accent-primary)] mt-1">⚠️ Attention : Modifier ici convertira le texte riche en texte simple.</p>
      </div>

      <ImageUploader name="image" defaultValue={location.image} label="Illustration" />

      <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-[var(--border-main)]">
        <MultiSelect label="PNJ Présents" items={allNpcs} selectedIds={selectedNpcs} onChange={setSelectedNpcs} />
        <MultiSelect label="Monstres (Rencontres)" items={allMonsters} selectedIds={selectedMonsters} onChange={setSelectedMonsters} />
      </div>

      <div className="pt-6 flex justify-end gap-4 border-t border-[var(--border-main)]">
        <Link href={`/locations/${location.id}`} className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)]">Annuler</Link>
        <button type="submit" className="theme-btn-primary">Sauvegarder</button>
      </div>

    </form>
  )
}