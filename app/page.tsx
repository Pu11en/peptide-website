"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { blogs } from './data/blogs';
import { products as productList } from './data/products';
import { useCart } from '../components/cart/CartContext';
import CartIconButton from '../components/cart/CartIconButton';
import CheckoutCartButton from '../components/cart/CheckoutCartButton';
// Chatbot removed

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { addItem } = useCart();
  const productMap = new Map(productList.map((p) => [p.id, p]));

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Desktop Hero Image - Only visible on desktop */}
        <img
          src="https://res.cloudinary.com/dmdjagtkx/image/upload/v1759062155/defipullen_website_lighting_hero_--ar_21_--oref_httpss.mj.run_2220e69d-abbe-4745-bdc6-e3620788d579_3_2_yz6yoy.png"
          alt="Incredible Peptides - Lightning Energy"
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
        />
        
        {/* Mobile Hero Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover md:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        
        {/* 3 Lines Menu Button in Top Right Corner */}
        <button 
          onClick={toggleMenu} 
          className="absolute top-6 right-6 z-30 flex flex-col items-end focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <div className={`w-8 h-0.5 bg-white mb-2 transition-transform duration-300 ${isMenuOpen ? 'transform rotate-45 translate-y-2.5' : ''}`}></div>
          <div className={`w-8 h-0.5 bg-white mb-2 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
          <div className={`w-8 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? 'transform -rotate-45 -translate-y-2.5' : ''}`}></div>
        </button>
        
        {/* Navigation Menu */}
        <div className={`fixed inset-0 bg-black/90 z-20 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center justify-center h-full text-white">
            <nav className="text-center">
              <ul className="space-y-6">
                <li>
                  <Link href="#products" className="text-2xl font-medium hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="#research" className="text-2xl font-medium hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Research
                  </Link>
                </li>
                <li>
                  <Link href="#peptides" className="text-2xl font-medium hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Peptides
                  </Link>
                </li>
                <li>
                  <Link href="#coas" className="text-2xl font-medium hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    COAs
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-2xl font-medium hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-2xl font-medium hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-between h-full text-white px-4 text-center pt-20">
          <div className="flex-1"></div>
          
          {/* Scroll Down Indicator */}
          <div className="animate-bounce mb-28">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </div>
        </div>
        
        {/* Promotional Text */}
        <div className="absolute bottom-8 left-0 right-0 text-center z-20">
          <div className="bg-red-600 text-white font-bold py-2 px-6 rounded-full mx-auto inline-block animate-pulse shadow-lg border-2 border-white">
            <span className="text-lg">🎉 20% OFF FIRST PURCHASE 🎉</span>
          </div>
        </div>
      </section>
      
      {/* Peptide Information Section with Lightning Background */}
      <section id="peptides" className="relative py-12 font-roboto" style={{ fontFamily: "var(--font-roboto)" }}>
        {/* Lightning Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/lightning-bg.svg" 
            alt="Lightning background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Advanced Peptide Solutions</h2>
            
            <div className="bg-black/30 backdrop-blur-sm p-5 md:p-6 rounded-lg">
              <p className="text-base mb-5">
                Our premium USA-based peptides are synthesized with the highest purity standards (99%+) and undergo rigorous third-party quality testing to ensure consistency and efficacy in research applications.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <div className="bg-blue-900/40 p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Research Grade</h3>
                  <p className="text-sm">All peptides are manufactured in certified USA facilities with comprehensive documentation and certificates of analysis available for verification.</p>
                </div>
                
                <div className="bg-blue-900/40 p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Innovative Formulations</h3>
                  <p className="text-sm">Our catalog includes both established and novel peptide sequences designed for specialized research applications.</p>
                </div>
                
                <div className="bg-blue-900/40 p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Quality Verified</h3>
                  <p className="text-sm">Every product includes detailed purity documentation and third-party test results.</p>
                  <div className="mt-3">
                    <a href="#coas" className="inline-block bg-blue-600 text-white text-xs py-1.5 px-3 rounded hover:bg-blue-700 transition-colors">
                      View COA Documents
                    </a>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
  <section id="products" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-4">Products</h2>
      <p className="text-center text-gray-300 mb-3 max-w-2xl mx-auto">Browse our research-only peptide products. Not for human consumption.</p>
      {/* Section actions: Checkout */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <CheckoutCartButton className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2" />
      </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* BPC-157 & TB-500 */}
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-blue-900/50 hover:border-blue-500 transition-all hover:shadow-blue-900/30 hover:shadow-lg">
              <div className="relative h-64 bg-gray-900 p-4">
                <Link href="/products/bpc-157-tb-500">
                  <Image
                    src="/products/bpc 157 tb500 10mg.png"
                    alt="BPC-157 & TB-500 Blend"
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    priority={false}
                  />
                </Link>
              </div>
              <div className="p-5">
                <div className="flex flex-col mb-2">
                  <Link href="/products/bpc-157-tb-500" className="text-base font-semibold whitespace-nowrap hover:text-blue-300">BPC-157 & TB-500</Link>
                  <div className="mt-1.5">
                    <span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded text-xs inline-block">Blend</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mb-3">Premium blend for enhanced tissue repair and recovery research.</p>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-blue-400 font-bold text-sm">$89.99</p>
                  <span className="text-xs text-gray-400">10mg</span>
                </div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2"
                  onClick={() => {
                    const p = productMap.get('bpc-157-tb-500')
                    const size = '10mg'
                    const price = p?.sizes.find((s) => s.size === size)?.price ?? p?.price ?? 0
                    addItem({ slug: 'bpc-157-tb-500', name: p?.name || 'BPC-157 & TB-500', size, price, image: p?.image, quantity: 1 })
                  }}
                >Add to Cart</button>
              </div>
            </div>
            
            {/* GHK-Cu */}
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-blue-900/50 hover:border-blue-500 transition-all hover:shadow-blue-900/30 hover:shadow-lg">
              <div className="relative h-64 bg-gray-900 p-4">
                <Link href="/products/ghk">
                  <Image
                    src="/products/ghk cu 100mg bottle.png"
                    alt="GHK-Cu Peptide"
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    priority={false}
                  />
                </Link>
              </div>
              <div className="p-5">
                <div className="flex flex-col mb-2">
                  <Link href="/products/ghk" className="text-base font-semibold whitespace-nowrap hover:text-blue-300">GHK-Cu</Link>
                  <div className="mt-1.5">
                    <span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded text-xs inline-block">Copper Peptide</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mb-3">Copper peptide complex for skin rejuvenation research applications.</p>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-blue-400 font-bold text-sm">$119.99</p>
                  <span className="text-xs text-gray-400">100mg</span>
                </div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2"
                  onClick={() => {
                    const p = productMap.get('ghk')
                    const size = '100mg'
                    const price = p?.sizes.find((s) => s.size === size)?.price ?? p?.price ?? 0
                    addItem({ slug: 'ghk', name: p?.name || 'GHK-Cu', size, price, image: p?.image, quantity: 1 })
                  }}
                >Add to Cart</button>
              </div>
            </div>
            
            {/* Tirzepatide */}
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-blue-900/50 hover:border-blue-500 transition-all hover:shadow-blue-900/30 hover:shadow-lg">
              <div className="relative h-64 bg-gray-900 p-4">
                <Link href="/products/triz">
                  <Image
                    src="/products/Tirzepatide 10mg bottle.png"
                    alt="Tirzepatide Peptide"
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    priority={false}
                  />
                </Link>
              </div>
              <div className="p-5">
                <div className="flex flex-col mb-2">
                  <Link href="/products/triz" className="text-base font-semibold whitespace-nowrap hover:text-blue-300">Tirzepatide</Link>
                  <div className="mt-1.5">
                    <span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded text-xs inline-block">GIP/GLP-1</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mb-3">Dual GIP and GLP-1 receptor agonist for metabolic research.</p>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-blue-400 font-bold text-sm">$149.99</p>
                  <span className="text-xs text-gray-400">10mg</span>
                </div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2"
                  onClick={() => {
                    const p = productMap.get('triz')
                    const size = '10mg'
                    const price = p?.sizes.find((s) => s.size === size)?.price ?? p?.price ?? 0
                    addItem({ slug: 'triz', name: p?.name || 'Tirzepatide', size, price, image: p?.image, quantity: 1 })
                  }}
                >Add to Cart</button>
              </div>
            </div>
            
            {/* MOTS-c */}
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-blue-900/50 hover:border-blue-500 transition-all hover:shadow-blue-900/30 hover:shadow-lg">
              <div className="relative h-64 bg-gray-900 p-4">
                <Link href="/products/mots-c">
                  <Image
                    src="/products/Mots c 10mg bottle.png"
                    alt="MOTS-c Peptide"
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    priority={false}
                  />
                </Link>
              </div>
              <div className="p-5">
                <div className="flex flex-col mb-2">
                  <Link href="/products/mots-c" className="text-base font-semibold whitespace-nowrap hover:text-blue-300">MOTS-c</Link>
                  <div className="mt-1.5">
                    <span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded text-xs inline-block">Mitochondrial</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mb-3">Mitochondrial-derived peptide for metabolic function research.</p>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-blue-400 font-bold text-sm">$109.99</p>
                  <span className="text-xs text-gray-400">10mg</span>
                </div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2"
                  onClick={() => {
                    const p = productMap.get('mots-c')
                    const size = '10mg'
                    const price = p?.sizes.find((s) => s.size === size)?.price ?? p?.price ?? 0
                    addItem({ slug: 'mots-c', name: p?.name || 'MOTS-c', size, price, image: p?.image, quantity: 1 })
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
            
            {/* Melanotan II */}
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-blue-900/50 hover:border-blue-500 transition-all hover:shadow-blue-900/30 hover:shadow-lg">
              <div className="relative h-64 bg-gray-900 p-4">
                <Link href="/products/melanotan-ii">
                  <Image
                    src="/products/Melanotan II 10mg bottle.png"
                    alt="Melanotan II Peptide"
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    priority={false}
                  />
                </Link>
              </div>
              <div className="p-5">
                <div className="flex flex-col mb-2">
                  <Link href="/products/melanotan-ii" className="text-base font-semibold whitespace-nowrap hover:text-blue-300">Melanotan II</Link>
                  <div className="mt-1.5">
                    <span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded text-xs inline-block">Melanocortin</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mb-3">Synthetic analog of alpha-melanocyte stimulating hormone for research.</p>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-blue-400 font-bold text-sm">$79.99</p>
                  <span className="text-xs text-gray-400">10mg</span>
                </div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2"
                  onClick={() => {
                    const p = productMap.get('melanotan-ii')
                    const size = '10mg'
                    const price = p?.sizes.find((s) => s.size === size)?.price ?? p?.price ?? 0
                    addItem({ slug: 'melanotan-ii', name: p?.name || 'Melanotan II', size, price, image: p?.image, quantity: 1 })
                  }}
                >Add to Cart</button>
              </div>
            </div>
            
            {/* NAD+ */}
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-blue-900/50 hover:border-blue-500 transition-all hover:shadow-blue-900/30 hover:shadow-lg">
              <div className="relative h-64 bg-gray-900 p-4">
                <Link href="/products/nad">
                  <Image
                    src="/products/NAD+ 500mg bottle.png"
                    alt="NAD+ Supplement"
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    priority={false}
                  />
                </Link>
              </div>
              <div className="p-5">
                <div className="flex flex-col mb-2">
                  <Link href="/products/nad" className="text-base font-semibold whitespace-nowrap hover:text-blue-300">NAD+</Link>
                  <div className="mt-1.5">
                    <span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded text-xs inline-block">Coenzyme</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mb-3">Nicotinamide adenine dinucleotide for cellular energy research.</p>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-blue-400 font-bold text-sm">$199.99</p>
                  <span className="text-xs text-gray-400">500mg</span>
                </div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2"
                  onClick={() => {
                    const p = productMap.get('nad')
                    const size = '500mg'
                    const price = p?.sizes.find((s) => s.size === size)?.price ?? p?.price ?? 0
                    addItem({ slug: 'nad', name: p?.name || 'NAD+', size, price, image: p?.image, quantity: 1 })
                  }}
                >Add to Cart</button>
              </div>
            </div>
            
            {/* Removed placeholder empty product card */}
          </div>
        </div>
      </section>
      
      {/* Research & Education Section */}
      <section id="research" className="py-20 bg-gradient-to-b from-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-white">Research & Education</h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto text-sm">
            Stay informed with the latest peptide research and educational resources.
          </p>
          
          {/* Display blogs from the imported data */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-gray-800/70 rounded-lg overflow-hidden shadow-lg border border-blue-800/30 hover:border-blue-500/50 transition-all">
                <div className="relative w-full aspect-square">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 33vw, 100vw"
                    priority={false}
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-semibold text-white">{blog.title}</h3>
                    <span className="text-xs text-gray-400">{blog.date}</span>
                  </div>
                  <p className="text-gray-300 text-xs mb-3">
                    {blog.description}
                  </p>
                  <a href={blog.url} className="text-blue-400 text-xs hover:text-blue-300 inline-flex items-center">
                    Read Article
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {/* All Blogs Button */}
          <div className="mt-10 text-center">
            <Link href="/blogs" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              View All Blogs
            </Link>
          </div>
          
          <div className="text-center mt-12">
            <a href="#" className="text-blue-400 text-sm border border-blue-500 rounded-md px-6 py-2 hover:bg-blue-900/30 transition-colors inline-flex items-center">
              View All Resources
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Customer Testimonials</h2>
          <p className="text-center text-gray-700 max-w-2xl mx-auto mb-12 text-sm">
            See what researchers are saying about our peptide products
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  DR
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-gray-900">Dr. Robert M.</h4>
                  <p className="text-xs text-gray-500">Research Scientist</p>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex text-yellow-400 text-xs">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
              <p className="text-gray-700 text-xs">
                &quot;The purity of these peptides is exceptional. Our research has benefited greatly from the consistency and quality of the products.&quot;
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  JL
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-gray-900">Dr. Jennifer L.</h4>
                  <p className="text-xs text-gray-500">Biochemistry Lab Director</p>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex text-yellow-400 text-xs">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
              <p className="text-gray-700 text-xs">
                &quot;Fast shipping and excellent customer service. The detailed COAs provided with each product give us confidence in our research protocols.&quot;
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  MT
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-semibold text-gray-900">Dr. Michael T.</h4>
                  <p className="text-xs text-gray-500">Research Institute Director</p>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex text-yellow-400 text-xs">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
              <p className="text-gray-700 text-xs">
                &quot;We&apos;ve been using these peptides for over two years in our studies. The consistency between batches has been remarkable, which is crucial for our longitudinal research.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* COAs Section */}
      <section id="coas" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Certificates of Analysis</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 text-sm">
            All our products come with certificates of analysis to ensure quality and purity.
          </p>
          <div className="text-center">
            <button className="bg-blue-600 text-white py-2 px-6 text-sm rounded-md hover:bg-blue-700 transition-colors">
              View COAs
            </button>
          </div>
        </div>
      </section>
      
      {/* Educational Peptide Section */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Understanding Peptides</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12 text-sm">
            Comprehensive information about peptides, their functions, and applications in research
          </p>
          
          <div className="max-w-4xl mx-auto">
            {/* What Are Peptides */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">What Are Peptides?</h3>
              <p className="text-sm text-gray-700 mb-4">
                Peptides are short chains of amino acids—the fundamental building blocks of proteins—linked together by peptide bonds. Typically, peptides contain between 2 and 50 amino acids, making them smaller and more versatile than full proteins. Naturally occurring in the body, peptides play vital roles as hormones, neurotransmitters, and signaling molecules, influencing a wide range of biological processes.
              </p>
            </div>
            
            {/* How Do Peptides Work */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">How Do Peptides Work?</h3>
              <p className="text-sm text-gray-700 mb-4">
                Peptides function as messengers within the body, binding to specific receptors on cell surfaces to trigger various physiological responses. For example, some peptides regulate metabolism, support tissue repair, or promote collagen production for skin health. Because of their targeted actions, peptides are widely studied for their potential in medical research and therapeutic applications.
              </p>
            </div>
            
            {/* Peptides vs. Proteins */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Peptides vs. Proteins: What&apos;s the Difference?</h3>
              <p className="text-sm text-gray-700 mb-4">
                While both peptides and proteins are made of amino acids, the key difference lies in their size and complexity. Peptides are shorter chains (2–50 amino acids), whereas proteins are longer and often fold into complex three-dimensional structures. This distinction affects their biological functions and how they are used in research and medicine.
              </p>
            </div>
            
            {/* Benefits and Applications */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Benefits and Applications of Peptides</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Skin Health */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium mb-2 text-gray-900">Skin Health</h4>
                  <p className="text-xs text-gray-700">
                    Certain peptides, such as copper peptides, are known to support skin regeneration, improve elasticity, and reduce the appearance of wrinkles.
                  </p>
                </div>
                
                {/* Muscle Growth */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium mb-2 text-gray-900">Muscle Growth & Recovery</h4>
                  <p className="text-xs text-gray-700">
                    Peptides like BPC-157 and TB-500 are studied for their potential to enhance muscle repair and accelerate recovery from injuries.
                  </p>
                </div>
                
                {/* Metabolic Function */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium mb-2 text-gray-900">Metabolic Function</h4>
                  <p className="text-xs text-gray-700">
                    Some peptides, including tirzepatide, act as metabolic regulators and are being researched for their roles in managing conditions like diabetes and obesity.
                  </p>
                </div>
                
                {/* Research Uses */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-medium mb-2 text-gray-900">Research & Therapeutic Uses</h4>
                  <p className="text-xs text-gray-700">
                    Peptides are used in a variety of research settings, from studying cellular signaling to developing new medications.
                  </p>
                </div>
              </div>
            </div>
            
            {/* FDA-Approved vs. Experimental */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">FDA-Approved vs. Experimental Peptides</h3>
              <p className="text-sm text-gray-700 mb-4">
                The FDA has approved certain peptides for specific medical uses, such as insulin analogs for diabetes and glucagon-like peptide-1 (GLP-1) agonists for metabolic disorders. However, many peptides available online are considered experimental and are not approved for human use outside of research settings. It&apos;s crucial to distinguish between regulated, prescription peptides and those intended solely for laboratory research.
              </p>
            </div>
            
            {/* Safety and Guidance */}
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Peptide Safety, Legality, and Professional Guidance</h3>
              <p className="text-sm text-gray-700 mb-4">
                While peptides offer exciting possibilities, their safety and efficacy can vary widely. Only FDA-approved peptides should be used for medical purposes, and all others should be handled strictly for research. Always consult a qualified healthcare professional before considering peptide use, and ensure you source peptides from reputable suppliers who provide certificates of analysis and comply with regulatory standards.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Frequently Asked Questions</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12 text-sm">
            Common questions about peptides and our research products
          </p>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4">
                <h3 className="text-sm font-semibold text-gray-900">What are peptides?</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-xs text-gray-700">
                  Peptides are short chains of amino acids linked by peptide bonds. They are smaller than proteins and typically contain between 2 and 50 amino acids. In research settings, peptides are studied for their various biological functions and potential applications.
                </p>
              </div>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4">
                <h3 className="text-sm font-semibold text-gray-900">Are peptides safe?</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-xs text-gray-700">
                  FDA-approved peptides are generally considered safe when used as prescribed. Experimental peptides may carry unknown risks and should only be used in controlled research settings. Always consult with a qualified healthcare professional before considering any peptide use.
                </p>
              </div>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4">
                <h3 className="text-sm font-semibold text-gray-900">Can I buy peptides legally in the USA?</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-xs text-gray-700">
                  Only FDA-approved peptides are legal for human use with a prescription. Other peptides are sold for research purposes only and are not intended for human consumption. Always ensure you&apos;re purchasing from reputable suppliers who comply with all regulatory requirements.
                </p>
              </div>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4">
                <h3 className="text-sm font-semibold text-gray-900">How should peptides be stored?</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-xs text-gray-700">
                  Most lyophilized (freeze-dried) peptides should be stored at -20°C or below. Once reconstituted, peptide solutions should typically be stored at -20°C and used within 1-2 weeks. Specific storage recommendations may vary by peptide and are included with each product.
                </p>
              </div>
            </div>
            
            {/* FAQ Item 5 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4">
                <h3 className="text-sm font-semibold text-gray-900">What is a Certificate of Analysis (COA)?</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-xs text-gray-700">
                  A Certificate of Analysis is a document that confirms a product meets its specification. Our COAs include information about purity, molecular weight verification, and other quality control tests performed on each batch of peptides.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Contact Us</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 text-sm">
            Have questions about our products? Our team is here to help.
          </p>
          
          <div className="max-w-xl mx-auto">
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-1 text-sm">Name</label>
                <input type="text" id="name" className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-1 text-sm">Email</label>
                <input type="email" id="email" className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-1 text-sm">Message</label>
                <textarea id="message" rows={4} className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 text-sm rounded-md hover:bg-blue-700 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#0a1a2f] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="mb-4">Incredible Peptides</p>
            <p className="text-sm text-white/70">
              For research purposes only. Not for human consumption.
            </p>
            <p className="text-sm text-white/70 mt-4">
              © {new Date().getFullYear()} Incredible Peptides. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
