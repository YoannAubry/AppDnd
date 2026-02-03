// src/components/layout/Navbar.tsx
import Link from "next/link"

export function Navbar() {
  return (
    <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              🎲 Cockpit MJ
            </Link>
          </div>

          <div className="flex gap-4">
            <Link href="/campaigns" className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">
              📜 Aventures
            </Link>
            <Link href="/bestiary" className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">
              🐉 Bestiaire
            </Link>
            <Link href="/tracker" className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition">
              ⚔️ Combat
            </Link>
          </div>

        </div>
      </div>
    </nav>
  )
}