import { render, screen } from '@testing-library/react'
// Note : Tester une page serveur async directement est complexe avec Vitest simple.
// Astuce : On teste le comportement attendu via un composant factice qui simule la page
// OU on extrait la vue dans PlayerView.tsx (recommandé).
// Pour l'instant, faisons un test unitaire simple sur un composant UI.
import { Badge } from '@/components/ui/Badge' // Test simple pour vérifier l'environnement
import { expect, test } from 'vitest'

test('Badge joueur s\'affiche', () => {
  render(<Badge color="blue">Paladin</Badge>)
  expect(screen.getByText('Paladin')).toBeDefined()
})