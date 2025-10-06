"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { blogs } from './data/blogs';
import ProductGrid from '../components/ProductGrid';
import SlideOutCart from '../components/cart/SlideOutCart';
import { useCart } from '../components/cart/CartContext';
import CartIconButton from '../components/cart/CartIconButton';
import CheckoutCartButton from '../components/cart/CheckoutCartButton';
// Chatbot removed

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen, openCart } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('canceled') === '1') {
      alert('Payment canceled. Try again.')
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => {
      console.log('Device detection:', mq.matches ? 'Mobile' : 'Desktop');
      setIsMobile(mq.matches);
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Desktop Hero Video - Only visible on desktop */}
        {!isMobile && (
          <video
            className="absolute inset-0 w-full h-full object-cover hidden md:block"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadStart={() => console.log('Desktop video: Loading started')}
            onCanPlay={() => console.log('Desktop video: Can play')}
            onCanPlayThrough={() => console.log('Desktop video: Can play through')}
            onError={(e) => console.error('Desktop video: Error loading', e)}
            ref={(video) => {
              if (video) {
                // Force play after component mounts
                const playPromise = video.play();
                if (playPromise !== undefined) {
                  playPromise.catch(error => {
                    console.log('Desktop video autoplay prevented:', error);
                    // Add user interaction listener to enable play
                    const enablePlay = () => {
                      video.play().catch(e => console.error('Desktop video play failed:', e));
                      document.removeEventListener('click', enablePlay);
                      document.removeEventListener('touchstart', enablePlay);
                    };
                    document.addEventListener('click', enablePlay, { once: true });
                    document.addEventListener('touchstart', enablePlay, { once: true });
                  });
                }
              }
            }}
          >
            <source src="https://res.cloudinary.com/dmdjagtkx/video/upload/v1759408577/4fdd1c67-f89a-4766-964a-7ee2101630be_vfur0q.mp4" type="video/mp4" />
          </video>
        )}
        
        {/* Mobile Hero Video - Only visible on mobile */}
        {isMobile && (
          <video
            className="absolute inset-0 w-full h-full object-cover md:hidden"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            onLoadStart={() => console.log('Mobile video: Loading started')}
            onCanPlay={() => console.log('Mobile video: Can play')}
            onError={(e) => console.error('Mobile video: Error loading', e)}
          >
            <source src="https://res.cloudinary.com/dmdjagtkx/video/upload/v1758689443/social_defipullen_httpss.mj.run4owL1ng-Xks_website_lighting_hero_--a_5d363600-c6ef-4ebc-bd63-71ebde3c4da7_2_ptz2ph.mp4" type="video/mp4" media="(max-width: 767px)" />
          </video>
        )}
        
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
                  <Link href="#education" className="text-2xl font-medium hover:text-blue-400 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Education
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
      <section id="peptides" className="relative py-12 font-roboto scroll-mt-24" style={{ fontFamily: "var(--font-roboto)" }}>
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
      <section id="products" className="relative py-20 text-white scroll-mt-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/defipullen_httpss.mj.runD94ZuWzMOsU_website_hero_--raw_--oref_b6fe6208-70b5-4bd2-ae9e-015fcb3008fd_3.png"
            alt="Products background"
            className="w-full h-full object-cover"
          />
          {/* Overlay for better content visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-gray-800/90"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <ProductGrid />
        </div>
      </section>
      
      {/* Research & Education Section */}
      <section id="research" className="relative py-20 text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/defipullen_httpss.mj.runbqegFTIoev8_An_architectural_environm_b5968b4d-49ac-483d-92ad-12dc057063fa_3.png"
            alt="Research background"
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/90 to-gray-900/90"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
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
            <a href={blog.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:text-blue-300 inline-flex items-center">
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
      
      {/* COAs Section */}
      <section id="coas" className="py-20 bg-gray-100 scroll-mt-24">
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
      <section id="education" className="py-20 bg-gray-50 scroll-mt-24">
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
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Peptides vs. Proteins: What's the Difference?</h3>
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
                The FDA has approved certain peptides for specific medical uses, such as insulin analogs for diabetes and glucagon-like peptide-1 (GLP-1) agonists for metabolic disorders. However, many peptides available online are considered experimental and are not approved for human use outside of research settings. It's crucial to distinguish between regulated, prescription peptides and those intended solely for laboratory research.
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
      <section id="faq" className="py-20 bg-white scroll-mt-24">
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
                  Only FDA-approved peptides are legal for human use with a prescription. Other peptides are sold for research purposes only and are not intended for human consumption. Always ensure you're purchasing from reputable suppliers who comply with all regulatory requirements.
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

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">About Us</h2>
          <p className="max-w-3xl mx-auto text-center text-white/80 text-sm">
            Incredible Peptides provides research-only peptides with third-party COAs, rigorous quality controls,
            and fast fulfillment from USA facilities. Our products are intended strictly for laboratory research and
            are not for human consumption. If you have questions about documentation or fulfillment, reach out via
            the contact form below.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 scroll-mt-24">
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
      
      {/* Slide Out Cart */}
      <SlideOutCart />
    </>
  );
}
