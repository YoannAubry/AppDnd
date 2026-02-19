"use client"

import React from "react"

interface Item {
  id: string
  name: string
  [key: string]: any
}

interface MultiSelectProps {
  label: string
  items: Item[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function MultiSelect({ label, items, selectedIds, onChange }: any) {
  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i: string) => i !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-[var(--text-muted)] uppercase tracking-wide">{label}</label>
      <div className="h-48 overflow-y-auto bg-[var(--bg-input)] border border-[var(--border-main)] rounded p-2 space-y-1">
        {items.map((item: any) => (
          <div 
            key={item.id} 
            onClick={() => toggle(item.id)} // On gère le clic sur la div
            className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm transition ${
              selectedIds.includes(item.id) 
                ? 'bg-[var(--accent-primary)]/20 text-[var(--text-main)]' 
                : 'hover:bg-[var(--bg-card)] text-[var(--text-muted)]'
            }`}
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
              selectedIds.includes(item.id) ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)]' : 'border-[var(--text-muted)]'
            }`}>
              {selectedIds.includes(item.id) && <span className="text-[10px] text-white">✓</span>}
            </div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--text-muted)] text-right">{selectedIds.length} sélectionné(s)</p>
    </div>
  )
}