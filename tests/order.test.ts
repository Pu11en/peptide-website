import { describe, it, expect, beforeAll } from '@jest/globals'
import { POST } from '@/app/api/orders/route'

describe('Order API', () => {
  beforeAll(() => {
    // Ensure DB is not used in tests; route will fall back to static pricing
    process.env.DATABASE_URL = ''
    // Prevent actual network calls to n8n during tests
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true })
  })

  it('creates order with static pricing', async () => {
    const req = new Request('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'researcher@example.com',
        items: [{ slug: 'bpc-157-tb-500', quantity: 1, size: '5mg' }],
      }),
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.totalCents).toBe(8999)
    expect(data.persisted).toBe(false)
    expect(data.usingDb).toBe(false)
  })
})