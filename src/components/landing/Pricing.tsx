import { useState } from 'react';
import { useRouter } from 'next/router';
import { FiCheck, FiStar, FiLoader } from 'react-icons/fi';
import { PricingPlan } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function Pricing() {
  const router = useRouter();
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Stripe Price IDs (these are not sensitive - they're visible in checkout URLs)
  const stripePrices = {
    looker: process.env.STRIPE_PRICE_LOOKER || '',
    pro: process.env.STRIPE_PRICE_PRO || '',
    whale: process.env.STRIPE_PRICE_WHALE || '',
  };

  const handleSubscribe = async (planId: string, tier: 'looker' | 'pro' | 'whale') => {
    // Check if user is logged in
    if (!user) {
      // Redirect to signup with plan in query
      router.push(`/signup?plan=${planId}`);
      return;
    }

    // Free tier - just redirect to dashboard
    if (tier === 'looker') {
      router.push('/dashboard');
      return;
    }

    // Paid tiers - create Stripe checkout session
    setLoadingPlan(planId);

    try {
      const priceId = tier === 'pro' ? stripePrices.pro : stripePrices.whale;

      if (!priceId) {
        alert('Stripe configuration error. Please contact support.');
        return;
      }

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          userEmail: user.email,
          tier,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      alert(error.message || 'Failed to start checkout. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

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
          <p className="text-overline text-delaware-gold mb-3">
            Pricing Plans
          </p>
          <h2 className="text-section-heading text-delaware-navy mb-4">
            Cheaper Than One Hour of Your Time
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stop calling the county planning office. Get instant answers and look like the expert your clients expect.
          </p>
        </div>

        {/* Mobile: 1 col, Tablet: 2 col, Desktop: 3 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto px-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-6 sm:p-8 transition-all duration-300 border-2 ${
                plan.popular 
                  ? 'shadow-elevated border-delaware-gold lg:scale-105' 
                  : 'shadow-md hover:shadow-lg border-delaware-sage/20 hover:border-delaware-blue/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-delaware-gold text-white text-xs sm:text-sm font-semibold px-4 sm:px-6 py-1.5 sm:py-2 rounded-full inline-flex items-center gap-2 shadow-elevated">
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

                <button
                  onClick={() => handleSubscribe(
                    plan.id, 
                    plan.id === 'free' ? 'looker' : plan.id === 'pro' ? 'pro' : 'whale'
                  )}
                  disabled={loadingPlan === plan.id}
                  className={`block text-center w-full py-4 rounded-xl text-base font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 min-h-touch ${
                    plan.popular
                      ? 'bg-delaware-gold text-delaware-navy hover:opacity-90'
                      : 'bg-delaware-blue text-white hover:opacity-90'
                  }`}
                >
                  {loadingPlan === plan.id ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Options */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto px-4">
          <div className="bg-delaware-sage rounded-2xl p-6 sm:p-8 shadow-md">
            <div className="text-center mb-6">
              <h3 className="text-card-heading text-delaware-navy mb-2">
                Other Options
              </h3>
            </div>
            
            {/* Mobile: 1 col, Tablet/Desktop: 2 col */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Single Report */}
              <div className="card-elevated">
                <h4 className="text-lg font-bold text-delaware-navy mb-2">
                  Single Report
                </h4>
                <div className="text-3xl font-bold text-delaware-blue mb-3">
                  $39 <span className="text-base font-normal text-gray-600">one-time</span>
                </div>
                <p className="text-base text-gray-600 mb-4">
                  Need info for just one property? Buy a professional PDF report without subscribing.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <FiCheck className="w-4 h-4 text-delaware-gold flex-shrink-0" />
                    <span>Full zoning report PDF</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="w-4 h-4 text-delaware-gold flex-shrink-0" />
                    <span>No subscription required</span>
                  </li>
                </ul>
              </div>

              {/* Brokerage/Team */}
              <div className="card-elevated">
                <h4 className="text-lg font-bold text-delaware-navy mb-2">
                  Brokerage/Team Plan
                </h4>
                <div className="text-3xl font-bold text-delaware-blue mb-3">
                  Custom
                </div>
                <p className="text-base text-gray-600 mb-4">
                  Unlimited access for your entire office. Centralized billing and team management.
                </p>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li className="flex items-center gap-2">
                    <FiCheck className="w-4 h-4 text-delaware-gold flex-shrink-0" />
                    <span>$15-20 per agent</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheck className="w-4 h-4 text-delaware-gold flex-shrink-0" />
                    <span>Recruit & retain talent</span>
                  </li>
                </ul>
                <a href="/contact" className="text-base text-delaware-blue font-bold hover:text-delaware-gold transition-colors">
                  Contact Sales →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Info */}
        <div className="text-center mt-10 sm:mt-12 text-gray-600 px-4">
          <p className="text-sm">Cancel anytime from your dashboard.</p>
        </div>
      </div>
    </section>
  );
}

