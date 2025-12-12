export default function FAQ() {
  const faqs = [
    {
      question: 'Where does the data come from?',
      answer: 'All zoning data comes directly from Delaware county and city records.'
    },
    {
      question: 'How much does it cost?',
      answer: 'We offer a free plan with 5 searches per month. Paid plans start at $19/month for unlimited searches.'
    },
    {
      question: 'Can I export reports?',
      answer: 'Yes! Pro plan subscribers ($49/month) can download professional PDF reports for any property.'
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
    <section className="bg-white">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 border-l-4 border-delaware-gold"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
