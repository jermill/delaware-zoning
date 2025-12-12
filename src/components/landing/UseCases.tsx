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
    <section className="bg-gradient-to-br from-delaware-blue via-blue-900 to-delaware-blue relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="section-container relative z-10">
        <div className="text-center mb-12 sm:mb-16 px-4">
          <p className="text-delaware-gold font-semibold text-xs sm:text-sm uppercase tracking-wide mb-3">
            Our Clients
          </p>
          <h2 className="text-section-heading text-white mb-4">
            Who Uses Delaware Zoning?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Trusted by real estate professionals across Delaware
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="card-glass text-center group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-delaware-gold text-white inline-flex items-center justify-center mx-auto mb-5 sm:mb-6 group-hover:scale-110 group-hover:shadow-elevated transition-all duration-300">
                <div className="w-7 h-7 sm:w-8 sm:h-8">{useCase.icon}</div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2.5 sm:mb-3">
                {useCase.title}
              </h3>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

