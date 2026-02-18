"use client"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  fallbackUrl: string
  label?: string
  className?: string
}

export function BackButton({ fallbackUrl, label = "Retour", className = "" }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackUrl)
    }
  }

  return (
    <button 
      onClick={handleBack}
      // Je retire les classes fixes (bg-black, blur). 
      // On garde juste la transition et le curseur.
      className={`transition-colors cursor-pointer flex items-center gap-1 ${className}`}
    >
      {label}
    </button>
  )
}