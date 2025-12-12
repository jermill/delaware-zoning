'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-12 h-12 md:w-14 md:h-14 group-hover:scale-110 transition-transform duration-300">
              <Image 
                src="/logo.png" 
                alt="Delaware Zoning Logo" 
                fill
                className="object-contain mix-blend-multiply"
                style={{ backgroundColor: 'transparent' }}
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-delaware-blue hover:bg-gray-50 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
            >
              Home
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-700 hover:text-delaware-blue hover:bg-gray-50 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
            >
              Pricing
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-delaware-blue hover:bg-gray-50 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
            >
              Contact
            </Link>
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            <Link 
              href="/login" 
              className="text-gray-700 hover:text-delaware-blue hover:bg-gray-50 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="bg-delaware-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-0.5 ml-2"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link 
              href="/signup" 
              className="bg-delaware-blue text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-opacity-90 transition-all duration-300"
            >
              Sign Up
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-delaware-blue p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            <Link 
              href="/" 
              className="block text-gray-700 hover:text-delaware-blue hover:bg-gray-50 px-4 py-3 rounded-lg transition-all duration-300 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/pricing" 
              className="block text-gray-700 hover:text-delaware-blue hover:bg-gray-50 px-4 py-3 rounded-lg transition-all duration-300 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/contact" 
              className="block text-gray-700 hover:text-delaware-blue hover:bg-gray-50 px-4 py-3 rounded-lg transition-all duration-300 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/login" 
              className="block text-gray-700 hover:text-delaware-blue hover:bg-gray-50 px-4 py-3 rounded-lg transition-all duration-300 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </Link>
            <Link 
              href="/dashboard" 
              className="block text-gray-700 hover:text-delaware-blue hover:bg-gray-50 px-4 py-3 rounded-lg transition-all duration-300 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
