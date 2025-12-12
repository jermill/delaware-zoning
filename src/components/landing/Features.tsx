import { FiSearch, FiBookmark, FiDownload } from 'react-icons/fi';

export default function Features() {
  const features = [
    {
      icon: <FiSearch className="w-8 h-8" />,
      title: 'Search Any Address',
      description: 'Type in any Delaware property address and get instant results',
      number: '01'
    },
    {
      icon: <FiBookmark className="w-8 h-8" />,
      title: 'Save Your Properties',
      description: 'Keep track of all the properties you\'ve looked up',
      number: '02'
    },
    {
      icon: <FiDownload className="w-8 h-8" />,
      title: 'Download Reports',
      description: 'Export professional PDFs to share with clients',
      number: '03'
    }
  ];

  return (
    <section className="bg-gray-50">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 px-4">
          <p className="text-delaware-gold font-semibold text-xs sm:text-sm uppercase tracking-wide mb-3">
            What We Offer
          </p>
          <h2 className="text-section-heading text-gray-900 mb-4">
            Comprehensive Real Estate Solutions
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Our comprehensive services encompass property searches, data management, and professional reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card-hover text-center group"
            >
              <div className="relative mb-5 sm:mb-6">
                <div className="absolute top-0 right-4 sm:right-6 text-5xl sm:text-6xl font-bold text-gray-100 group-hover:text-delaware-gold/10 transition-colors duration-300">
                  {feature.number}
                </div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-delaware-gold text-white inline-flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <div className="w-7 h-7 sm:w-8 sm:h-8">{feature.icon}</div>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2.5 sm:mb-3 group-hover:text-delaware-blue transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

