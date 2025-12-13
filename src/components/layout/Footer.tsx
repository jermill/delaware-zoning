import Link from 'next/link';
import Image from 'next/image';
import { FooterDataDisclaimer } from '@/components/common/DataDisclaimerBanner';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#272727] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2">
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              <div className="relative w-14 h-14 flex-shrink-0 rounded-md p-2">
                <Image 
                  src="/images/logo.png" 
                  alt="Delaware Zoning Logo" 
                  width={56}
                  height={56}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <p className="text-gray-300 text-sm sm:text-base max-w-md leading-relaxed">
                  Instant zoning answers for Delaware real estate professionals. We provide tailored solutions, guiding you through every step.
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="w-10 h-10 bg-delaware-blue/20 rounded-lg flex items-center justify-center hover:bg-delaware-gold transition-all duration-300 hover:scale-110">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-delaware-blue/20 rounded-lg flex items-center justify-center hover:bg-delaware-gold transition-all duration-300 hover:scale-110">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-3 sm:mb-4 text-base sm:text-lg">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/pricing" className="text-sm sm:text-base text-gray-400 hover:text-delaware-gold transition-colors duration-300">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm sm:text-base text-gray-400 hover:text-delaware-gold transition-colors duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm sm:text-base text-gray-400 hover:text-delaware-gold transition-colors duration-300">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-3 sm:mb-4 text-base sm:text-lg">Legal</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/privacy" className="text-sm sm:text-base text-gray-400 hover:text-delaware-gold transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm sm:text-base text-gray-400 hover:text-delaware-gold transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/data-disclaimer" className="text-sm sm:text-base text-amber-400 hover:text-amber-300 transition-colors duration-300 font-medium">
                  ⚠️ Data Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 sm:pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              © {currentYear} Delaware Zoning LLC. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 text-xs sm:text-sm text-gray-400">
              <a href="mailto:support@delawarezoning.com" className="hover:text-delaware-gold transition-colors">
                support@delawarezoning.com
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Development Data Warning - Sticky to bottom of footer */}
      <FooterDataDisclaimer />
    </footer>
  );
}

