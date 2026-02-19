"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface BackButtonProps {
  fallbackUrl: string
  label?: string
  className?: string
  forceLink?: boolean
}

export function BackButton({ fallbackUrl, label = "Retour", className = "", forceLink = false }: BackButtonProps) {
  const router = useRouter()
  const [isLoop, setIsLoop] = useState(false)

  useEffect(() => {
    // Si on vient d'une page d'édition de la même ressource, on considère ça comme une boucle potentielle
    if (typeof document !== 'undefined') {
      const referrer = document.referrer
      // Si l'URL précédente contenait "/edit", on risque la boucle
      if (referrer && referrer.includes("/edit")) {
        setIsLoop(true)
      }
    }
  }, [])

  const handleBack = () => {
    // Si on a détecté une boucle d'édition, on force le retour à la liste (ou au fallback)
    // Sinon, on fait un back normal (pour retourner à la campagne)
    if (isLoop || forceLink) {
      router.push(fallbackUrl)
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackUrl)
    }
  }

  // ... (reste du rendu identique, garde le bouton avec onClick={handleBack})
  return (
    <button onClick={handleBack} className={className}>
      {label}
    </button>
  )
}