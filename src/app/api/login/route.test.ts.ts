import { POST } from './route'
import { expect, test, vi } from 'vitest'

// Mock des cookies et de l'env
vi.mock('next/headers', () => ({
  cookies: () => ({
    set: vi.fn()
  })
}))

// On simule l'environnement
process.env.APP_PASSWORD = "Melon"

test('Login réussit avec bon mot de passe', async () => {
  const req = new Request('http://localhost/api/login', {
    method: 'POST',
    body: JSON.stringify({ password: 'Melon' })
  })
  
  const res = await POST(req)
  const data = await res.json()
  
  expect(res.status).toBe(200)
  expect(data.success).toBe(true)
})

test('Login échoue avec mauvais mot de passe', async () => {
  const req = new Request('http://localhost/api/login', {
    method: 'POST',
    body: JSON.stringify({ password: 'Faux' })
  })
  
  const res = await POST(req)
  const data = await res.json()
  
  expect(res.status).toBe(401)
  expect(data.error).toBeDefined()
})