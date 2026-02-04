"use client"
import { createMonsterAction } from "@/app/actions/bestiary"
import { DynamicList } from "@/components/ui/DynamicList"
import { useState } from "react"
import Link from "next/link"

export default function NewMonsterForm() {
  const [traits, setTraits] = useState([{ name: "", desc: "" }])
  const [actions, setActions] = useState([{ name: "Attaque", desc: "" }])

  return (
    <form action={createMonsterAction} className="space-y-8">
      {/* ... (Copie-colle tout le contenu du formulaire ici, sans le wrapper div de page) ... */}
      
      <div className="grid grid-cols-2 gap-4">
         <div className="col-span-2">
           <label className="block text-sm text-slate-400 mb-1 font-bold">Nom</label>
           <input name="name" required className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white" placeholder="Ex: Gobelin Ninja"/>
         </div>
         <div>
           <label className="block text-sm text-slate-400 mb-1 font-bold">Type</label>
           <input name="type" required className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white" placeholder="Ex: Humanoïde"/>
         </div>
         <div>
           <label className="block text-sm text-slate-400 mb-1 font-bold">Challenge</label>
           <input name="challenge" className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white" placeholder="Ex: 1/4"/>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
         <div><label className="block text-sm text-green-400 font-bold mb-1 text-center">PV</label><input name="hp" required className="w-full bg-slate-900 border-slate-600 rounded p-2 text-center text-white" placeholder="7 (2d6)"/></div>
         <div><label className="block text-sm text-blue-400 font-bold mb-1 text-center">CA</label><input name="ac" type="number" required className="w-full bg-slate-900 border-slate-600 rounded p-2 text-center text-white" placeholder="15"/></div>
         <div><label className="block text-sm text-yellow-400 font-bold mb-1 text-center">Vitesse</label><input name="speed" className="w-full bg-slate-900 border-slate-600 rounded p-2 text-center text-white" placeholder="9m"/></div>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-2 font-bold uppercase tracking-wider">Caractéristiques</label>
        <div className="grid grid-cols-6 gap-2">
          {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(attr => (
            <div key={attr} className="text-center">
              <span className="text-xs uppercase text-slate-500 font-bold mb-1 block">{attr}</span>
              <input name={attr} type="number" defaultValue={10} className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center text-white" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm text-slate-400 mb-1 font-bold">Sens</label><input name="senses" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" placeholder="Vision noire 18m" /></div>
        <div><label className="block text-sm text-slate-400 mb-1 font-bold">Langues</label><input name="languages" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" placeholder="Commun" /></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-slate-800">
        <DynamicList label="Traits Spéciaux" namePrefix="trait" items={traits} onChange={setTraits} />
        <DynamicList label="Actions" namePrefix="action" items={actions} onChange={setActions} />
      </div>

      <div className="pt-8 flex justify-end gap-4 border-t border-slate-800 mt-8">
        <Link href="/bestiary" className="px-6 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">Annuler</Link>
        <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition transform hover:scale-105 flex items-center gap-2"><span>💾</span> Enregistrer</button>
      </div>
    </form>
  )
}