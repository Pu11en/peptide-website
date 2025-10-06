"use client"
import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-gray-600">We’ve logged the error. You can try again.</p>
        <button className="mt-4 px-4 py-2 rounded bg-black text-white" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  )
}