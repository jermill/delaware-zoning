import { FiHome, FiTrendingUp, FiTool, FiUsers } from 'react-icons/fi';

export default function UseCases() {
  const useCases = [
    {
      icon: <FiHome className="w-8 h-8" />,
      title: 'Realtors',
      description: 'Answer client questions instantly during property showings'
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: 'Developers',
      description: 'Quickly evaluate properties for potential projects'
    },
    {
      icon: <FiTool className="w-8 h-8" />,
      title: 'Architects',
      description: 'Get building requirements for project planning'
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: 'Property Investors',
      description: 'Research zoning before making purchase decisions'
    }
  ];

  return (
    <section className="bg-delaware-navy relative overflow-hidden">
      <div className="section-container">
        <div className="text-center mb-12 sm:mb-16 px-4">
          <p className="text-overline text-delaware-gold mb-3">
            Our Clients
          </p>
          <h2 className="text-section-heading text-white mb-4">
            Who Uses Delaware Zoning?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Trusted by real estate professionals across Delaware
          </p>
        </div>

        {/* Mobile: 2 col, Desktop: 4 col */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 px-4">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="icon-container bg-white/20 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                {useCase.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {useCase.title}
              </h3>
              <p className="text-sm text-blue-100">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
