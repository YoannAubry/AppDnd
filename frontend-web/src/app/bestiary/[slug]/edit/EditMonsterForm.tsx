"use client"

import { updateMonsterAction } from "../../../actions/bestiary" // Remonte de [slug]/edit/bestiary/app/src
import { DynamicList } from "../../../../components/ui/DynamicList"
import { useState } from "react"
import Link from "next/link"
import { Monster } from "@/types"

export default function EditMonsterForm({ monster }: { monster: Monster }) {
  // Initialiser les états avec les données existantes
  const [traits, setTraits] = useState(monster.stats?.traits || [])
  const [actions, setActions] = useState(monster.stats?.actions || [])

  // Action wrapper pour passer l'ID
  const handleSubmit = async (formData: FormData) => {
    // On ajoute l'ID et le slug au formulaire avant d'envoyer
    // (L'updateMonsterAction a besoin de l'ID pour savoir qui modifier)
    await updateMonsterAction(monster._id, formData)
  }

  const attrs = monster.stats?.attributes || { str:10, dex:10, con:10, int:10, wis:10, cha:10 }

  return (
    <form action={handleSubmit} className="space-y-8">
      
      {/* Champ caché pour le slug (utile pour la redirection) */}
      <input type="hidden" name="slug" value={monster.slug.current} />

      {/* IDENTITÉ */}
      <div className="grid grid-cols-2 gap-4">
         <div className="col-span-2">
           <label className="block text-sm text-slate-400 mb-1">Nom</label>
           <input name="name" defaultValue={monster.name} required className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"/>
         </div>
         <div>
           <label className="block text-sm text-slate-400 mb-1">Type</label>
           <input name="type" defaultValue={monster.type} required className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"/>
         </div>
         <div>
           <label className="block text-sm text-slate-400 mb-1">Challenge</label>
           <input name="challenge" defaultValue={monster.stats?.challenge} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"/>
         </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
         <div>
           <label className="block text-sm text-green-400 text-center">PV</label>
           <input name="hp" defaultValue={monster.stats?.hp} required className="w-full bg-slate-900 border-slate-600 rounded p-2 text-center text-white"/>
         </div>
         <div>
           <label className="block text-sm text-blue-400 text-center">CA</label>
           <input name="ac" type="number" defaultValue={monster.stats?.ac} required className="w-full bg-slate-900 border-slate-600 rounded p-2 text-center text-white"/>
         </div>
         <div>
           <label className="block text-sm text-yellow-400 text-center">Vitesse</label>
           <input name="speed" defaultValue={monster.stats?.speed} className="w-full bg-slate-900 border-slate-600 rounded p-2 text-center text-white"/>
         </div>
      </div>

      {/* ATTRIBUTS */}
      <div>
        <label className="block text-sm text-slate-400 mb-2">Caractéristiques</label>
        <div className="grid grid-cols-6 gap-2">
          {Object.entries(attrs).map(([key, val]: any) => (
            <div key={key} className="text-center">
              <span className="text-xs uppercase text-slate-500 font-bold mb-1 block">{key}</span>
              <input name={key} type="number" defaultValue={val} className="w-full bg-slate-950 border border-slate-700 rounded p-1 text-center text-white" />
            </div>
          ))}
        </div>
      </div>

      {/* DÉTAILS */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Sens</label>
          <input name="senses" defaultValue={monster.stats?.senses} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Langues</label>
          <input name="languages" defaultValue={monster.stats?.languages} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" />
        </div>
      </div>

      {/* LISTES DYNAMIQUES */}
      <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-slate-800">
        <DynamicList label="Traits" namePrefix="trait" items={traits} onChange={setTraits} />
        <DynamicList label="Actions" namePrefix="action" items={actions} onChange={setActions} />
      </div>

      <div className="pt-8 flex justify-end gap-4 border-t border-slate-800 mt-8">
        <Link href={`/bestiary/${monster.slug.current}`} className="px-6 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
          Annuler
        </Link>
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition transform hover:scale-105">
          Sauvegarder
        </button>
      </div>

    </form>
  )
}