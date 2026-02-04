import { render, screen } from '@testing-library/react'
import { MonsterCard } from '@/components/bestiary/MonsterCard' // Corrige le chemin si besoin
import { expect, test, vi } from 'vitest'

// Mock des types
const mockMonster: any = {
  _id: '123',
  name: 'Dragon Rouge',
  slug: { current: 'dragon-rouge' },
  type: 'Dragon',
  stats: { hp: '200', ac: 19, challenge: '10' }
}

test('Le lien pointe vers la bonne page', () => {
  render(<MonsterCard monster={mockMonster} />)
  
  const link = screen.getByRole('link')
  expect(link.getAttribute('href')).toBe('/bestiary/dragon-rouge')
})