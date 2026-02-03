// Import depuis ton fichier de config Sanity
// (Si ça souligne en rouge, essaie : import { client, urlFor } from "@/lib/sanity")
import { client, urlFor } from "../lib/sanity"
import Image from "next/image"

// 1. Définition du type pour TypeScript (optionnel mais propre)
interface Monster {
  _id: string;
  name: string;
  hp?: string;
  ac?: number;
  image?: any;
}

// 2. Fonction pour récupérer les données
async function getMonsters() {
  // On va chercher tous les documents de type 'monster'
  return await client.fetch(`*[_type == "monster"]{
    _id,
    name,
    "hp": stats.hp,
    "ac": stats.ac,
    image
  }`)
}

// 3. Le composant de la Page
export default async function Home() {
  const monsters: Monster[] = await getMonsters()

  return (
    <main className="min-h-screen p-10 bg-slate-900 text-slate-100">
      <h1 className="text-4xl font-bold mb-8 text-purple-400">🎲 Cockpit MJ - Bestiaire</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {monsters.map((monster) => (
          <div key={monster._id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-purple-500 transition shadow-lg">
            
            {/* Image du monstre */}
            {monster.image && (
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
                 {/* On utilise une balise img standard pour éviter les soucis de config Next/Image au début */}
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img 
                   src={urlFor(monster.image).width(400).url()} 
                   alt={monster.name}
                   className="object-cover w-full h-full hover:scale-105 transition duration-500"
                 />
              </div>
            )}

            <h2 className="text-2xl font-bold mb-2 text-white">{monster.name}</h2>
            
            <div className="flex gap-3 text-sm font-bold">
              <span className="bg-red-900/80 text-red-100 px-3 py-1 rounded">❤️ {monster.hp || '?'} PV</span>
              <span className="bg-blue-900/80 text-blue-100 px-3 py-1 rounded">🛡️ {monster.ac || '?'} CA</span>
            </div>
            
          </div>
        ))}
        
        {monsters.length === 0 && (
          <div className="col-span-3 text-center py-20 bg-slate-800 rounded-xl border border-dashed border-slate-600">
            <p className="text-xl text-slate-400 mb-4">Le bestiaire est vide...</p>
            <a href="http://localhost:3333" target="_blank" className="text-purple-400 hover:underline">
              👉 Va dans le CMS (port 3333) pour créer ton premier monstre !
            </a>
          </div>
        )}
      </div>
    </main>
  )
}