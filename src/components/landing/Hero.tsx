import { useState } from 'react';
import { useRouter } from 'next/router';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import { useGooglePlaces } from '@/hooks/useGooglePlaces';

const EXAMPLE_ADDRESSES = [
  { label: 'Wilmington Public Library', address: '10 E 10th St, Wilmington, DE 19801', lat: 39.7459, lon: -75.5466 },
  { label: 'Christiana Mall', address: '132 Christiana Mall, Newark, DE 19702', lat: 39.6776, lon: -75.6514 },
  { label: 'Dover State Capitol', address: '411 Legislative Ave, Dover, DE 19901', lat: 39.1582, lon: -75.5244 },
  { label: 'Rehoboth Beach Town Hall', address: '229 Rehoboth Ave, Rehoboth Beach, DE 19971', lat: 38.7209, lon: -75.0760 },
];

export default function Hero() {
  const router = useRouter();
  const [showExamples, setShowExamples] = useState(false);

  // Google Places Autocomplete
  const { inputRef, isLoaded, selectedPlace } = useGooglePlaces((place) => {
    // Navigate to search page with geocoded coordinates
    router.push(
      `/search?address=${encodeURIComponent(place.address)}&lat=${place.latitude}&lon=${place.longitude}`
    );
  });

  const handleSearch = () => {
    // If Google Places is loaded and user selected a place, it's already handled
    // If not, show examples
    if (!selectedPlace && inputRef.current?.value.trim()) {
      // Manual entry without autocomplete selection
      alert('Please select an address from the autocomplete suggestions');
      return;
    }
    
    if (!inputRef.current?.value.trim()) {
      setShowExamples(true);
    }
  };

  const handleExampleSelect = (example: typeof EXAMPLE_ADDRESSES[0]) => {
    if (inputRef.current) {
      inputRef.current.value = example.address;
    }
    setShowExamples(false);
    // Navigate with coordinates for immediate results
    router.push(`/search?address=${encodeURIComponent(example.address)}&lat=${example.lat}&lon=${example.lon}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-delaware-blue via-blue-900 to-delaware-blue">
      {/* Background Pattern/Texture */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-delaware-blue/50 to-delaware-blue/80 overflow-hidden" />

      <div className="section-container relative z-10 text-center py-8 sm:py-10 md:py-12 lg:py-16">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-fade-in px-4">
          See What You Can Build on Any Delaware Property
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-7 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
          Instant zoning answers for 
          <span className="text-delaware-gold font-semibold"> real estate professionals</span>. 
          Get comprehensive zoning data, permitted uses, and building requirements in seconds.
        </p>

        {/* Search Bar (Enhanced) */}
        <div className="max-w-3xl mx-auto mb-8 sm:mb-10 px-4">
          <div className="relative z-30">
            <div className="relative flex flex-col sm:flex-row gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder={isLoaded ? "Enter a Delaware property address..." : "Loading address search..."}
                onKeyPress={handleKeyPress}
                disabled={!isLoaded}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 text-base sm:text-lg border-2 border-white/20 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl focus:outline-none focus:border-delaware-gold focus:ring-4 focus:ring-delaware-gold/20 transition-all shadow-elevated disabled:opacity-60"
              />
              <button 
                onClick={handleSearch}
                className="sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 bg-delaware-gold text-white px-6 sm:px-8 py-3 sm:py-3 rounded-xl hover:bg-opacity-90 hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 font-semibold whitespace-nowrap"
              >
                <FiSearch className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>

            {/* Example Addresses Dropdown */}
            {showExamples && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl overflow-hidden z-[100] border border-gray-200">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">Try these example addresses:</p>
                </div>
                {EXAMPLE_ADDRESSES.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleSelect(example)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <p className="font-medium text-gray-900 text-sm">{example.label}</p>
                    <p className="text-xs text-gray-600">{example.address}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
            <p className="text-xs sm:text-sm text-blue-200">
              Example: "123 Market Street, Wilmington, DE"
            </p>
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="text-xs sm:text-sm text-delaware-gold hover:text-yellow-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>See examples</span>
              <FiChevronDown className={`w-3 h-3 transition-transform ${showExamples ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
          <a href="/signup" className="w-full sm:w-auto bg-delaware-gold text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-opacity-90 hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-0.5 text-center shadow-elevated">
            Get Started Free
          </a>
          <a href="/pricing" className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-white/20 transition-all duration-300 text-center">
            View Pricing
          </a>
        </div>

        <p className="text-sm sm:text-base text-blue-200 mb-8 sm:mb-10 px-4">
          3 free searches • No credit card needed
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 md:pt-10 border-t border-white/10 px-4">
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

