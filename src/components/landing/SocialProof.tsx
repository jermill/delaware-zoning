import { FiStar } from 'react-icons/fi';

const TESTIMONIALS = [
  {
    quote: "Saved me hours of research. I used to spend half a day calling county offices — now I get answers in seconds.",
    author: "Sarah M.",
    role: "Real Estate Agent",
    company: "Wilmington Realty",
    rating: 5,
  },
  {
    quote: "Essential tool for any developer working in Delaware. The zoning data is accurate and the reports are professional.",
    author: "Michael R.",
    role: "Property Developer",
    company: "First State Development",
    rating: 5,
  },
  {
    quote: "My clients love that I can answer their zoning questions on the spot during showings. Game changer.",
    author: "Jennifer L.",
    role: "Commercial Broker",
    company: "Delaware Commercial Group",
    rating: 5,
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
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trusted By Bar */}
        <div className="text-center mb-10">
          <p className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-4">
            Trusted by Delaware professionals
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {TRUSTED_BY.map((item, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div 
              key={idx}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-4 h-4 fill-delaware-gold text-delaware-gold" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-delaware-blue to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{testimonial.author}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 py-8 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-delaware-blue">100+</div>
            <div className="text-sm text-gray-600 mt-1">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-delaware-blue">3</div>
            <div className="text-sm text-gray-600 mt-1">Counties Covered</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-delaware-blue">&lt;2s</div>
            <div className="text-sm text-gray-600 mt-1">Search Speed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-delaware-blue">24/7</div>
            <div className="text-sm text-gray-600 mt-1">Availability</div>
          </div>
        </div>
      </div>
    </section>
  );
}
