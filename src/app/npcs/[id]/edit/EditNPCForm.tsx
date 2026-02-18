"use client"
import { updateNPCAction } from "@/app/actions/npc"
import { DynamicList } from "@/components/ui/DynamicList"
import { useState } from "react"
import Link from "next/link"

export default function EditNPCForm({ npc, monstersList }: { npc: any, monstersList: any[] }) {
  const [inventory, setInventory] = useState(npc.inventory || [])
  const [combatType, setCombatType] = useState(npc.combatType || "none")

  const handleSubmit = async (formData: FormData) => {
    formData.set("inventory", JSON.stringify(inventory))
    await updateNPCAction(npc._id, formData)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Nom</label><input name="name" defaultValue={npc.name} required className="w-full theme-input" /></div>
        <div><label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Rôle</label><input name="role" defaultValue={npc.role} className="w-full theme-input" /></div>
      </div>

      <div><label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Personnalité</label><textarea name="personality" defaultValue={npc.personality} rows={3} className="w-full theme-input" /></div>
      <div><label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Histoire</label><textarea name="history" defaultValue={npc.history} rows={3} className="w-full theme-input" /></div>

      <div className="bg-[var(--bg-input)] p-4 rounded border border-[var(--border-main)]">
        <label className="block text-sm font-bold text-[var(--text-main)] mb-3">Combat</label>
        <div className="flex gap-4 mb-4 text-[var(--text-muted)]">
          {['none', 'template', 'custom'].map(type => (
            <label key={type} className="flex items-center gap-2 text-sm cursor-pointer capitalize">
              <input type="radio" name="combatType" value={type} checked={combatType === type} onChange={() => setCombatType(type)} /> {type}
            </label>
          ))}
        </div>

        {combatType === 'template' && (
           <div>
             <label className="text-xs text-[var(--text-muted)] block mb-1">Modèle</label>
             <select name="monsterTemplate" defaultValue={npc.monsterTemplate?._ref} className="w-full theme-input">
               <option value="">-- Choisir --</option>
               {monstersList.map((m: any) => <option key={m._id} value={m._id}>{m.name}</option>)}
             </select>
           </div>
        )}

        {combatType === 'custom' && (
           <div className="grid grid-cols-2 gap-4">
             <input name="hp" defaultValue={npc.customStats?.hp} placeholder="PV" className="w-full theme-input text-center" />
             <input name="ac" type="number" defaultValue={npc.customStats?.ac} placeholder="CA" className="w-full theme-input text-center" />
           </div>
        )}
      </div>

      <DynamicList label="Inventaire" namePrefix="inv" items={inventory} onChange={setInventory} />
      <input type="hidden" name="inventory" value={JSON.stringify(inventory)} />

      <div className="pt-6 flex justify-end gap-4 border-t border-[var(--border-main)]">
        <Link href={`/npcs/${npc._id}`} className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)]">Annuler</Link>
        <button type="submit" className="theme-btn-primary">Sauvegarder</button>
      </div>

    </form>
  )
}