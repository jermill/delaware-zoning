import { FiHelpCircle } from 'react-icons/fi';

export default function FAQ() {
  const faqs = [
    {
      question: 'Where does the data come from?',
      answer: 'All zoning data comes directly from Delaware county and city records.'
    },
    {
      question: 'How much does it cost?',
      answer: 'We offer a free plan with 3 searches per month. Paid plans start at $49/month for unlimited searches.'
    },
    {
      question: 'Can I export reports?',
      answer: 'Yes! Whale plan subscribers ($129/month) can download professional PDF reports for any property.'
    },
    {
      question: 'Which counties are covered?',
      answer: 'We cover all of Delaware: New Castle, Kent, and Sussex counties, plus major cities like Wilmington, Dover, and Newark.'
    },
    {
      question: 'How accurate is the information?',
      answer: 'We source data directly from official county records and update regularly. However, always verify with the local zoning office for final decisions.'
    }
  ];

  return (
    <section className="bg-delaware-gold">
      <div className="section-container">
        <div className="text-center mb-12 sm:mb-16 px-4">
          <p className="text-delaware-blue font-semibold text-xs sm:text-sm uppercase tracking-wide mb-3">
            Help Center
          </p>
          <h2 className="text-section-heading text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Everything you need to know about Delaware Zoning
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-card hover:shadow-card-hover transition-all duration-300 group"
            >
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-delaware-blue/10 flex items-center justify-center group-hover:bg-delaware-blue/20 transition-colors duration-300">
                    <FiHelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-delaware-blue" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-delaware-blue transition-colors duration-300">
                    {faq.question}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-10 sm:mt-12 px-4">
          <p className="text-sm sm:text-base text-white/90 mb-4">
            Still have questions? We're here to help.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 text-sm sm:text-base text-delaware-blue font-semibold hover:text-white transition-colors duration-300"
          >
            Contact Support
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
