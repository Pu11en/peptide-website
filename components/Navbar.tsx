'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
              <button onClick={() => scrollToSection('products')} className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-blue-400 transition-colors">
                Shop
              </button>
              <button onClick={() => scrollToSection('research')} className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-blue-400 transition-colors">
                Research
              </button>
              <button onClick={() => scrollToSection('peptides')} className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-blue-400 transition-colors">
                Peptides
              </button>
              <button onClick={() => scrollToSection('coas')} className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-blue-400 transition-colors">
                COAs
              </button>
              <button onClick={() => scrollToSection('contact')} className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-blue-400 transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div 
        className={`${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} 
        fixed top-0 right-0 h-full w-64 bg-[#0a1a2f] shadow-lg transform transition-all duration-300 ease-in-out z-50 sm:hidden`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-blue-400"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-4 pt-2 pb-3 space-y-3">
          <button onClick={() => scrollToSection('products')} className="block w-full text-left px-4 py-3 rounded-md text-base font-medium text-white hover:bg-blue-800 hover:text-white transition-colors">
            Shop
          </button>
          <button onClick={() => scrollToSection('research')} className="block w-full text-left px-4 py-3 rounded-md text-base font-medium text-white hover:bg-blue-800 hover:text-white transition-colors">
            Research
          </button>
          <button onClick={() => scrollToSection('peptides')} className="block w-full text-left px-4 py-3 rounded-md text-base font-medium text-white hover:bg-blue-800 hover:text-white transition-colors">
            Peptides
          </button>
          <button onClick={() => scrollToSection('coas')} className="block w-full text-left px-4 py-3 rounded-md text-base font-medium text-white hover:bg-blue-800 hover:text-white transition-colors">
            COAs
          </button>
          <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-4 py-3 rounded-md text-base font-medium text-white hover:bg-blue-800 hover:text-white transition-colors">
            Contact
          </button>
        </div>
      </div>
      
      {/* Overlay when mobile menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </nav>
  )
}