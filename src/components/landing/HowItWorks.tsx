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
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Three simple steps to get zoning answers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-delaware-gold text-white rounded-full text-3xl font-bold mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
