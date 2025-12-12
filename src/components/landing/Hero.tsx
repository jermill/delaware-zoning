import { useState } from 'react';
import { useRouter } from 'next/router';
import { FiSearch, FiChevronDown, FiMapPin, FiZap, FiShield } from 'react-icons/fi';
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
    if (!selectedPlace && inputRef.current?.value.trim()) {
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
    router.push(`/search?address=${encodeURIComponent(example.address)}&lat=${example.lat}&lon=${example.lon}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-delaware-blue via-blue-900 to-slate-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-delaware-gold/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-delaware-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm text-white/90 font-medium">Now covering all 3 Delaware counties</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Get Zoning Answers in
              <span className="text-delaware-gold"> Seconds</span>,
              <br className="hidden sm:block" />
              Not Hours
            </h1>

            <p className="text-lg text-blue-100/90 mb-6 max-w-xl mx-auto lg:mx-0">
              Stop digging through county websites. Enter any Delaware address and instantly see zoning codes, permitted uses, and building requirements.
            </p>

            {/* Value Props - Inline */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2 text-white/90">
                <FiZap className="w-4 h-4 text-delaware-gold" />
                <span>Instant results</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <FiShield className="w-4 h-4 text-delaware-gold" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <FiMapPin className="w-4 h-4 text-delaware-gold" />
                <span>3 free searches</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">J</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">M</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">S</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">R</div>
              </div>
              <div className="text-sm text-white/80">
                <span className="font-semibold text-white">100+</span> Delaware professionals trust us
              </div>
            </div>

            {/* CTA Button - Mobile */}
            <div className="lg:hidden mb-6">
              <a 
                href="/signup" 
                className="inline-flex items-center justify-center w-full sm:w-auto bg-delaware-gold hover:bg-yellow-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
              >
                Start Free — No Card Required
              </a>
            </div>
          </div>

          {/* Right Column - Search Card */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Try it now — it's free
                </h2>
                <p className="text-gray-600 text-sm">
                  Enter any Delaware address to see zoning info instantly
                </p>
              </div>

              {/* Search Input */}
              <div className="relative z-30 mb-4">
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={isLoaded ? "Enter address (e.g., 123 Main St, Wilmington)" : "Loading..."}
                    onKeyPress={handleKeyPress}
                    disabled={!isLoaded}
                    className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-delaware-blue focus:ring-2 focus:ring-delaware-blue/20 transition-all disabled:opacity-60"
                  />
                </div>

                {/* Example Addresses Dropdown */}
                {showExamples && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl overflow-hidden z-[100] border border-gray-200">
                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700">Try an example:</p>
                    </div>
                    {EXAMPLE_ADDRESSES.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleExampleSelect(example)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <p className="font-medium text-gray-900 text-sm">{example.label}</p>
                        <p className="text-xs text-gray-500">{example.address}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="w-full bg-delaware-blue hover:bg-blue-800 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FiSearch className="w-5 h-5" />
                Search Zoning Info
              </button>

              {/* Examples Link */}
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="w-full mt-3 text-sm text-gray-500 hover:text-delaware-blue font-medium flex items-center justify-center gap-1 transition-colors"
              >
                <span>Or try an example address</span>
                <FiChevronDown className={`w-4 h-4 transition-transform ${showExamples ? 'rotate-180' : ''}`} />
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Signup CTA */}
              <a 
                href="/signup" 
                className="w-full inline-flex items-center justify-center bg-delaware-gold hover:bg-yellow-500 text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Create Free Account
              </a>
              <p className="text-center text-xs text-gray-500 mt-3">
                Get 3 free searches • No credit card required
              </p>
            </div>

            {/* Floating Stats - Redesigned */}
            <div className="hidden lg:flex absolute -bottom-4 -left-4 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100/50 px-5 py-3.5 items-center gap-3 hover:shadow-2xl transition-all duration-300">
              <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <FiZap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 tracking-tight">&lt;2s</div>
                <div className="text-xs font-medium text-gray-600">Avg. search time</div>
              </div>
            </div>

            <div className="hidden lg:flex absolute -top-4 -right-4 bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100/50 px-5 py-3.5 items-center gap-3 hover:shadow-2xl transition-all duration-300">
              <div className="w-11 h-11 bg-gradient-to-br from-delaware-blue to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <FiMapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 tracking-tight">3</div>
                <div className="text-xs font-medium text-gray-600">Counties covered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
