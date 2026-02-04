import { client } from "@/lib/sanity"
import NewNPCForm from "./NewNPCForm"
import Link from "next/link"

export default async function NewNPCPage() {
  // On charge la liste des monstres pour le select
  const monsters = await client.fetch(`*[_type == "monster"] | order(name asc) { _id, name }`)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex justify-center pb-20">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl relative">
        <Link href="/npcs" className="absolute top-8 right-8 text-slate-500 hover:text-white transition">Annuler ✕</Link>
        
        <h1 className="text-3xl font-bold text-blue-500 mb-8">Nouveau PNJ</h1>
        <NewNPCForm monstersList={monsters} />
      </div>
    </div>
  )
}