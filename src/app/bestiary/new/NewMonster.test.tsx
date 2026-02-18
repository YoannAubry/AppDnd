import { render, screen } from '@testing-library/react'
import NewMonsterPage from './page'
import { expect, test, vi } from 'vitest'

// On mock l'action serveur (car on ne peut pas appeler le serveur en test unitaire)
vi.mock('@/app/actions/bestiary', () => ({
  createMonsterAction: vi.fn()
}))

test('Le formulaire affiche les champs obligatoires', () => {
  render(<NewMonsterPage />)
  
  expect(screen.getByText('Nom')).toBeDefined()
  expect(screen.getByText('Type')).toBeDefined()
  expect(screen.getByText('PV')).toBeDefined()
  expect(screen.getByText('CA')).toBeDefined()
  
  // Vérifie le bouton submit
  expect(screen.getByText('Enregistrer')).toBeDefined()
})