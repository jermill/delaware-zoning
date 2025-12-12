import { FiCheck } from 'react-icons/fi';
import { PricingPlan } from '@/types';

export default function Pricing() {
  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      features: [
        '5 property searches per month',
        'Basic zoning information',
        'Save properties to dashboard'
      ],
      cta: 'Start Free'
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 19,
      period: 'month',
      features: [
        'Search as many properties as you want',
        'Full zoning details',
        'Save unlimited properties',
        'Email support'
      ],
      cta: 'Subscribe Now',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 49,
      period: 'month',
      features: [
        'Everything in Basic',
        'Download PDF reports',
        'Property dimensions and setbacks',
        'Priority support'
      ],
      cta: 'Subscribe Now'
    }
  ];

  return (
    <section className="bg-gray-50">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600">
            Choose the plan that works for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-delaware-gold transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-delaware-gold text-white text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-600 ml-2">
                  /{plan.period}
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheck className="w-5 h-5 text-delaware-gold mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.id === 'free' ? '/signup' : '/signup'}
                className={`block text-center w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-delaware-gold text-white hover:bg-opacity-90'
                    : 'bg-gray-100 text-delaware-blue hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
