import { render, screen, fireEvent } from '@testing-library/react'
import NewCampaignForm from './NewCampaignForm'
import { expect, test, vi } from 'vitest'

// Mock des actions
vi.mock('@/app/actions/campaign', () => ({
  createCampaignAction: vi.fn()
}))

// Mock des données Lieux
const mockLocations = [
  { _id: '1', name: 'Taverne' },
  { _id: '2', name: 'Donjon' }
]

test('Affiche les champs principaux', () => {
  render(<NewCampaignForm allLocations={mockLocations} />)
  expect(screen.getByText('Titre')).toBeDefined()
  expect(screen.getByText('Synopsis')).toBeDefined()
})

test('Peut ajouter un Acte', () => {
  render(<NewCampaignForm allLocations={mockLocations} />)
  
  // Au début : 0 acte -> message "vide"
  expect(screen.getByText(/L'histoire est encore vide/i)).toBeDefined()
  
  // Clic sur Ajouter
  const btn = screen.getByText('+ Ajouter un Acte')
  fireEvent.click(btn)
  
  // Vérifie qu'un input "Acte 1" est apparu
  expect(screen.getByPlaceholderText('Titre de l\'Acte 1')).toBeDefined()
})

test('Peut sélectionner un lieu dans un acte', () => {
  render(<NewCampaignForm allLocations={mockLocations} />)
  
  // Ajoute un acte
  fireEvent.click(screen.getByText('+ Ajouter un Acte'))
  
  // Le bouton "Taverne" doit être là
  const taverneBtn = screen.getByText('Taverne')
  expect(taverneBtn).toBeDefined()
  
  // Clic sur Taverne (devrait changer de classe/style)
  fireEvent.click(taverneBtn)
  
  // On vérifie qu'il a la classe active (bg-purple-600)
  expect(taverneBtn.className).toContain('bg-purple-600')
})