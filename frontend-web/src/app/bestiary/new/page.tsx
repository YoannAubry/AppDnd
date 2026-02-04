import NewMonsterForm from "./NewMonsterForm"
import Link from "next/link"

export default function NewMonsterPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex justify-center pb-20">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl relative">
        <Link href="/bestiary" className="absolute top-8 right-8 text-slate-500 hover:text-white transition">Annuler ✕</Link>
        
        <h1 className="text-3xl font-bold text-green-500 mb-8 flex items-center gap-3">
          <span>🧪</span> Créer une Créature
        </h1>

        <NewMonsterForm />
      </div>
    </div>
  )
}