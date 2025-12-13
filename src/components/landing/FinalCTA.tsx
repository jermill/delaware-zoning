import { FiArrowRight, FiCheck } from 'react-icons/fi';

export default function FinalCTA() {
  return (
    <section className="bg-delaware-navy relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          Ready to Save Hours on Every Deal?
        </h2>
        
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Join 100+ Delaware professionals who get instant zoning answers. Start free today.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-delaware-gold hover:opacity-90 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Start Free Now
            <FiArrowRight className="w-5 h-5" />
          </a>
          <a
            href="/pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-delaware-sage text-delaware-navy border border-delaware-blue/30 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-opacity-90 transition-all duration-200"
          >
            View Pricing
          </a>
        </div>
        
        {/* Trust Elements */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
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
