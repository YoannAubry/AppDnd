import { render, screen, fireEvent } from '@testing-library/react'
import { ActView } from './ActView'
import { expect, test } from 'vitest'

const mockAct = {
  title: "Chapitre 1",
  summary: "Le début de la fin.",
  locations: []
}

test('Affiche le titre et le résumé', () => {
  render(<ActView act={mockAct} index={0} />)
  expect(screen.getByText('Chapitre 1')).toBeDefined()
  expect(screen.getByText('Le début de la fin.')).toBeDefined()
})

test('Le contenu (Lieux) est affiché si ouvert (index 0)', () => {
  render(<ActView act={mockAct} index={0} />)
  // Comme c'est le 1er (index 0), il est open par défaut
  // On vérifie que la div de contenu est là (par exemple le texte "Aucun lieu")
  expect(screen.getByText(/Aucun lieu/i)).toBeDefined()
})

test('Le clic ouvre/ferme', () => {
  render(<ActView act={mockAct} index={1} />) // Index 1 = fermé par défaut
  
  // On ne devrait pas voir le contenu
  expect(screen.queryByText(/Aucun lieu/i)).toBeNull()
  
  // Clic sur le titre
  fireEvent.click(screen.getByText('Chapitre 1'))
  
  // Maintenant on doit le voir
  expect(screen.getByText(/Aucun lieu/i)).toBeDefined()
})