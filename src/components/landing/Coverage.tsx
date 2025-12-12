import { FiCheckCircle, FiMapPin } from 'react-icons/fi';

export default function Coverage() {
  const counties = [
    'New Castle County',
    'Kent County',
    'Sussex County'
  ];

  const cities = [
    'Wilmington',
    'Dover',
    'Newark'
  ];

  return (
    <section className="bg-gray-50">
      <div className="section-container">
        <div className="text-center mb-12 sm:mb-16 px-4">
          <p className="text-delaware-gold font-semibold text-xs sm:text-sm uppercase tracking-wide mb-3">
            Coverage Area
          </p>
          <h2 className="text-section-heading text-gray-900 mb-4">
            Complete Delaware Coverage
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            All 3 counties and major cities included
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
          {/* Counties */}
          <div className="card-hover group">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-delaware-blue text-white inline-flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FiMapPin className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 group-hover:text-delaware-blue transition-colors duration-300">
                Counties
              </h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {counties.map((county, index) => (
                <li key={index} className="flex items-center text-gray-700 text-base sm:text-lg">
                  <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-delaware-gold mr-2.5 sm:mr-3 flex-shrink-0" />
                  {county}
                </li>
              ))}
            </ul>
          </div>

          {/* Major Cities */}
          <div className="card-hover group">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-delaware-gold text-white inline-flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FiMapPin className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 group-hover:text-delaware-blue transition-colors duration-300">
                Major Cities
              </h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {cities.map((city, index) => (
                <li key={index} className="flex items-center text-gray-700 text-base sm:text-lg">
                  <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-delaware-gold mr-2.5 sm:mr-3 flex-shrink-0" />
                  {city}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

