"use client"
import { updatePlayerAction } from "@/app/actions/player"
import Link from "next/link"

export default function EditPlayerForm({ player }: { player: any }) {
  const handleSubmit = async (formData: FormData) => {
    await updatePlayerAction(player._id, formData)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      
      {/* IDENTITÉ */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Nom du Personnage</label>
          <input name="name" defaultValue={player.name} required className="w-full theme-input" />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Joueur (IRL)</label>
          <input name="playerName" defaultValue={player.playerName} className="w-full theme-input" />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Race</label>
          <input name="race" defaultValue={player.race} className="w-full theme-input" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Classe</label>
          <input name="class" defaultValue={player.class} className="w-full theme-input" />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-muted)] mb-1 font-bold">Niveau</label>
          <input name="level" type="number" defaultValue={player.level} className="w-full theme-input text-center" />
        </div>
      </div>

      {/* STATS VITALES */}
      <div className="bg-[var(--bg-input)] p-4 rounded border border-[var(--border-main)]">
        <h3 className="text-sm font-bold text-[var(--text-main)] mb-3 uppercase tracking-wide">Stats de Combat</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-green-500 mb-1 text-center font-bold">PV MAX</label>
            <input name="hpMax" type="number" defaultValue={player.hpMax} required className="w-full theme-input text-center" />
          </div>
          <div>
            <label className="block text-xs text-blue-500 mb-1 text-center font-bold">CA</label>
            <input name="ac" type="number" defaultValue={player.ac} required className="w-full theme-input text-center" />
          </div>
          <div>
            <label className="block text-xs text-[var(--text-muted)] mb-1 text-center font-bold">INIT BONUS</label>
            <input name="initBonus" type="number" defaultValue={player.initBonus} className="w-full theme-input text-center" />
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-end gap-4 border-t border-[var(--border-main)]">
        <Link href={`/players/${player._id}`} className="px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)]">Annuler</Link>
        <button type="submit" className="theme-btn-primary">Sauvegarder</button>
      </div>

    </form>
  )
}