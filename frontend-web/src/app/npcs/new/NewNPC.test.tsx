import { render, screen, fireEvent } from '@testing-library/react'
import NewNPCForm from './NewNPCForm'
import { expect, test, vi } from 'vitest'

// Mock des actions serveur
vi.mock('@/app/actions/npc', () => ({
  createNPCAction: vi.fn()
}))

test('Affiche les champs de base', () => {
  render(<NewNPCForm monstersList={[]} />)
  expect(screen.getByText(/Nom/i)).toBeDefined()
  expect(screen.getByText(/Rôle/i)).toBeDefined()
  expect(screen.getByText(/Personnalité/i)).toBeDefined()
})

test('Le sélecteur de combat affiche les options conditionnelles', () => {
  render(<NewNPCForm monstersList={[]} />)
  
  // Par défaut "Civil" (none) -> Pas de champs PV/CA
  expect(screen.queryByPlaceholderText('PV (ex: 20)')).toBeNull()

  // On clique sur "Stats Uniques" (custom)
  const radioCustom = screen.getByLabelText(/Custom/i)
  fireEvent.click(radioCustom)

  // Maintenant les champs doivent apparaître
  expect(screen.getByPlaceholderText('PV')).toBeDefined()
})