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
                <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-delaware-sage/30 z-0">
                  <div className="absolute right-0 w-2 h-2 bg-delaware-sage rounded-full -translate-y-[3px]"></div>
                </div>
              )}
              
              <div className="card-hover group relative z-10">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`icon-container-lg ${step.color} mx-auto shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                </div>
                
                {/* Step Number Badge */}
                <div className="absolute top-6 right-6 w-10 h-10 bg-delaware-cream border-2 border-delaware-sage/30 rounded-xl flex items-center justify-center text-base font-bold text-delaware-navy shadow-sm">
                  {step.number}
                </div>
                
                {/* Content */}
                <h3 className="text-card-heading text-delaware-navy mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed text-center">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a 
            href="/signup" 
            className="btn-primary"
          >
            Try It Free — 3 Searches Included
          </a>
        </div>
      </div>
    </section>
  );
}
