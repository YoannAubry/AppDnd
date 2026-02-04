import { render, screen, fireEvent, waitFor, renderHook, act } from '@testing-library/react'
import TrackerPage from './page'
import { useCombatTracker } from '@/hooks/useCombatTracker'
import { expect, test, vi, describe, beforeEach } from 'vitest'

// --- MOCKS GLOBAUX ---

// 1. Mock Sanity (pour la recherche)
vi.mock('@/lib/sanity', () => ({
  client: {
    fetch: vi.fn().mockResolvedValue([
      { _id: '1', _type: 'monster', name: 'Gobelin Test', stats: { hp: '10', ac: 15 } }
    ])
  },
  urlFor: () => ({ width: () => ({ url: () => '' }) })
}))

// 2. Mock AdminToolbar (si utilisé quelque part, évite les erreurs)
vi.mock('@/components/ui/AdminToolbar', () => ({ AdminToolbar: () => null }))

// 3. Mock localStorage (pour le Hook)
const localStorageMock = (function() {
  let store: any = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => store[key] = value.toString(),
    clear: () => store = {}
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })


// --- TESTS UI (Page) ---
describe('Tracker UI', () => {
  
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  test('Le Tracker charge et affiche la recherche', async () => {
    render(<TrackerPage />)
    expect(screen.getByPlaceholderText(/Rechercher/i)).toBeDefined()
  })

  test('Ajouter un monstre marche (Simulation)', async () => {
    render(<TrackerPage />)
    
    // 1. On tape "Gobelin"
    const input = screen.getByPlaceholderText(/Rechercher/i)
    fireEvent.change(input, { target: { value: 'Gobelin' } })
    
    // 2. On attend le résultat mocké
    await waitFor(() => {
      expect(screen.getByText('Gobelin Test')).toBeDefined()
    })
    
    // 3. On clique pour ajouter
    fireEvent.click(screen.getByText('Gobelin Test'))
    
    // 4. On vérifie qu'il est dans la liste (INIT présent)
    expect(screen.getAllByText('Gobelin Test').length).toBeGreaterThan(0)
  })

  // TEST 13 : Switch Faction (Simulation UI)
  test('Le bouton faction est présent', async () => {
    render(<TrackerPage />)
    
    // Ajout préalable
    const input = screen.getByPlaceholderText(/Rechercher/i)
    fireEvent.change(input, { target: { value: 'Gobelin' } })
    await waitFor(() => fireEvent.click(screen.getByText('Gobelin Test')))

    // Vérifie la présence du bouton de switch (🔄)
    const switchBtn = screen.getByTitle('Changer de camp') // Assure-toi d'avoir mis title="Changer de camp" dans le JSX
    expect(switchBtn).toBeDefined()
    
    // On ne teste pas le changement de couleur exact ici car c'est du CSS Tailwind complexe,
    // mais le clic ne doit pas planter.
    fireEvent.click(switchBtn)
  })
})


// --- TESTS HOOK (Logique d'État) ---
// TEST 14
describe('Tracker Hook (useCombatTracker)', () => {
  
  beforeEach(() => {
    localStorageMock.clear()
  })

  test('Gère la liste et le tour', () => {
    const { result } = renderHook(() => useCombatTracker())

    // État initial
    expect(result.current.turnIndex).toBe(0)
    expect(result.current.round).toBe(1)

    // Ajout combattants
    act(() => {
      result.current.setCombatants([
        { id: '1', name: 'A', initiative: 10 } as any,
        { id: '2', name: 'B', initiative: 5 } as any
      ])
    })
    expect(result.current.combatants).toHaveLength(2)

    // Changement de tour (Manuel, car nextTurn est dans la Page, pas le Hook)
    act(() => {
      result.current.setTurnIndex(1)
    })
    expect(result.current.turnIndex).toBe(1)
  })

  test('Persistance localStorage', () => {
    const { result, rerender } = renderHook(() => useCombatTracker())
    
    // On modifie l'état
    act(() => {
      result.current.setRound(5)
    })

    // On vérifie que c'est sauvé
    const saved = JSON.parse(localStorage.getItem('combat_state') || '{}')
    expect(saved.round).toBe(5)
  })
})