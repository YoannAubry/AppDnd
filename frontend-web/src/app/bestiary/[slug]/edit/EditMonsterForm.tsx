"use client"
import { updateMonsterAction } from "@/app/actions/bestiary"
import { DynamicList } from "@/components/ui/DynamicList"
import { useState } from "react"
import Link from "next/link"

export default function EditMonsterForm({ monster }: { monster: any }) {
  const [traits, setTraits] = useState(monster.stats?.traits || [])
  const [actions, setActions] = useState(monster.stats?.actions || [])
  
  const handleSubmit = async (formData: FormData) => {
    formData.set("traits", JSON.stringify(traits))
    formData.set("actions", JSON.stringify(actions))
    await updateMonsterAction(monster._id, formData)
  }

  const attrs = monster.stats?.attributes || { str:10, dex:10, con:10, int:10, wis:10, cha:10 }

  return (
    <form action={handleSubmit} className="space-y-8">
      <input type="hidden" name="slug" value={monster.slug.current} />

      <div className="grid grid-cols-2 gap-4">
         <div className="col-span-2">
           <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Nom</label>
           <input name="name" defaultValue={monster.name} required className="w-full theme-input"/>
         </div>
         <div>
           <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Type</label>
           <input name="type" defaultValue={monster.type} required className="w-full theme-input"/>
         </div>
         <div>
           <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Challenge</label>
           <input name="challenge" defaultValue={monster.stats?.challenge} className="w-full theme-input"/>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-[var(--bg-input)] p-4 rounded-lg border border-[var(--border-main)]">
         <div><label className="block text-sm text-green-500 font-bold text-center">PV</label><input name="hp" defaultValue={monster.stats?.hp} required className="w-full theme-input text-center"/></div>
         <div><label className="block text-sm text-blue-500 font-bold text-center">CA</label><input name="ac" type="number" defaultValue={monster.stats?.ac} required className="w-full theme-input text-center"/></div>
         <div><label className="block text-sm text-yellow-500 font-bold text-center">Vitesse</label><input name="speed" defaultValue={monster.stats?.speed} className="w-full theme-input text-center"/></div>
      </div>

      <div>
        <label className="block text-sm text-[var(--text-muted)] mb-2 font-bold uppercase tracking-wider">Caractéristiques</label>
        <div className="grid grid-cols-6 gap-2">
          {Object.entries(attrs).map(([key, val]: any) => (
            <div key={key} className="text-center">
              <span className="text-xs uppercase text-[var(--text-muted)] font-bold mb-1 block">{key}</span>
              <input name={key} type="number" defaultValue={val} className="w-full theme-input text-center p-1" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Sens</label><input name="senses" defaultValue={monster.stats?.senses} className="w-full theme-input" /></div>
        <div><label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Langues</label><input name="languages" defaultValue={monster.stats?.languages} className="w-full theme-input" /></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-[var(--border-main)]">
        <DynamicList label="Traits" namePrefix="trait" items={traits} onChange={setTraits} />
        <DynamicList label="Actions" namePrefix="action" items={actions} onChange={setActions} />
      </div>

      <div className="pt-8 flex justify-end gap-4 border-t border-[var(--border-main)] mt-8">
        <Link href={`/bestiary/${monster.slug.current}`} className="px-6 py-3 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-input)] transition">Annuler</Link>
        <button type="submit" className="theme-btn-primary">Sauvegarder</button>
      </div>
    </form>
  )
}