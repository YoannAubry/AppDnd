"use client"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { ThemeSwitcher } from "../ui/ThemeSwitcher"

const NAV_LINKS = [
  { href: "/campaigns", label: "📜 Aventures" },
  { href: "/locations", label: "🗺️ Lieux" },
  { href: "/npcs", label: "👤 Personnages" },
  { href: "/bestiary", label: "🐉 Bestiaire" },
  { href: "/tracker", label: "⚔️ Combat" },
  { href: "/players", label: "🛡️ Groupe" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="border-b border-[var(--border-main)] bg-[var(--bg-main)] backdrop-blur-md sticky top-0 z-50 transition-colors duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO */}
          <div className="flex items-center gap-4 shrink-0">
            <Link 
              href="/" 
              className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] bg-clip-text text-transparent hover:opacity-80 transition font-serif"
              onClick={closeMenu}
            >
              🎲 Cockpit MJ
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex gap-1 overflow-x-auto no-scrollbar">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`
                  text-sm font-medium transition px-3 py-2 rounded-md whitespace-nowrap
                  ${pathname.startsWith(link.href) 
                    ? "text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 font-bold" 
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-input)]"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* DROITE : THEME & MOBILE TOGGLE */}
          <div className="flex items-center gap-3 shrink-0">
            
            <div className="hidden md:block">
              <ThemeSwitcher />
            </div>

            {/* Burger Mobile */}
            <div className="lg:hidden">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-[var(--text-main)] hover:text-[var(--accent-primary)] p-2 transition focus:outline-none"
                aria-label="Menu"
              >
                {isOpen ? (
                  <span className="text-xl font-bold">✕</span>
                ) : (
                  <span className="text-2xl">☰</span>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden border-t border-[var(--border-main)] bg-[var(--bg-main)] absolute top-16 left-0 w-full h-screen z-[100] shadow-2xl animate-in slide-in-from-top-2 overflow-y-auto">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`
                  block px-4 py-3 rounded-md text-base font-medium transition
                  ${pathname.startsWith(link.href)
                    ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-l-4 border-[var(--accent-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-input)]"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
            {/* SÉPARATEUR */}
            <hr className="border-[var(--border-main)] my-2" />

            {/* THEME SWITCHER MOBILE (Juste ici !) */}
            <div className="py-2 flex justify-between items-center px-4">
              <span className="text-sm text-[var(--text-muted)]">Thème</span>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}