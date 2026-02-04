"use client"
import { createPlayerAction } from "@/app/actions/player"
import Link from "next/link"

export default function NewPlayerForm() {
  return (
    <form action={createPlayerAction} className="space-y-6">
      
      {/* Identité */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm text-slate-400 mb-1">Nom du Personnage</label>
          <input name="name" required className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" placeholder="Aragorn" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Joueur (IRL)</label>
          <input name="playerName" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" placeholder="Pierre" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Race</label>
          <input name="race" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" placeholder="Humain" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="block text-sm text-slate-400 mb-1">Classe</label>
          <input name="class" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" placeholder="Rôdeur" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Niveau</label>
          <input name="level" type="number" defaultValue={1} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-center" />
        </div>
      </div>

      {/* Stats Vitales */}
      <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
        <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase">Stats de Combat</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-green-400 mb-1 text-center font-bold">PV MAX</label>
            <input name="hpMax" type="number" required className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-center text-white" placeholder="12" />
          </div>
          <div>
            <label className="block text-xs text-blue-400 mb-1 text-center font-bold">CA</label>
            <input name="ac" type="number" required className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-center text-white" placeholder="14" />
          </div>
          <div>
            <label className="block text-xs text-white mb-1 text-center font-bold">INIT BONUS</label>
            <input name="initBonus" type="number" defaultValue={0} className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-center text-white" placeholder="+2" />
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-end gap-4 border-t border-slate-800">
        <Link href="/players" className="px-4 py-2 text-slate-400 hover:text-white">Annuler</Link>
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold">Enrôler</button>
      </div>

    </form>
  )
}