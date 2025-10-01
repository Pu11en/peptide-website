'use client'

import { useMemo, useState } from 'react'
import { useCart } from './CartContext'
import CheckoutCartButton from './CheckoutCartButton'

export default function CartModal() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [country, setCountry] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const shippingCents = 1000
  const totalWithShipping = useMemo(() => total + shippingCents / 100, [total])

  if (!isOpen) return null

  const formValid =
    !!name &&
    !!email &&
    !!phone &&
    !!street &&
    !!city &&
    !!state &&
    !!zip &&
    !!country &&
    acceptTerms

  const customer = {
    name,
    email,
    phone,
    address: { street, city, state, zip, country },
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={closeCart} />
      <div className="relative bg-gray-900 text-white rounded-lg shadow-xl w-[95vw] max-w-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <button onClick={closeCart} className="text-gray-300 hover:text-white">✕</button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-400">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-3 max-h-[35vh] overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.slug}-${item.size ?? ''}`} className="flex items-center justify-between border border-blue-900/40 rounded p-2">
                  <div className="text-sm">
                    <div className="font-medium">{item.name} {item.size ? `(${item.size})` : ''}</div>
                    <div className="text-gray-400">${item.price.toFixed(2)} each</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.slug, item.size, Math.max(1, Number(e.target.value)))}
                      className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                    />
                    <button
                      className="text-red-400 hover:text-red-300 text-sm"
                      onClick={() => removeItem(item.slug, item.size)}
                    >Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3 border-t border-gray-700 pt-3">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-300">Subtotal</div>
                <div className="text-lg font-bold text-blue-400">${total.toFixed(2)}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-300">Shipping</div>
                <div className="text-lg font-bold text-blue-400">$10.00</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-300">Total</div>
                <div className="text-lg font-bold text-blue-400">${totalWithShipping.toFixed(2)}</div>
              </div>
            </div>

            <form className="mt-4 space-y-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm" />

              <input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm" />
                <input value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Zip" className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm" />
                <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm" />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                Accept Terms (required)
              </label>
            </form>

            <div className="mt-3">
              <CheckoutCartButton
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 disabled:opacity-50"
                customer={formValid ? customer : undefined}
                shippingCents={shippingCents}
                requireCustomer={true}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}