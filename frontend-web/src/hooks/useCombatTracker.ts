import { useState, useEffect } from "react"

// On reprend le type Combatant (tu devras peut-être l'exporter depuis types/index.ts)
// Pour simplifier ici, je mets 'any', mais utilise ton vrai type
export function useCombatTracker() {
  const [combatants, setCombatants] = useState<any[]>([])
  const [turnIndex, setTurnIndex] = useState(0)
  const [round, setRound] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)

  // 1. Charger au démarrage
  useEffect(() => {
    const saved = localStorage.getItem("combat_state")
    if (saved) {
      const parsed = JSON.parse(saved)
      setCombatants(parsed.combatants || [])
      setTurnIndex(parsed.turnIndex || 0)
      setRound(parsed.round || 1)
    }
    setIsLoaded(true)
  }, [])

  // 2. Sauvegarder à chaque changement
  useEffect(() => {
    if (!isLoaded) return // Ne pas sauvegarder vide au démarrage
    localStorage.setItem("combat_state", JSON.stringify({ combatants, turnIndex, round }))
  }, [combatants, turnIndex, round, isLoaded])

  return {
    combatants,
    setCombatants,
    turnIndex,
    setTurnIndex,
    round,
    setRound,
    isLoaded
  }
}