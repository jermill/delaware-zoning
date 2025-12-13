import { useState } from 'react';
import { useRouter } from 'next/router';
import { FiSearch, FiChevronDown, FiMapPin, FiZap, FiShield, FiArrowRight } from 'react-icons/fi';
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

  const { inputRef, isLoaded, selectedPlace } = useGooglePlaces((place) => {
    router.push(
      `/search?address=${encodeURIComponent(place.address)}&lat=${place.latitude}&lon=${place.longitude}`
    );
  });

  const handleSearch = () => {
    const address = inputRef.current?.value.trim();
    
    if (!address) {
      setShowExamples(true);
      return;
    }

    // If a place was selected from autocomplete, use it with coordinates
    if (selectedPlace) {
      router.push(
        `/search?address=${encodeURIComponent(selectedPlace.address)}&lat=${selectedPlace.latitude}&lon=${selectedPlace.longitude}`
      );
      return;
    }

    // Otherwise, allow manual search with just the address
    // The search page will handle geocoding if needed
    router.push(`/search?address=${encodeURIComponent(address)}`);
  };

  const handleExampleSelect = (example: typeof EXAMPLE_ADDRESSES[0]) => {
    if (inputRef.current) {
      inputRef.current.value = example.address;
    }
    setShowExamples(false);
    router.push(`/search?address=${encodeURIComponent(example.address)}&lat=${example.lat}&lon=${example.lon}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative bg-delaware-navy overflow-hidden">
      {/* Background Elements - Subtle only */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-delaware-blue rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-delaware-sage rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile-First Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-12 sm:py-16 lg:py-24">
          
          {/* Left Column - Content (Mobile: Order 1) */}
          <div className="text-center lg:text-left w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-delaware-sage/20 backdrop-blur-sm border border-delaware-sage/40 rounded-full px-4 py-2 mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-semibold text-white">Now covering New Castle & Sussex counties</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Get Zoning Answers in
              <span className="text-delaware-gold"> Seconds</span>,
              <br />
              Not Hours
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Stop digging through county websites. Enter any Delaware address and instantly see zoning codes, permitted uses, and building requirements.
            </p>

            {/* Value Props - Mobile Friendly */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-8">
              <div className="flex items-center gap-2 text-white/90">
                <div className="flex-shrink-0 w-8 h-8 bg-delaware-gold rounded-lg flex items-center justify-center">
                  <FiZap className="w-4 h-4 text-delaware-navy" />
                </div>
                <span className="text-sm sm:text-base font-medium">Instant results</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <div className="flex-shrink-0 w-8 h-8 bg-delaware-gold rounded-lg flex items-center justify-center">
                  <FiShield className="w-4 h-4 text-delaware-navy" />
                </div>
                <span className="text-sm sm:text-base font-medium">No credit card</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <div className="flex-shrink-0 w-8 h-8 bg-delaware-gold rounded-lg flex items-center justify-center">
                  <FiMapPin className="w-4 h-4 text-delaware-navy" />
                </div>
                <span className="text-sm sm:text-base font-medium">3 free searches</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-delaware-blue border-2 border-delaware-navy flex items-center justify-center text-white text-sm font-bold shadow-md">J</div>
                <div className="w-10 h-10 rounded-full bg-delaware-sage border-2 border-delaware-navy flex items-center justify-center text-white text-sm font-bold shadow-md">M</div>
                <div className="w-10 h-10 rounded-full bg-delaware-gold border-2 border-delaware-navy flex items-center justify-center text-delaware-navy text-sm font-bold shadow-md">S</div>
                <div className="w-10 h-10 rounded-full bg-green-500 border-2 border-delaware-navy flex items-center justify-center text-white text-sm font-bold shadow-md">R</div>
              </div>
              <div className="text-sm text-white/90">
                <span className="font-semibold text-white">100+</span> Delaware professionals trust us
              </div>
            </div>

            {/* CTA Button - Mobile */}
            <div className="lg:hidden">
              <a 
                href="/signup" 
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 bg-delaware-gold hover:opacity-90 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Start Free Now
                <FiArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Column - Search Card (Mobile: Order 2) */}
          <div className="w-full lg:w-auto">
            {/* Main Search Card - Enhanced Depth */}
            <div className="bg-white rounded-2xl shadow-floating p-6 sm:p-8 border border-delaware-sage/20">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-delaware-navy mb-2">
                  Get Started for Free!
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Enter any Delaware address to see zoning info instantly
                </p>
              </div>

              {/* Search Input - Touch Friendly */}
              <div className="relative z-30 mb-4">
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-delaware-navy z-10" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={isLoaded ? "123 Main St, Wilmington, DE" : "Loading Google Maps..."}
                    onKeyPress={handleKeyPress}
                    disabled={!isLoaded}
                    className="w-full pl-12 pr-4 py-4 text-base bg-white border-2 border-delaware-sage/30 rounded-xl focus:outline-none focus:border-delaware-blue focus:ring-4 focus:ring-delaware-blue/10 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed placeholder:text-gray-400 shadow-inset-subtle"
                  />
                </div>

                {/* Example Addresses Dropdown */}
                {showExamples && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-floating overflow-hidden z-[100] border border-delaware-sage/20">
                    <div className="p-3 bg-delaware-cream border-b border-delaware-sage/20">
                      <p className="text-sm font-semibold text-delaware-navy">Try an example:</p>
                    </div>
                    {EXAMPLE_ADDRESSES.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleExampleSelect(example)}
                        className="w-full text-left px-4 py-3 hover:bg-delaware-cream transition-colors border-b border-delaware-sage/10 last:border-b-0"
                      >
                        <p className="font-medium text-delaware-navy text-sm">{example.label}</p>
                        <p className="text-xs text-gray-500">{example.address}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button - Touch Friendly */}
              <button 
                onClick={handleSearch}
                disabled={!isLoaded}
                className="w-full bg-delaware-blue hover:opacity-90 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 min-h-touch"
              >
                <FiSearch className="w-5 h-5" />
                Search Zoning Info
              </button>

              {/* Examples Link */}
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="w-full mt-3 text-sm text-gray-500 hover:text-delaware-blue font-medium flex items-center justify-center gap-1 transition-colors min-h-touch"
              >
                <span>Or try an example address</span>
                <FiChevronDown className={`w-4 h-4 transition-transform ${showExamples ? 'rotate-180' : ''}`} />
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-delaware-sage/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Signup CTA */}
              <a 
                href="/signup" 
                className="w-full inline-flex items-center justify-center bg-delaware-gold hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 min-h-touch"
              >
                Create Free Account
              </a>
              <p className="text-center text-xs sm:text-sm text-gray-500 mt-3">
                Get 3 free searches • No credit card required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
