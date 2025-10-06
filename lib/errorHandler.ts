type Handler = (req: Request) => Promise<Response>

export function withErrorHandling(handler: Handler): Handler {
  return async (req: Request) => {
    try {
      return await handler(req)
    } catch (error: any) {
      console.error('API route error', error)

      const webhook = process.env.N8N_ERROR_WEBHOOK_URL
      if (webhook) {
        const payload = {
          path: new URL(req.url).pathname,
          message: error?.message || 'Unknown error',
          stack: error?.stack,
        }
        fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          cache: 'no-store',
        }).catch(() => {})
      }

      return new Response(JSON.stringify({ error: 'Server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }
}