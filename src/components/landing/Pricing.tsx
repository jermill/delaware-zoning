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
    looker: process.env.NEXT_PUBLIC_STRIPE_PRICE_LOOKER || '',
    pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || '',
    whale: process.env.NEXT_PUBLIC_STRIPE_PRICE_WHALE || '',
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
          returnUrl: window.location.href, // Pass current URL to know where user came from
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
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#A8BDBE]/10 flex items-center justify-center mt-0.5">
                        <FiCheck className="w-3.5 h-3.5 text-[#A8BDBE]" />
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
                      ? 'bg-delaware-gold text-white hover:opacity-90'
                      : 'bg-[#82B8DE] text-white hover:opacity-90'
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

        {/* Additional Options - Redesigned */}
        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-8">
            <p className="text-overline text-delaware-gold mb-3">
              Flexible Solutions
            </p>
            <h3 className="text-subsection-heading text-delaware-navy mb-3">
              Other Options
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Need something different? We've got you covered.
            </p>
          </div>

          {/* Cards Container with Background */}
          <div className="bg-gradient-to-br from-delaware-sage/30 via-delaware-sage/20 to-delaware-blue/10 rounded-3xl p-6 sm:p-10 border border-delaware-sage/40 shadow-lg">
            {/* Mobile: 1 col, Tablet/Desktop: 2 col */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Single Report Card */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-delaware-sage/20 hover:border-delaware-blue/40 hover:-translate-y-1">
                {/* Icon Badge */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-delaware-gold rounded-2xl shadow-lg flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                <h4 className="text-xl font-bold text-delaware-navy mb-3">
                  Single Report
                </h4>
                
                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-delaware-blue">$39</span>
                    <span className="text-lg text-gray-500">one-time</span>
                  </div>
                </div>

                <p className="text-base text-gray-600 mb-5 leading-relaxed">
                  Need info for just one property? Buy a professional PDF report without subscribing.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-[#A8BDBE]/10 rounded-full flex items-center justify-center mt-0.5">
                      <FiCheck className="w-3 h-3 text-[#A8BDBE] font-bold" />
                    </div>
                    <span className="text-sm text-gray-700">Full zoning report PDF</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-[#A8BDBE]/10 rounded-full flex items-center justify-center mt-0.5">
                      <FiCheck className="w-3 h-3 text-[#A8BDBE] font-bold" />
                    </div>
                    <span className="text-sm text-gray-700">No subscription required</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-[#A8BDBE]/10 rounded-full flex items-center justify-center mt-0.5">
                      <FiCheck className="w-3 h-3 text-[#A8BDBE] font-bold" />
                    </div>
                    <span className="text-sm text-gray-700">Instant download</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <button className="w-full bg-[#152F50] text-white py-3 px-6 rounded-xl font-bold hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg min-h-touch">
                  Buy Single Report
                </button>
              </div>

              {/* Brokerage/Team Card */}
              <div className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-delaware-sage/20 hover:border-delaware-gold/40 hover:-translate-y-1">
                {/* Icon Badge */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-delaware-navy rounded-2xl shadow-lg flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>

                <h4 className="text-xl font-bold text-delaware-navy mb-3">
                  Brokerage/Team Plan
                </h4>
                
                {/* Price */}
                <div className="mb-4">
                  <div className="text-5xl font-bold bg-gradient-to-r from-delaware-blue to-delaware-gold bg-clip-text text-transparent">
                    Custom
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Pricing based on team size</p>
                </div>

                <p className="text-base text-gray-600 mb-5 leading-relaxed">
                  Unlimited access for your entire office. Centralized billing and team management.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-[#A8BDBE]/10 rounded-full flex items-center justify-center mt-0.5">
                      <FiCheck className="w-3 h-3 text-[#A8BDBE] font-bold" />
                    </div>
                    <span className="text-sm text-gray-700">$15-20 per agent</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-[#A8BDBE]/10 rounded-full flex items-center justify-center mt-0.5">
                      <FiCheck className="w-3 h-3 text-[#A8BDBE] font-bold" />
                    </div>
                    <span className="text-sm text-gray-700">Recruit & retain talent</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-[#A8BDBE]/10 rounded-full flex items-center justify-center mt-0.5">
                      <FiCheck className="w-3 h-3 text-[#A8BDBE] font-bold" />
                    </div>
                    <span className="text-sm text-gray-700">Volume discounts available</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <a 
                  href="/contact" 
                  className="w-full inline-flex items-center justify-center gap-2 bg-delaware-gold text-white py-3 px-6 rounded-xl font-bold hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg min-h-touch"
                >
                  Contact Sales
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
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

