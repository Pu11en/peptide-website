import Link from 'next/link'

export default function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams?.session_id
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Payment Successful</h1>
          <p className="text-gray-700 mb-6">
            Thank you for your purchase. Your payment has been processed.
          </p>
          {sessionId && (
            <p className="text-sm text-gray-600 mb-6">Stripe session: {sessionId}</p>
          )}
          <Link href="/" className="inline-block px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}