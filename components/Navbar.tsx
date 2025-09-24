'use client'

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 bg-[#0a1a2f] text-white backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              {/* Business name removed */}
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="#products" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-primary">
                Shop
              </Link>
              <Link href="#categories" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-primary">
                Categories
              </Link>
              <Link href="#coas" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-primary">
                COAs
              </Link>
              <Link href="#contact" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-primary">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden bg-[#0a1a2f]`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="#products" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary" onClick={() => setIsOpen(false)}>
            Shop
          </Link>
          <Link href="#categories" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary" onClick={() => setIsOpen(false)}>
            Categories
          </Link>
          <Link href="#coas" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary" onClick={() => setIsOpen(false)}>
            COAs
          </Link>
          <Link href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}