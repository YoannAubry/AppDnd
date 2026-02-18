import { expect, test } from 'vitest'
import { calculateDamage, calculateHeal, sortCombatants, calculateNextTurn } from './combat'

// Test Dégâts
test('Les dégâts réduisent les PV', () => {
  expect(calculateDamage(10, 3)).toBe(7)
})

test('Les dégâts ne descendent pas sous 0 (Overkill)', () => {
  expect(calculateDamage(5, 100)).toBe(0)
})

// Test Soin
test('Le soin augmente les PV', () => {
  expect(calculateHeal(5, 20, 5)).toBe(10)
})

test('Le soin ne dépasse pas le max', () => {
  expect(calculateHeal(18, 20, 5)).toBe(20)
})

// Test Tri
test('Le tri met les plus hautes initiatives en premier', () => {
  const list = [
    { id: '1', name: 'Lent', initiative: 5, hp: 10, hpMax: 10 },
    { id: '2', name: 'Rapide', initiative: 20, hp: 10, hpMax: 10 },
  ]
  const sorted = sortCombatants(list)
  expect(sorted[0].name).toBe('Rapide')
  expect(sorted[1].name).toBe('Lent')
})

// Test Tours
test('Passe au combattant suivant', () => {
  const result = calculateNextTurn(0, 3) // Index 0 sur 3 combattants
  expect(result.index).toBe(1)
  expect(result.newRound).toBe(false)
})

test('Boucle et change de round à la fin', () => {
  const result = calculateNextTurn(2, 3) // Index 2 (dernier) sur 3 combattants
  expect(result.index).toBe(0)
  expect(result.newRound).toBe(true)
})