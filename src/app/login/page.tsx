"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // On appelle notre API interne pour vérifier le mdp
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push("/") // Redirection vers l'accueil
      router.refresh()
    } else {
      setError("Mot de passe incorrect 🧙‍♂️")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="theme-card p-8 rounded-xl border border-[var(--border-main)] shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-purple-500 mb-6 text-center">🔐 Accès Réservé MJ</h1>
        
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe..."
          className="w-full bg-background border border-[var(--border-main)] text-white px-4 py-3 rounded-lg mb-4 focus:border-accent outline-none"
          autoFocus
        />
        
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        
        <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 rounded-lg transition">
          Entrer
        </button>
      </form>
    </div>
  )
}