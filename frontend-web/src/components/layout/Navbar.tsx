"use client"
import Link from "next/link"
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              🎲 Cockpit MJ
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-4">
            <Link href="/campaigns" className="nav-link">📜 Aventures</Link>
            <Link href="/bestiary" className="nav-link">🐉 Bestiaire</Link>
            <Link href="/tracker" className="nav-link">⚔️ Combat</Link>
            <Link href="/players" className="nav-link">🛡️ Groupe</Link>
          </div>

          {/* MOBILE BURGER */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-300 hover:text-white p-2">
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 pb-4 px-4 space-y-2">
          <Link href="/campaigns" className="block py-2 text-slate-300">📜 Aventures</Link>
          <Link href="/bestiary" className="block py-2 text-slate-300">🐉 Bestiaire</Link>
          <Link href="/tracker" className="block py-2 text-slate-300">⚔️ Combat</Link>
          <Link href="/players" className="block py-2 text-slate-300">🛡️ Groupe</Link>
        </div>
      )}
    </nav>
  )
}