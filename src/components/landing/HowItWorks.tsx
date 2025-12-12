import { FiSearch, FiFileText, FiDownload } from 'react-icons/fi';

export default function HowItWorks() {
  const steps = [
    {
      icon: FiSearch,
      number: '1',
      title: 'Enter an Address',
      description: 'Type any Delaware property address into our search bar',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: FiFileText,
      number: '2',
      title: 'Get Instant Results',
      description: 'See zoning codes, permitted uses, and building requirements',
      color: 'from-delaware-gold to-yellow-600',
    },
    {
      icon: FiDownload,
      number: '3',
      title: 'Save or Export',
      description: 'Download professional PDF reports or save to your dashboard',
      color: 'from-green-500 to-green-600',
    }
  ];

  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Get zoning answers in three simple steps — no phone calls, no waiting
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line - Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-300 to-transparent z-0"></div>
              )}
              
              <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 z-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${step.color} text-white rounded-xl mb-4`}>
                  <step.icon className="w-6 h-6" />
                </div>
                
                {/* Step Number */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500">
                  {step.number}
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a 
            href="/signup" 
            className="inline-flex items-center justify-center bg-delaware-blue hover:bg-blue-800 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            Try It Free — 3 Searches Included
          </a>
        </div>
      </div>
    </section>
  );
}
