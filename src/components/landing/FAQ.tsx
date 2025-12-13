import { FiDatabase, FiDollarSign, FiDownload, FiMapPin, FiCheckCircle } from 'react-icons/fi';

export default function FAQ() {
  const faqs = [
    {
      question: 'Where does the data come from?',
      answer: 'All zoning data comes directly from Delaware county and city records.',
      icon: FiDatabase,
      iconColor: 'text-delaware-blue',
      iconBg: 'bg-delaware-blue/10'
    },
    {
      question: 'How much does it cost?',
      answer: 'We offer a free plan with 3 searches per month. Paid plans start at $49/month for unlimited searches.',
      icon: FiDollarSign,
      iconColor: 'text-delaware-gold',
      iconBg: 'bg-delaware-gold/10'
    },
    {
      question: 'Can I export reports?',
      answer: 'Yes! Whale plan subscribers ($129/month) can download professional PDF reports for any property.',
      icon: FiDownload,
      iconColor: 'text-delaware-sage',
      iconBg: 'bg-delaware-sage/10'
    },
    {
      question: 'Which counties are covered?',
      answer: 'Currently covering New Castle and Sussex counties with 1,062 zoning districts. Kent County integration coming soon!',
      icon: FiMapPin,
      iconColor: 'text-delaware-navy',
      iconBg: 'bg-delaware-navy/10'
    },
    {
      question: 'How accurate is the information?',
      answer: 'We source data directly from official county records and update regularly. However, always verify with the local zoning office for final decisions.',
      icon: FiCheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50'
    }
  ];

  return (
    <section className="bg-delaware-cream">
      <div className="section-container">
        <div className="text-center mb-12 sm:mb-16 px-4">
          <p className="text-overline text-delaware-gold mb-3">
            Help Center
          </p>
          <h2 className="text-section-heading text-delaware-navy mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Delaware Zoning
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 px-4">
          {faqs.map((faq, index) => {
            const Icon = faq.icon;
            return (
              <div
                key={index}
                className="card-hover"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className={`icon-container ${faq.iconBg} group-hover:opacity-80 transition-all duration-300`}>
                      <Icon className={`w-6 h-6 ${faq.iconColor}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-delaware-navy mb-3 group-hover:text-delaware-blue transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12 px-4">
          <p className="text-base text-gray-600 mb-4">
            Still have questions? We're here to help.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 text-base text-delaware-blue font-bold hover:text-delaware-gold transition-colors duration-300"
          >
            Contact Support
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

