import { FiSearch } from 'react-icons/fi';

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="section-container text-center">
        {/* Main Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          See What You Can Build on Any{' '}
          <span className="text-delaware-blue">Delaware Property</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Instant zoning answers for real estate professionals
        </p>

        {/* Search Bar (Non-functional placeholder) */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter property address..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-delaware-blue transition-colors"
              disabled
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-delaware-blue text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-all flex items-center space-x-2">
              <FiSearch className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Try an address like "123 Market Street, Wilmington, DE"
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/signup" className="btn-primary text-lg px-8 py-4">
            Get Started Free
          </a>
          <p className="text-sm text-gray-600">
            5 free searches • No credit card needed
          </p>
        </div>

        {/* Social Proof */}
        <div className="mt-16">
          <p className="text-gray-600 font-medium">
            Trusted by 100+ Delaware realtors and developers
          </p>
        </div>
      </div>
    </section>
  );
}
