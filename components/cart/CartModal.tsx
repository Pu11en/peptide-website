'use client'

import { useState } from 'react'
import { useCart } from './CartContext'
import CheckoutCartButton from './CheckoutCartButton'

export default function CartModal() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart()
  const [confirmSupplies, setConfirmSupplies] = useState(false)

  if (!isOpen) return null

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
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
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
        )}

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-300">Total</div>
          <div className="text-lg font-bold text-blue-400">${total.toFixed(2)}</div>
        </div>

        {!confirmSupplies ? (
          <div className="mt-4 space-y-2">
            <button
              disabled={items.length === 0}
              onClick={() => setConfirmSupplies(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 disabled:opacity-50"
            >Checkout</button>
            <p className="text-xs text-gray-400">First-time buyers will be asked about supplies.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3 border-t border-gray-700 pt-3">
            <p className="text-sm">Are you a first-time peptide buyer? You’ll need:</p>
            <ul className="text-sm list-disc list-inside text-gray-300">
              <li>
                Syringes: <a className="text-blue-400 hover:underline" target="_blank" href="https://a.co/d/3621bhc" rel="noreferrer">https://a.co/d/3621bhc</a>
              </li>
              <li>
                BAC water (reconstitution solution): <a className="text-blue-400 hover:underline" target="_blank" href="https://www.amazon.com/s?k=bac+water+for+peptides&crid=1BU0WL466H73K&sprefix=bac+wa%2Caps%2C128&ref=nb_sb_ss_p13n-expert-pd-ops-ranker_2_6" rel="noreferrer">Amazon BAC water search</a>
              </li>
            </ul>
            <div className="flex gap-2">
              <CheckoutCartButton className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded py-2" />
              <button onClick={() => setConfirmSupplies(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 rounded py-2">Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}