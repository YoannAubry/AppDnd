// src/lib/combat.ts

export interface Combatant {
  id: string
  name: string
  initiative: number
  hp: number
  hpMax: number
}

// Calcule les nouveaux PV après dégâts (ne descend pas sous 0)
export function calculateDamage(currentHp: number, amount: number): number {
  return Math.max(0, currentHp - amount)
}

// Calcule les nouveaux PV après soin (ne dépasse pas le Max)
export function calculateHeal(currentHp: number, maxHp: number, amount: number): number {
  return Math.min(maxHp, currentHp + amount)
}

// Trie une liste de combattants par initiative décroissante
export function sortCombatants(list: Combatant[]): Combatant[] {
  // On crée une copie avec [...list] pour ne pas modifier l'original par effet de bord
  return [...list].sort((a, b) => b.initiative - a.initiative)
}

// Calcule l'index du tour suivant
export function calculateNextTurn(currentIndex: number, listLength: number): { index: number, newRound: boolean } {
  if (listLength === 0) return { index: 0, newRound: false }
  
  const nextIndex = currentIndex + 1
  if (nextIndex >= listLength) {
    return { index: 0, newRound: true } // On boucle et on passe au round suivant
  }
  return { index: nextIndex, newRound: false }
}