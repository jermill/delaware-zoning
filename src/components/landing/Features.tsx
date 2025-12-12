import { FiSearch, FiBookmark, FiDownload } from 'react-icons/fi';

export default function Features() {
  const features = [
    {
      icon: <FiSearch className="w-8 h-8" />,
      title: 'Search Any Address',
      description: 'Type in any Delaware property address and get instant results'
    },
    {
      icon: <FiBookmark className="w-8 h-8" />,
      title: 'Save Your Properties',
      description: 'Keep track of all the properties you\'ve looked up'
    },
    {
      icon: <FiDownload className="w-8 h-8" />,
      title: 'Download Reports',
      description: 'Export professional PDFs to share with clients'
    }
  ];

  return (
    <section className="bg-delaware-blue">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-delaware-gold text-delaware-blue rounded-2xl mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-blue-100 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
