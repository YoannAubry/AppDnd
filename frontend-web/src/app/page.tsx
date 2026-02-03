"use client" // Pour le petit lanceur de dés interactif
import Link from "next/link"
import { useState } from "react"

export default function Home() {
  const [diceResult, setDiceResult] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)

  const rollD20 = () => {
    setIsRolling(true)
    // Petit effet de "roulement"
    let i = 0
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 20) + 1)
      i++
      if (i > 10) {
        clearInterval(interval)
        setIsRolling(false)
      }
    }, 50)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor (Cercles flous) */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl w-full z-10 space-y-12">
        
        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
            Cockpit MJ
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Bienvenue, Maître du Jeu. Quelle légende allons-nous écrire aujourd'hui ?
          </p>
        </div>

        {/* GRILLE DE NAVIGATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <MenuCard 
            href="/campaigns" 
            title="Aventures" 
            icon="📜" 
            desc="Gérez vos scénarios, lieux et intrigues."
            color="bg-amber-500"
          />
          
          <MenuCard 
            href="/tracker" 
            title="Combat Tracker" 
            icon="⚔️" 
            desc="Gérez l'initiative et les PV en temps réel."
            color="bg-red-500"
          />
          
          <MenuCard 
            href="/bestiary" 
            title="Bestiaire" 
            icon="🐉" 
            desc="Consultez les fiches de monstres."
            color="bg-emerald-500"
          />
          
          <MenuCard 
            href="/players" 
            title="Groupe" 
            icon="🛡️" 
            desc="Fiches personnages et inventaire."
            color="bg-blue-500"
          />

        </div>

        {/* LANCEUR DE DÉ RAPIDE */}
        <div className="flex flex-col items-center justify-center pt-8 opacity-80 hover:opacity-100 transition">
          <button 
            onClick={rollD20}
            className={`
              w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold border-4 
              transition-all duration-200 shadow-2xl
              ${isRolling ? 'border-purple-400 bg-purple-900/50 scale-95' : 'border-slate-700 bg-slate-800 hover:border-purple-500 hover:-translate-y-1'}
            `}
          >
            {diceResult === null ? "D20" : diceResult}
          </button>
          <span className="text-slate-500 text-sm mt-3 uppercase tracking-widest">Jet Rapide</span>
        </div>

      </div>
    </main>
  )
}

// Petit composant local pour les cartes
function MenuCard({ href, title, icon, desc, color }: any) {
  return (
    <Link href={href} className="group block">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-full transition-all duration-300 hover:border-slate-600 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 ${color} bg-opacity-20 text-white`}>
          {icon}
        </div>
        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition">{title}</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          {desc}
        </p>
      </div>
    </Link>
  )
}