import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock des variables d'environnement pour tous les tests
vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'test-project-id')
vi.stubEnv('SANITY_API_WRITE_TOKEN', 'test-write-token')
vi.stubEnv('APP_PASSWORD', 'test-password')

// Mock de matchMedia (nécessaire pour certains composants UI)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})