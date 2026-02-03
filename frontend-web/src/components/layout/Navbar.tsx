"use client"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation" // Pour savoir sur quelle page on est (optionnel, pour le style)

const NAV_LINKS = [
  { href: "/campaigns", label: "📜 Aventures" },
  { href: "/bestiary", label: "🐉 Bestiaire" },
  { href: "/tracker", label: "⚔️ Combat" },
  { href: "/players", label: "🛡️ Groupe" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Fonction pour fermer le menu quand on clique
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition"
              onClick={closeMenu} // Ferme aussi si on clique sur le logo
            >
              🎲 Cockpit MJ
            </Link>
          </div>

          {/* DESKTOP MENU (Caché sur mobile) */}
          <div className="hidden md:flex gap-6">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`text-sm font-medium transition ${
                  pathname.startsWith(link.href) 
                    ? "text-purple-400 font-bold" 
                    : "text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* MOBILE BURGER BUTTON */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-slate-300 hover:text-white p-2 focus:outline-none"
              aria-label="Menu"
            >
              {isOpen ? (
                <span className="text-2xl">✖</span>
              ) : (
                <span className="text-2xl">☰</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (S'affiche si isOpen est true) */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 absolute w-full left-0 animate-in slide-in-from-top-5 duration-200 shadow-2xl">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                onClick={closeMenu} // <--- C'EST ICI QUE LA MAGIE OPÈRE
                className={`block px-3 py-3 rounded-md text-base font-medium transition ${
                  pathname.startsWith(link.href)
                    ? "bg-purple-900/20 text-purple-400 border-l-4 border-purple-500"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}