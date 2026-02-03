"use client"
import { createNPCAction } from "../../../app/actions/npc"
import { DynamicList } from "../../../components/ui/DynamicList"
import { useState } from "react"
import Link from "next/link"

export default function NewNPCPage() {
  const [inventory, setInventory] = useState([{ name: "", desc: "" }])
  const [combatType, setCombatType] = useState("none")

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex justify-center pb-20">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-500 mb-8">Nouveau PNJ</h1>

        <form action={createNPCAction} className="space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm text-slate-400 mb-1">Nom</label>
              <input name="name" required className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Rôle / Titre</label>
              <input name="role" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Personnalité</label>
            <textarea name="personality" rows={3} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Histoire</label>
            <textarea name="history" rows={3} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
          </div>

          {/* COMBAT */}
          <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
            <label className="block text-sm font-bold text-slate-300 mb-3">Capacité de Combat</label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="combatType" value="none" checked={combatType === 'none'} onChange={() => setCombatType('none')} /> Civil
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="combatType" value="template" checked={combatType === 'template'} onChange={() => setCombatType('template')} /> Template Monstre
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="combatType" value="custom" checked={combatType === 'custom'} onChange={() => setCombatType('custom')} /> Stats Uniques
              </label>
            </div>

            {combatType === 'template' && (
               <div>
                 <label className="text-xs text-slate-500 block mb-1">ID du Template (ex: monstre_garde)</label>
                 <input name="monsterTemplate" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm" placeholder="Coller l'ID ici (pour l'instant)" />
               </div>
            )}

            {combatType === 'custom' && (
               <div className="grid grid-cols-2 gap-4">
                 <input name="hp" placeholder="PV (ex: 20)" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-center" />
                 <input name="ac" type="number" placeholder="CA (ex: 12)" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-center" />
               </div>
            )}
          </div>

          {/* INVENTAIRE */}
          <DynamicList label="Inventaire" namePrefix="inv" items={inventory} onChange={setInventory} />
          <input type="hidden" name="inventory" value={JSON.stringify(inventory)} />

          <div className="pt-6 flex justify-end gap-4">
            <Link href="/npcs" className="px-4 py-2 text-slate-400 hover:text-white">Annuler</Link>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold">Enregistrer</button>
          </div>

        </form>
      </div>
      
    </div>
  )
}