import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'
import { expect, test } from 'vitest'

test('Le Badge affiche le texte correctement', () => {
  render(<Badge>Test Badge</Badge>)
  
  // On vérifie que le texte est là
  expect(screen.getByText('Test Badge')).toBeDefined()
})

test('Le Badge applique la classe de couleur', () => {
  render(<Badge color="red">Danger</Badge>)
  
  // On vérifie qu'il a la classe rouge
  const badge = screen.getByText('Danger')
  expect(badge.className).toContain('bg-red-900')
})