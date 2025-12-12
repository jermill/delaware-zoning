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
    <section className="bg-delaware-blue">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Who Uses Delaware Zoning?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-delaware-gold text-white rounded-2xl mb-4">
                {useCase.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {useCase.title}
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
