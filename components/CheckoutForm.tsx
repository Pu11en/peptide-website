'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  PaymentElement,
  LinkAuthenticationElement,
  AddressElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreditCard, Loader2, Check, AlertCircle } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

const ShippingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
})

type ShippingFormData = z.infer<typeof ShippingSchema>

interface CheckoutFormProps {
  clientSecret: string
  totalAmount: number
  items: Array<{
    slug: string
    name: string
    size?: string
    price: number
    quantity: number
  }>
}

export default function CheckoutForm({ clientSecret, totalAmount, items }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [isComplete, setIsComplete] = useState(false)
  const [testMode, setTestMode] = useState(true)
  const [selectedTestCard, setSelectedTestCard] = useState('success')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(ShippingSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })

  const testCards = [
    { id: 'success', number: '4242 4242 4242 4242', label: 'Successful Payment' },
    { id: 'decline', number: '4000 0000 0000 0002', label: 'Card Declined' },
    { id: 'insufficient', number: '4000 0000 0000 9995', label: 'Insufficient Funds' },
    { id: '3dsecure', number: '4000 0025 0000 3155', label: '3D Secure Required' },
  ]

  useEffect(() => {
    if (!stripe || !elements) return

    const handlePaymentElementChange = (event: any) => {
      if (event.complete) {
        setMessage('')
      }
    }

    const paymentElement = elements.getElement('payment')
    if (paymentElement) {
      paymentElement.on('change', handlePaymentElementChange)
    }

    return () => {
      if (paymentElement) {
        paymentElement.off('change', handlePaymentElementChange)
      }
    }
  }, [stripe, elements])

  const handleSubmitForm = async (data: ShippingFormData) => {
    if (!stripe || !elements) {
      setMessage('Payment system not ready. Please try again.')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
          payment_method_data: {
            billing_details: {
              name: data.name,
              email: data.email,
              phone: data.phone,
            },
          },
        },
        redirect: 'if_required',
      })

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        setIsComplete(true)
        setMessage('Payment successful! Redirecting...')
        // Redirect to success page after a short delay
        setTimeout(() => {
          window.location.href = '/success'
        }, 2000)
        return
      }

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message || 'Payment failed')
        } else {
          setMessage('An unexpected error occurred.')
        }
      } else {
        setIsComplete(true)
        setMessage('Payment successful! Redirecting...')
      }
    } catch (err: any) {
      setMessage(err.message || 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  const paymentElementOptions = {
    layout: 'tabs' as const,
    fields: {
      billingDetails: {
        name: 'never' as const,
        email: 'never' as const,
        phone: 'never' as const,
        address: 'never' as const,
      },
    },
  }

  if (isComplete) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-green-500 mb-4">
          <Check className="w-16 h-16 mx-auto" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">Your order has been processed successfully.</p>
        <div className="animate-pulse">
          <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Test Mode Toggle */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="testMode"
              checked={testMode}
              onChange={(e) => setTestMode(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="testMode" className="text-sm text-gray-600">Test Mode</label>
          </div>
        </div>

        {testMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm font-medium text-yellow-800 mb-2">Test Card Information:</p>
            <select
              value={selectedTestCard}
              onChange={(e) => setSelectedTestCard(e.target.value)}
              className="w-full p-2 border border-yellow-300 rounded-md text-sm"
            >
              {testCards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.number} - {card.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-yellow-700 mt-2">
              Any future expiry date, any CVC, any postal code
            </p>
          </div>
        )}
      </div>

      {/* Shipping Information */}
      <form onSubmit={handleSubmit(handleSubmitForm)} className="p-6 space-y-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Shipping Address</h4>
          <AddressElement
            options={{
              mode: 'shipping',
              fields: {
                phone: 'always',
              },
            }}
          />
        </div>

        {/* Payment Element */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Payment Method</h4>
          <PaymentElement options={paymentElementOptions} />
        </div>

        {/* Error Message */}
        {message && (
          <div className={`p-4 rounded-md flex items-center gap-2 ${
            message.includes('successful') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.includes('successful') ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !stripe || !elements}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Pay ${totalAmount.toFixed(2)}
            </>
          )}
        </button>

        {/* Security Note */}
        <p className="text-xs text-gray-500 text-center">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </form>
    </div>
  )
}