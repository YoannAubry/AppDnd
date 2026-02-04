import { render, screen, fireEvent } from '@testing-library/react'
import { Navbar } from './Navbar'
import { expect, test, vi } from 'vitest'

// Mock de usePathname car c'est un hook Next.js
vi.mock('next/navigation', () => ({
  usePathname: () => '/'
}))

test('Affiche les liens principaux sur Desktop', () => {
  render(<Navbar />)
  
  // Vérifie que les liens sont là (pour écran large)
  expect(screen.getByText('🐉 Bestiaire')).toBeDefined()
  expect(screen.getByText('⚔️ Combat')).toBeDefined()
})

test('Le menu mobile s\'ouvre au clic', () => {
  render(<Navbar />)
  
  // Le bouton burger (souvent aria-label="Menu" ou juste un symbole ☰)
  const burger = screen.getByLabelText('Menu') // Assure-toi d'avoir mis aria-label="Menu" sur le bouton
  
  // Au début, le menu mobile est caché (on suppose qu'il n'est pas dans le DOM ou caché par CSS)
  // Ici on teste la logique d'état React : cliquer doit changer l'état
  
  fireEvent.click(burger)
  
  // Après clic, le bouton de fermeture ✖ doit apparaître
  expect(screen.getByText('✖')).toBeDefined()
})