"use client"
import { createCampaignAction } from "../../../app/actions/campaign"
import { ActsEditor } from "../../../components/campaign/ActsEditor"
import Link from "next/link"

export default function NewCampaignForm({ allLocations }: { allLocations: any[] }) {
  return (
    <form action={createCampaignAction} className="space-y-8">
      
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <label className="block text-sm text-slate-400 mb-1 font-bold">Titre</label>
          <input name="title" required className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-purple-500 outline-none" placeholder="Ex: La Malédiction de Strahd" />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1 font-bold">Niveaux</label>
          <input name="level" required className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white text-center" placeholder="1-10" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1 font-bold">Synopsis</label>
        <textarea name="synopsis" rows={3} className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-purple-500 outline-none resize-none" placeholder="L'histoire en bref..." />
      </div>

      {/* NOTRE COMPOSANT DRAG & DROP */}
      <div className="pt-4 border-t border-slate-800">
        <ActsEditor initialActs={[]} allLocations={allLocations} />
      </div>

      <div className="pt-6 flex justify-end gap-4 border-t border-slate-800 mt-8">
        <Link href="/campaigns" className="px-6 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
          Annuler
        </Link>
        <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition transform hover:scale-105">
          Créer l'Aventure
        </button>
      </div>

    </form>
  )
}