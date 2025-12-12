import { FiCheck, FiStar } from 'react-icons/fi';
import { PricingPlan } from '@/types';

export default function Pricing() {
  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'The Looker',
      price: 0,
      period: 'forever',
      features: [
        '3 property searches per month',
        'Basic zoning information',
        'Save properties to dashboard',
        'Perfect for trying it out'
      ],
      cta: 'Start Free'
    },
    {
      id: 'pro',
      name: 'The Pro',
      price: 49,
      period: 'month',
      features: [
        'Unlimited property searches',
        'Full zoning details & permitted uses',
        'Save unlimited properties',
        'Look smart in front of clients',
        'Email support'
      ],
      cta: 'Get Started',
      popular: true
    },
    {
      id: 'whale',
      name: 'The Whale',
      price: 129,
      period: 'month',
      features: [
        'Everything in The Pro',
        'Professional PDF reports',
        'Property dimensions & setbacks',
        'Building requirements',
        'Priority support',
        'Perfect for developers & architects'
      ],
      cta: 'Go Whale'
    }
  ];

  return (
    <section className="bg-white">
      <div className="section-container">
        <div className="text-center mb-12 sm:mb-16 px-4">
          <p className="text-delaware-gold font-semibold text-xs sm:text-sm uppercase tracking-wide mb-3">
            Pricing Plans
          </p>
          <h2 className="text-section-heading text-gray-900 mb-4">
            Cheaper Than One Hour of Your Time
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Stop calling the county planning office. Get instant answers and look like the expert your clients expect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
                plan.popular 
                  ? 'shadow-card-hover border-2 border-delaware-gold md:scale-105' 
                  : 'shadow-card hover:shadow-card-hover border-2 border-gray-100 hover:border-delaware-gold/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-delaware-gold to-yellow-600 text-white text-xs sm:text-sm font-semibold px-4 sm:px-6 py-1.5 sm:py-2 rounded-full inline-flex items-center gap-2 shadow-elevated">
                    <FiStar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mt-3 sm:mt-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 text-base sm:text-lg">
                      /{plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5 sm:gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-delaware-gold/10 flex items-center justify-center mt-0.5">
                        <FiCheck className="w-3.5 h-3.5 text-delaware-gold" />
                      </div>
                      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.id === 'free' ? '/signup' : '/signup'}
                  className={`block text-center w-full py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-delaware-gold to-yellow-600 text-white hover:shadow-elevated transform hover:-translate-y-0.5'
                      : 'bg-delaware-blue text-white hover:bg-opacity-90 hover:shadow-elevated transform hover:-translate-y-0.5'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Options */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto px-4">
          <div className="bg-blue-50 border-2 border-delaware-blue/20 rounded-xl sm:rounded-2xl p-6 sm:p-8">
            <div className="text-center mb-5 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Other Options
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Single Report */}
              <div className="bg-white rounded-lg sm:rounded-xl p-5 sm:p-6 shadow-card">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Single Report
                </h4>
                <div className="text-2xl sm:text-3xl font-bold text-delaware-blue mb-3">
                  $39 <span className="text-sm sm:text-base font-normal text-gray-600">one-time</span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Need info for just one property? Buy a professional PDF report without subscribing.
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-delaware-gold mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Full zoning report PDF
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-delaware-gold mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    No subscription required
                  </li>
                </ul>
              </div>

              {/* Brokerage/Team */}
              <div className="bg-white rounded-lg sm:rounded-xl p-5 sm:p-6 shadow-card">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  Brokerage/Team Plan
                </h4>
                <div className="text-2xl sm:text-3xl font-bold text-delaware-blue mb-3">
                  Custom
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Unlimited access for your entire office. Centralized billing and team management.
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-gray-700 mb-4">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-delaware-gold mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    $15-20 per agent
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-delaware-gold mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Recruit & retain talent
                  </li>
                </ul>
                <a href="/contact" className="text-sm sm:text-base text-delaware-blue font-semibold hover:text-delaware-gold transition-colors">
                  Contact Sales →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Info */}
        <div className="text-center mt-10 sm:mt-12 text-gray-600 px-4">
          <p className="text-xs sm:text-sm">Cancel anytime from your dashboard.</p>
        </div>
      </div>
    </section>
  );
}
