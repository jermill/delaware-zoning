'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-subtle sticky top-0 z-50 border-b border-delaware-sage/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-12 h-12 md:w-14 md:h-14 group-hover:scale-110 transition-transform duration-300 rounded-lg overflow-hidden">
              <Image 
                src="/logo.png" 
                alt="Delaware Zoning Logo" 
                width={56}
                height={56}
                className="object-contain mix-blend-multiply"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link 
              href="/" 
              className="text-delaware-navy hover:text-delaware-blue hover:bg-delaware-cream px-4 py-2 rounded-xl transition-all duration-300 font-semibold"
            >
              Home
            </Link>
            <Link 
              href="/pricing" 
              className="text-delaware-navy hover:text-delaware-blue hover:bg-delaware-cream px-4 py-2 rounded-xl transition-all duration-300 font-semibold"
            >
              Pricing
            </Link>
            <Link 
              href="/contact" 
              className="text-delaware-navy hover:text-delaware-blue hover:bg-delaware-cream px-4 py-2 rounded-xl transition-all duration-300 font-semibold"
            >
              Contact
            </Link>
            <div className="w-px h-6 bg-delaware-sage/30 mx-2"></div>
            <Link 
              href="/login" 
              className="text-delaware-navy hover:text-delaware-blue hover:bg-delaware-cream px-4 py-2 rounded-xl transition-all duration-300 font-semibold"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="bg-delaware-gold text-delaware-navy px-6 py-3 rounded-xl font-bold hover:opacity-90 hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button & CTA */}
          <div className="md:hidden flex items-center gap-3">
            <Link 
              href="/signup" 
              className="bg-delaware-gold text-delaware-navy px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all duration-300"
            >
              Sign Up
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-delaware-navy hover:text-delaware-blue p-2 rounded-lg hover:bg-delaware-cream transition-all min-h-touch min-w-touch flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-delaware-navy/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            
            {/* Menu */}
            <div className="fixed right-0 top-16 bottom-0 w-64 bg-white shadow-floating z-50 md:hidden animate-slide-in-right border-l border-delaware-sage/20">
              <nav className="p-4 space-y-2">
                <Link 
                  href="/" 
                  className="block text-delaware-navy hover:text-delaware-blue hover:bg-delaware-cream px-4 py-3 rounded-xl transition-all duration-300 font-semibold min-h-touch"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/pricing" 
                  className="block text-delaware-navy hover:text-delaware-blue hover:bg-delaware-cream px-4 py-3 rounded-xl transition-all duration-300 font-semibold min-h-touch"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link 
                  href="/contact" 
                  className="block text-delaware-navy hover:text-delaware-blue hover:bg-delaware-cream px-4 py-3 rounded-xl transition-all duration-300 font-semibold min-h-touch"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="h-px bg-delaware-sage/20 my-4"></div>
                <Link 
                  href="/login" 
                  className="block text-delaware-navy hover:text-delaware-blue hover:bg-delaware-cream px-4 py-3 rounded-xl transition-all duration-300 font-semibold min-h-touch"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  href="/signup" 
                  className="block bg-delaware-gold text-delaware-navy px-4 py-3 rounded-xl font-bold hover:opacity-90 transition-all duration-300 text-center min-h-touch"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </nav>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
