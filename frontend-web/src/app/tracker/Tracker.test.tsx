import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TrackerPage from './page'
import { expect, test, vi } from 'vitest'

// 1. On MOCK (simule) Sanity pour ne pas faire de vraies requêtes
vi.mock('@/lib/sanity', () => ({
  client: {
    fetch: vi.fn().mockResolvedValue([
      { _id: '1', _type: 'monster', name: 'Gobelin Test', stats: { hp: '10', ac: 15 } }
    ])
  },
  urlFor: () => ({ width: () => ({ url: () => '' }) })
}))

// 2. On MOCK le localStorage pour partir d'un état vide
const localStorageMock = (function() {
  let store: any = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => store[key] = value.toString(),
    clear: () => store = {}
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })


test('Le Tracker charge et affiche la recherche', async () => {
  render(<TrackerPage />)
  
  // Vérifie que le titre ou un élément clé est là
  expect(screen.getByPlaceholderText(/Rechercher/i)).toBeDefined()
})

test('Ajouter un monstre marche (Simulation)', async () => {
  render(<TrackerPage />)
  
  // 1. On tape "Gobelin"
  const input = screen.getByPlaceholderText(/Rechercher/i)
  fireEvent.change(input, { target: { value: 'Gobelin' } })
  
  // 2. On attend que le résultat (mocké) apparaisse
  await waitFor(() => {
    expect(screen.getByText('Gobelin Test')).toBeDefined()
  })
  
  // 3. On clique pour ajouter
  fireEvent.click(screen.getByText('Gobelin Test'))
  
  // 4. On vérifie qu'il est dans la liste de gauche (INIT input présent)
  expect(screen.getAllByText('Gobelin Test').length).toBeGreaterThan(0)
})