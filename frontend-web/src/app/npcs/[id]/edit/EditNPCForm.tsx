"use client"
import { updateNPCAction } from "../../../../app/actions/npc"
import { DynamicList } from "../../../../components/ui/DynamicList"
import { useState } from "react"
import Link from "next/link"

export default function EditNPCForm({ npc, monstersList }: { npc: any, monstersList: any[] }) {
  const [inventory, setInventory] = useState(npc.inventory || [])
  // Conversion simple des sorts (liste de strings) en format pour DynamicList ({name, desc})
  const initialSpells = (npc.spells || []).map((s: string) => ({ name: s, desc: "" }))
  const [spells, setSpells] = useState(initialSpells)
  
  const [combatType, setCombatType] = useState(npc.combatType || "none")

  const handleSubmit = async (formData: FormData) => {
    // Conversion inverse des sorts pour l'envoi (juste les noms)
    const spellsSimple = spells.map((s: any) => s.name)
    formData.set("spells", JSON.stringify(spellsSimple))
    
    await updateNPCAction(npc._id, formData)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm text-slate-400 mb-1">Nom</label>
          <input name="name" defaultValue={npc.name} required className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Rôle</label>
          <input name="role" defaultValue={npc.role} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Personnalité</label>
        <textarea name="personality" defaultValue={npc.personality} rows={3} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Histoire</label>
        <textarea name="history" defaultValue={npc.history} rows={3} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
      </div>

      {/* COMBAT */}
      <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
        <label className="block text-sm font-bold text-slate-300 mb-3">Combat</label>
        <div className="flex gap-4 mb-4">
          {['none', 'template', 'custom'].map(type => (
            <label key={type} className="flex items-center gap-2 text-sm cursor-pointer capitalize">
              <input type="radio" name="combatType" value={type} checked={combatType === type} onChange={() => setCombatType(type)} /> {type}
            </label>
          ))}
        </div>

        {combatType === 'template' && (
           <div>
             <label className="text-xs text-slate-500 block mb-1">Modèle de Monstre</label>
             
             {/* REMPLACEMENT DE L'INPUT PAR UN SELECT */}
             <select 
               name="monsterTemplate" 
               defaultValue={npc.monsterTemplate?._ref || ""} 
               className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-sm text-white"
             >
               <option value="">-- Choisir un monstre --</option>
               {monstersList.map((m: any) => (
                 <option key={m._id} value={m._id}>
                   {m.name}
                 </option>
               ))}
             </select>

           </div>
        )}

        {combatType === 'custom' && (
           <div className="grid grid-cols-2 gap-4">
             <input name="hp" defaultValue={npc.customStats?.hp} placeholder="PV" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-center" />
             <input name="ac" type="number" defaultValue={npc.customStats?.ac} placeholder="CA" className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-center" />
           </div>
        )}
      </div>

      {/* LISTES */}
      <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-slate-800">
        <div>
            <DynamicList label="Inventaire" namePrefix="inv" items={inventory} onChange={setInventory} />
            <input type="hidden" name="inventory" value={JSON.stringify(inventory)} />
        </div>
        <div>
            {/* Réutilisation de DynamicList pour les sorts (on ignore la desc) */}
            <DynamicList label="Sorts" namePrefix="spl" items={spells} onChange={setSpells} />
        </div>
      </div>

      <div className="pt-6 flex justify-end gap-4">
        <Link href={`/npcs/${npc._id}`} className="px-4 py-2 text-slate-400 hover:text-white">Annuler</Link>
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold">Sauvegarder</button>
      </div>

    </form>
  )
}