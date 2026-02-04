"use client"
import { createLocationAction } from "../../../app/actions/location"
import { useState } from "react"
import Link from "next/link"

// Je duplique le MultiSelect ici pour que le fichier soit autonome
// (Idéalement, tu devrais mettre ce MultiSelect dans components/ui/MultiSelect.tsx)
function MultiSelect({ label, items, selectedIds, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-slate-400 uppercase tracking-wide">{label}</label>
      <div className="h-48 overflow-y-auto bg-slate-950 border border-slate-700 rounded p-2 space-y-1">
        {items.map((item: any) => (
          <label key={item._id} className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded cursor-pointer text-sm">
            <input 
              type="checkbox" 
              checked={selectedIds.includes(item._id)}
              onChange={(e) => {
                if (e.target.checked) onChange([...selectedIds, item._id])
                else onChange(selectedIds.filter((id: string) => id !== item._id))
              }}
              className="accent-green-500 w-4 h-4"
            />
            <span className={selectedIds.includes(item._id) ? "text-white font-bold" : "text-slate-400"}>
              {item.name}
            </span>
          </label>
        ))}
      </div>
      <p className="text-xs text-slate-500 text-right">{selectedIds.length} sélectionné(s)</p>
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
        <label className="block text-sm text-slate-400 mb-1">Nom du Lieu</label>
        <input name="name" required className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white placeholder-slate-600" placeholder="Ex: La Forêt Interdite" />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Description</label>
        <textarea name="description" rows={6} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white placeholder-slate-600" placeholder="Décrivez l'ambiance, les odeurs, les sons..." />
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-slate-800">
        <MultiSelect label="PNJ Présents" items={allNpcs} selectedIds={selectedNpcs} onChange={setSelectedNpcs} />
        <MultiSelect label="Monstres (Rencontres)" items={allMonsters} selectedIds={selectedMonsters} onChange={setSelectedMonsters} />
      </div>

      <div className="pt-6 flex justify-end gap-4 border-t border-slate-800">
        <Link href="/locations" className="px-4 py-2 text-slate-400 hover:text-white">Annuler</Link>
        <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold transition transform hover:scale-105">Créer le Lieu</button>
      </div>

    </form>
  )
}