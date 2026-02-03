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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-xl border border-slate-800 shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-purple-500 mb-6 text-center">🔐 Accès Réservé MJ</h1>
        
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe..."
          className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-lg mb-4 focus:border-purple-500 outline-none"
          autoFocus
        />
        
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        
        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition">
          Entrer
        </button>
      </form>
    </div>
  )
}