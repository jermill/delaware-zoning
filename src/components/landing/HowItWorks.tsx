export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Type an address',
      description: 'Enter any Delaware property address'
    },
    {
      number: '2',
      title: 'See what\'s allowed',
      description: 'Get instant zoning info and permitted uses'
    },
    {
      number: '3',
      title: 'Save or share it',
      description: 'Download reports or save for later'
    }
  ];

  return (
    <section className="bg-white">
      <div className="section-container">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 px-4">
          <p className="text-delaware-gold font-semibold text-xs sm:text-sm uppercase tracking-wide mb-3">
            Simple Process
          </p>
          <h2 className="text-section-heading text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to get zoning answers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 max-w-5xl mx-auto px-4">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-delaware-gold via-delaware-gold to-transparent"></div>
              )}
              
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-delaware-gold to-yellow-600 text-white rounded-full text-2xl sm:text-3xl font-bold mb-5 sm:mb-6 shadow-elevated group-hover:scale-110 group-hover:shadow-card-hover transition-all duration-300">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2.5 sm:mb-3 group-hover:text-delaware-blue transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

