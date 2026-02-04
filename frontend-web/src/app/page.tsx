"use client"
import Link from "next/link"
import { useState } from "react"

export default function Home() {
  const [diceResult, setDiceResult] = useState<number | null>(null)
  const [isRolling, setIsRolling] = useState(false)

  const rollD20 = () => {
    setIsRolling(true)
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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[var(--bg-main)] transition-colors duration-300">
      
      {/* Background Decor (Caché en mode Papier pour éviter l'effet sale) */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-[var(--accent-primary)]/10 rounded-full blur-3xl pointer-events-none opacity-50 dark:opacity-100"></div>

      <div className="max-w-5xl w-full z-10 space-y-12">
        
        <div className="text-center space-y-4">
          {/* Titre : On retire le gradient bg-clip-text qui est moche sur clair, on utilise la couleur accent */}
          <h1 className="text-5xl md:text-7xl font-bold font-serif text-[var(--accent-primary)] drop-shadow-sm">
            Cockpit MJ
          </h1>
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto font-sans">
            Bienvenue, Maître du Jeu. Quelle légende allons-nous écrire aujourd'hui ?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MenuCard href="/campaigns" title="Aventures" icon="📜" desc="Gérez vos scénarios." />
          <MenuCard href="/tracker" title="Combat Tracker" icon="⚔️" desc="Gérez l'initiative." />
          <MenuCard href="/bestiary" title="Bestiaire" icon="🐉" desc="Fiches de monstres." />
          <MenuCard href="/players" title="Groupe" icon="🛡️" desc="Fiches personnages." />
        </div>

        <div className="flex flex-col items-center justify-center pt-8">
          <button 
            onClick={rollD20}
            className={`
              w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold border-4 
              transition-all duration-200 shadow-2xl bg-[var(--bg-card)] text-[var(--text-main)]
              ${isRolling ? 'border-[var(--accent-primary)] scale-95' : 'border-[var(--border-main)] hover:border-[var(--accent-primary)] hover:-translate-y-1'}
            `}
          >
            {diceResult === null ? "D20" : diceResult}
          </button>
          <span className="text-[var(--text-muted)] text-sm mt-3 uppercase tracking-widest font-sans">Jet Rapide</span>
        </div>

      </div>
    </main>
  )
}

function MenuCard({ href, title, icon, desc }: any) {
  return (
    <Link href={href} className="group block">
      {/* Utilisation stricte des variables pour le fond et le texte */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-main)] p-6 rounded-2xl h-full transition-all duration-300 hover:border-[var(--accent-primary)] hover:shadow-xl hover:-translate-y-1">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 bg-[var(--bg-input)] border border-[var(--border-main)]">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-[var(--text-main)] mb-2 group-hover:text-[var(--accent-primary)] transition font-serif">{title}</h2>
        <p className="text-[var(--text-muted)] text-sm leading-relaxed font-sans">
          {desc}
        </p>
      </div>
    </Link>
  )
}