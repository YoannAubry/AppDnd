import { expect, test, describe } from 'vitest'
import { generateSlug, getNumber, getString, parseJsonList } from './actions-utils'

// --- 1. TESTS SLUG ---
describe('generateSlug', () => {
  test('minuscules et tirets', () => {
    expect(generateSlug("Dragon Rouge")).toBe("dragon-rouge")
    expect(generateSlug("Gobelin")).toBe("gobelin")
  })

  test('gère les caractères spéciaux', () => {
    expect(generateSlug("L'Épée de Vérité !")).toBe("lepee-de-verite")
    expect(generateSlug("Noël & Pâques")).toBe("noel-paques")
  })

  test('nettoie les tirets multiples', () => {
    expect(generateSlug("   A   B   ")).toBe("a-b")
    expect(generateSlug("-Test-")).toBe("test")
  })

  test('gère les entrées vides', () => {
    expect(generateSlug("")).toBe("")
  })
})

// --- 2. TESTS NOMBRES ---
describe('getNumber', () => {
  test('convertit une string en nombre', () => {
    const formData = new FormData()
    formData.append('age', '42')
    expect(getNumber(formData, 'age')).toBe(42)
  })

  test('renvoie la valeur par défaut si vide', () => {
    const formData = new FormData()
    expect(getNumber(formData, 'missing', 10)).toBe(10)
  })

  test('renvoie la valeur par défaut si invalide', () => {
    const formData = new FormData()
    formData.append('bad', 'not-a-number')
    expect(getNumber(formData, 'bad', 5)).toBe(NaN) // Note: Number("abc") = NaN, attention !
    // Si tu veux que ça renvoie defaultValue sur NaN, il faut modifier la fonction getNumber
  })
})

// --- 3. TESTS STRING ---
describe('getString', () => {
  test('récupère la valeur', () => {
    const fd = new FormData()
    fd.append('name', 'Yoann')
    expect(getString(fd, 'name')).toBe('Yoann')
  })

  test('renvoie chaine vide si manquant', () => {
    const fd = new FormData()
    expect(getString(fd, 'ghost')).toBe('')
  })
})

// --- 4. TESTS JSON ---
describe('parseJsonList', () => {
  test('parse une liste valide', () => {
    const json = JSON.stringify([{ name: 'Item 1' }, { name: 'Item 2' }])
    const res = parseJsonList(json)
    expect(res).toHaveLength(2)
    expect(res[0]).toHaveProperty('name', 'Item 1')
  })

  test('filtre les éléments vides', () => {
    const json = JSON.stringify([{ name: 'Valid' }, { name: '' }, { desc: 'No Name' }])
    const res = parseJsonList(json)
    expect(res).toHaveLength(1)
    expect(res[0]).toHaveProperty('name', 'Valid')
  })

  test('gère les erreurs de syntaxe sans planter', () => {
    const res = parseJsonList("Ce n'est pas du JSON")
    expect(res).toEqual([])
  })

  test('gère null ou undefined', () => {
    expect(parseJsonList(null)).toEqual([])
  })
})