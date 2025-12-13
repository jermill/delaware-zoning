import { FiStar, FiTrendingUp, FiMapPin, FiZap, FiDatabase } from 'react-icons/fi';
import Image from 'next/image';

const TESTIMONIALS = [
  {
    quote: "Saved me hours of research. I used to spend half a day calling county offices — now I get answers in seconds.",
    author: "Sarah M.",
    role: "Real Estate Agent",
    company: "Wilmington Realty",
    rating: 5,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces",
  },
  {
    quote: "Essential tool for any developer working in Delaware. The zoning data is accurate and the reports are professional.",
    author: "Michael R.",
    role: "Property Developer",
    company: "First State Development",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
  },
  {
    quote: "My clients love that I can answer their zoning questions on the spot during showings. Game changer.",
    author: "Jennifer L.",
    role: "Commercial Broker",
    company: "Delaware Commercial Group",
    rating: 5,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&crop=faces",
  },
];

const TRUSTED_BY = [
  "Real Estate Agents",
  "Property Developers", 
  "Architects",
  "Attorneys",
  "Homeowners",
  "Investors",
];

export default function SocialProof() {
  return (
    <section className="relative bg-delaware-cream py-16 sm:py-20 lg:py-24 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trusted By Bar */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-overline text-[#152F50] mb-6">
            Trusted by Delaware professionals
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {TRUSTED_BY.map((item, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center px-4 py-2 bg-white border border-delaware-sage/30 rounded-full text-sm text-delaware-navy font-medium shadow-subtle hover:shadow-md hover:border-delaware-blue transition-all duration-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonials Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 sm:mb-20">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div 
              key={idx}
              className="card-hover"
            >
              {/* Accent bar on hover */}
              <div className="absolute inset-x-0 top-0 h-1 bg-delaware-gold rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 fill-delaware-gold text-delaware-gold" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-gray-700 mb-6 leading-relaxed text-base">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-delaware-sage/20">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-delaware-sage/20">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-delaware-navy text-sm">{testimonial.author}</p>
                  <p className="text-xs text-gray-600">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row - Mobile First */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-subsection-heading text-delaware-navy mb-2">
              Trusted By Delaware Professionals
            </h3>
            <p className="text-gray-600 text-base">
              Fast, accurate, and comprehensive zoning data
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { 
                icon: FiTrendingUp,
                value: '100+', 
                label: 'Active Users',
                description: 'Professionals using daily',
                iconBg: 'bg-delaware-blue',
                textColor: 'text-delaware-blue'
              },
              { 
                icon: FiDatabase,
                value: '1,062', 
                label: 'Zoning Districts',
                description: 'Covering New Castle & Sussex',
                iconBg: 'bg-delaware-navy',
                textColor: 'text-delaware-navy'
              },
              { 
                icon: FiZap,
                value: 'Less than 2s', 
                label: 'Average Search',
                description: 'Lightning-fast results',
                iconBg: 'bg-delaware-gold',
                textColor: 'text-delaware-gold'
              },
              { 
                icon: FiMapPin,
                value: '24/7', 
                label: 'Always Available',
                description: 'Search anytime, anywhere',
                iconBg: 'bg-delaware-sage',
                textColor: 'text-delaware-sage'
              }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="card-hover text-center group"
                >
                  {/* Icon */}
                  <div className={`icon-container ${stat.iconBg} mx-auto mb-4`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  
                  {/* Value */}
                  <div className={`text-3xl sm:text-4xl font-bold ${stat.textColor} mb-1 whitespace-nowrap`}>
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-sm sm:text-base font-bold text-delaware-navy mb-1">
                    {stat.label}
                  </div>
                  
                  {/* Description */}
                  <div className="text-xs text-gray-600">
                    {stat.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

