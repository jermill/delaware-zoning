import { FiSearch } from 'react-icons/fi';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-delaware-blue via-blue-900 to-delaware-blue overflow-hidden">
      {/* Background Pattern/Texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-delaware-blue/50 to-delaware-blue/80" />

      <div className="section-container relative z-10 text-center py-12 sm:py-16 md:py-20 lg:py-30">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-fade-in px-4">
          See What You Can Build on Any Delaware Property
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
          Instant zoning answers for 
          <span className="text-delaware-gold font-semibold"> real estate professionals</span>. 
          Get comprehensive zoning data, permitted uses, and building requirements in seconds.
        </p>

        {/* Search Bar (Enhanced) */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-10 px-4">
          <div className="relative flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Enter a Delaware property address..."
              className="w-full px-4 sm:px-6 py-4 sm:py-5 text-base sm:text-lg border-2 border-white/20 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl focus:outline-none focus:border-delaware-gold focus:ring-4 focus:ring-delaware-gold/20 transition-all shadow-elevated"
              disabled
            />
            <button className="sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 bg-delaware-gold text-white px-6 sm:px-8 py-3 sm:py-3 rounded-xl hover:bg-opacity-90 hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 font-semibold whitespace-nowrap">
              <FiSearch className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-blue-200 mt-3 sm:mt-4">
            Example: "123 Market Street, Wilmington, DE"
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
          <a href="/signup" className="w-full sm:w-auto bg-delaware-gold text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-opacity-90 hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-0.5 text-center shadow-elevated">
            Get Started Free
          </a>
          <a href="/pricing" className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-white/20 transition-all duration-300 text-center">
            View Pricing
          </a>
        </div>

        <p className="text-sm sm:text-base text-blue-200 mb-12 sm:mb-16 px-4">
          3 free searches • No credit card needed
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto mt-12 sm:mt-16 md:mt-20 pt-8 sm:pt-12 md:pt-16 border-t border-white/10 px-4">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-delaware-gold mb-2">3</div>
            <div className="text-sm sm:text-base text-blue-100">Counties Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-delaware-gold mb-2">100+</div>
            <div className="text-sm sm:text-base text-blue-100">Trusted Professionals</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-delaware-gold mb-2">&lt;2s</div>
            <div className="text-sm sm:text-base text-blue-100">Average Search Time</div>
          </div>
        </div>
      </div>
    </section>
  );
}
