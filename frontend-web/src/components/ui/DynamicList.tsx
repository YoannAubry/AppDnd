"use client"
import { useState } from "react"

interface Item { name: string, desc: string }

interface DynamicListProps {
  label: string
  namePrefix: string // ex: "action" pour avoir action_0_name
  items: Item[]
  onChange: (items: Item[]) => void
}

export function DynamicList({ label, items, onChange }: DynamicListProps) {
  
  const addItem = () => {
    onChange([...items, { name: "", desc: "" }])
  }

  const updateItem = (index: number, field: 'name' | 'desc', value: string) => {
    const newItems = [...items]
    newItems[index][field] = value
    onChange(newItems)
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-slate-400 uppercase tracking-wide border-b border-slate-700 pb-1 mb-2 flex justify-between items-center">
        {label}
        <button type="button" onClick={addItem} className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-green-400">
          + Ajouter
        </button>
      </label>

      {items.map((item, index) => (
        <div key={index} className="flex gap-2 items-start bg-slate-950/50 p-2 rounded border border-slate-800">
          <div className="flex-1 space-y-1">
            <input 
              type="text" 
              placeholder="Nom (ex: Morsure)" 
              value={item.name}
              onChange={(e) => updateItem(index, 'name', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm font-bold text-white placeholder-slate-600"
            />
            <textarea 
              placeholder="Description..." 
              value={item.desc}
              onChange={(e) => updateItem(index, 'desc', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 h-16 resize-none placeholder-slate-600"
            />
          </div>
          <button type="button" onClick={() => removeItem(index)} className="text-slate-600 hover:text-red-500 font-bold px-1">
            ×
          </button>
        </div>
      ))}
      
      {items.length === 0 && <p className="text-xs text-slate-600 italic">Aucun élément.</p>}
      
      {/* Input caché pour envoyer les données au serveur en JSON stringifié */}
      <input type="hidden" name={label.toLowerCase()} value={JSON.stringify(items)} />
    </div>
  )
}