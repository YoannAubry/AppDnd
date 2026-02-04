import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import NPCDetailPage from './page' // Importe la page serveur

// 1. MOCK DE SANITY (Pour éviter l'erreur de config et d'appel réseau)
vi.mock('@/lib/sanity', () => ({
  client: {
    fetch: vi.fn().mockResolvedValue({
      _id: 'npc-123',
      name: 'Gérard',
      role: 'Aubergiste',
      inventory: [{ name: 'Clé', desc: 'Ouvre la cave' }], // Cas avec inventaire
      spells: []
    })
  },
  urlFor: () => ({ width: () => ({ url: () => 'https://fake-image.url' }) })
}))

vi.mock('@/components/ui/AdminToolbar', () => ({
  AdminToolbar: () => <div>Toolbar Mock</div>
}))

// 2. MOCK DES VARIABLES D'ENV (Pour éviter le crash si un autre fichier les lit)
vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'test-id')

// 3. MOCK DES COMPOSANTS ENFANTS COMPLEXES (Optionnel mais recommandé pour isoler)
// Ici on teste l'intégration donc on garde le vrai rendu, sauf si AdminToolbar pose problème
vi.mock('@/components/ui/AdminToolbar', () => ({
  AdminToolbar: () => <div data-testid="admin-toolbar">Toolbar</div>
}))


test('Affiche les détails du PNJ', async () => {
  // On simule les params de la page (Next.js 15 style)
  const params = Promise.resolve({ id: 'npc-123' })
  
  // Rendu du composant serveur asynchrone
  // @ts-ignore
  const jsx = await NPCDetailPage({ params })
  render(jsx)
  
  // Vérifications
  expect(screen.getByText('Gérard')).toBeDefined()
  expect(screen.getByText('Aubergiste')).toBeDefined()
  expect(screen.getByText('Clé')).toBeDefined() // Vérifie que l'inventaire s'affiche
})

test('Gère un PNJ sans inventaire', async () => {
  // On change le mock pour ce test spécifique
  const sanityMock = await import('@/lib/sanity')
  // @ts-ignore
  sanityMock.client.fetch.mockResolvedValueOnce({
    _id: 'npc-empty',
    name: 'Fantôme',
    inventory: null // Pas d'inventaire
  })

  const params = Promise.resolve({ id: 'npc-empty' })
  // @ts-ignore
  const jsx = await NPCDetailPage({ params })
  render(jsx)

  expect(screen.getByText('Fantôme')).toBeDefined()
  // Vérifie le texte de fallback
  expect(screen.getByText(/Rien de notable/i)).toBeDefined()
})