import { FiSearch, FiFileText, FiDownload } from 'react-icons/fi';

export default function HowItWorks() {
  const steps = [
    {
      icon: FiSearch,
      number: '1',
      title: 'Enter an Address',
      description: 'Type any Delaware property address into our search bar',
      color: 'bg-delaware-blue',
    },
    {
      icon: FiFileText,
      number: '2',
      title: 'Get Instant Results',
      description: 'See zoning codes, permitted uses, and building requirements',
      color: 'bg-delaware-gold',
    },
    {
      icon: FiDownload,
      number: '3',
      title: 'Save or Export',
      description: 'Download professional PDF reports or save to your dashboard',
      color: 'bg-delaware-sage',
    }
  ];

  return (
    <section className="relative bg-white py-16 sm:py-20 lg:py-24 overflow-hidden">
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-overline text-delaware-gold mb-3">
            Simple Process
          </p>
          <h2 className="text-section-heading text-delaware-navy mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get zoning answers in three simple steps — no phone calls, no waiting
          </p>
        </div>

        {/* Steps - Mobile First Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line - Desktop Only */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-delaware-sage/30 to-transparent z-0">
                  <div className="absolute right-0 w-3 h-3 bg-delaware-gold rounded-full -translate-y-[5px] shadow-md"></div>
                </div>
              )}
              
              <div className="group relative z-10 bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#A8BDBE]/50 hover:-translate-y-2">
                {/* Step Number - Large and prominent */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#A8BDBE] to-[#82B8DE] rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {step.number}
                </div>

                {/* Icon Container - Centered and prominent */}
                <div className="relative mb-6 flex justify-center">
                  <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[#272727] mb-3 group-hover:text-[#152F50] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a 
            href="/signup" 
            className="inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 min-h-touch bg-[#82B8DE] text-white px-6 py-3 sm:px-8 sm:py-4 hover:opacity-90 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Try It Free — 3 Searches Included
          </a>
        </div>
      </div>
    </section>
  );
}
