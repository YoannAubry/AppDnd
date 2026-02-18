"use client"
import { usePathname } from "next/navigation"
import { Navbar } from "./Navbar"

export function NavbarWrapper() {
  const pathname = usePathname()
  
  // Si on est sur une page /tv/..., on n'affiche rien
  if (pathname?.startsWith("/tv/")) return null
  
  return <Navbar />
}