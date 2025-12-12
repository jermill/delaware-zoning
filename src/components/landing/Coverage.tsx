import { FiCheckCircle } from 'react-icons/fi';

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
    <section className="bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Complete Delaware Coverage
          </h2>
          <p className="text-xl text-gray-600">
            All 3 counties and major cities included
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Counties */}
          <div className="bg-gray-50 rounded-xl p-8 border-2 border-delaware-gold/20">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Counties
            </h3>
            <ul className="space-y-3">
              {counties.map((county, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <FiCheckCircle className="w-5 h-5 text-delaware-gold mr-3" />
                  {county}
                </li>
              ))}
            </ul>
          </div>

          {/* Major Cities */}
          <div className="bg-gray-50 rounded-xl p-8 border-2 border-delaware-gold/20">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Major Cities
            </h3>
            <ul className="space-y-3">
              {cities.map((city, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <FiCheckCircle className="w-5 h-5 text-delaware-gold mr-3" />
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
