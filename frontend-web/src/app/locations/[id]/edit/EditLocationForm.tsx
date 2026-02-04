"use client"
import { updateLocationAction } from "../../../../app/actions/location" // (À créer après)
import { useState } from "react"
import Link from "next/link"

// Composant Helper pour les listes de sélection
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
              className="accent-amber-500 w-4 h-4"
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

export default function EditLocationForm({ location, allNpcs, allMonsters }: any) {
  const [selectedNpcs, setSelectedNpcs] = useState<string[]>(location.npcs?.map((n:any) => n._ref) || [])
  const [selectedMonsters, setSelectedMonsters] = useState<string[]>(location.monsters?.map((m:any) => m._ref) || [])

  const handleSubmit = async (formData: FormData) => {
    // On ajoute les listes d'ID en JSON
    formData.set("npcs", JSON.stringify(selectedNpcs))
    formData.set("monsters", JSON.stringify(selectedMonsters))
    
    // Le texte riche est trop complexe à éditer ici sans éditeur WYSIWYG
    // Pour l'instant, on laisse la description telle quelle (on ne l'écrase pas)
    // ou on met un textarea simple qui écrasera tout en texte brut.
    // -> Option simple : Textarea brut.
    
    await updateLocationAction(location._id, formData)
  }

  // On extrait le texte brut de la description pour l'afficher dans le textarea
  const defaultDesc = location.description?.map((block:any) => block.children?.map((c:any) => c.text).join('')).join('\n\n') || ""

  return (
    <form action={handleSubmit} className="space-y-8">
      
      <div>
        <label className="block text-sm text-slate-400 mb-1">Nom du Lieu</label>
        <input name="name" defaultValue={location.name} required className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Description (Texte Brut)</label>
        <textarea name="description" defaultValue={defaultDesc} rows={6} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" placeholder="Description du lieu..." />
        <p className="text-xs text-amber-500 mt-1">⚠️ Attention : Modifier ici convertira le texte riche en texte simple.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-slate-800">
        <MultiSelect label="PNJ Présents" items={allNpcs} selectedIds={selectedNpcs} onChange={setSelectedNpcs} />
        <MultiSelect label="Monstres (Rencontres)" items={allMonsters} selectedIds={selectedMonsters} onChange={setSelectedMonsters} />
      </div>

      <div className="pt-6 flex justify-end gap-4 border-t border-slate-800">
        <Link href={`/locations/${location._id}`} className="px-4 py-2 text-slate-400 hover:text-white">Annuler</Link>
        <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded font-bold">Sauvegarder</button>
      </div>

    </form>
  )
}