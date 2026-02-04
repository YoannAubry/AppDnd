import { render, screen, fireEvent } from '@testing-library/react'
import { DynamicList } from './DynamicList'
import { expect, test, vi } from 'vitest'

const mockOnChange = vi.fn()

test('Affiche le label et le bouton ajouter', () => {
  render(<DynamicList label="Sorts" namePrefix="spell" items={[]} onChange={mockOnChange} />)
  expect(screen.getByText('Sorts')).toBeDefined()
  expect(screen.getByText('+ Ajouter')).toBeDefined()
})

test('Ajouter un élément appelle onChange', () => {
  render(<DynamicList label="Sorts" namePrefix="spell" items={[]} onChange={mockOnChange} />)
  
  fireEvent.click(screen.getByText('+ Ajouter'))
  
  // Vérifie que onChange a été appelé avec un tableau contenant un nouvel item vide
  expect(mockOnChange).toHaveBeenCalledWith([{ name: "", desc: "" }])
})

test('Supprimer un élément fonctionne', () => {
  const items = [{ name: 'Feu', desc: 'Brûle' }]
  render(<DynamicList label="Sorts" namePrefix="spell" items={items} onChange={mockOnChange} />)
  
  fireEvent.click(screen.getByText('×'))
  
  // Vérifie que onChange a été appelé avec un tableau vide
  expect(mockOnChange).toHaveBeenCalledWith([])
})