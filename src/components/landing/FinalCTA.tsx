import { FiArrowRight, FiCheck } from 'react-icons/fi';

export default function FinalCTA() {
  return (
    <section className="bg-gradient-to-br from-delaware-blue via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-delaware-gold/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          Ready to Save Hours on Every Deal?
        </h2>
        
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Join 100+ Delaware professionals who get instant zoning answers. Start free today.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-delaware-gold hover:bg-yellow-500 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Free Now
            <FiArrowRight className="w-5 h-5" />
          </a>
          <a
            href="/pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-200"
          >
            View Pricing
          </a>
        </div>
        
        {/* Trust Elements */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-blue-200">
          <div className="flex items-center gap-2">
            <FiCheck className="w-4 h-4 text-delaware-gold" />
            <span>3 free searches</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheck className="w-4 h-4 text-delaware-gold" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheck className="w-4 h-4 text-delaware-gold" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
