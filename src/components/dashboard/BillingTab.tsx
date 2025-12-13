import { useState } from 'react';
import { FiCheck, FiDownload, FiCreditCard, FiAlertCircle, FiStar } from 'react-icons/fi';
import Link from 'next/link';
import { UserTier, SubscriptionInfo, Invoice } from '@/data/mockDashboardData';
import TierBadge from './TierBadge';
import UpgradeButton from '../billing/UpgradeButton';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface BillingTabProps {
  userTier: UserTier;
  subscription: SubscriptionInfo;
  invoices: Invoice[];
}

export default function BillingTab({ userTier, subscription, invoices }: BillingTabProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  const handleDownloadInvoice = (invoiceId: string) => {
    // TODO: Implement invoice download from Stripe
    toast.error('Invoice download will be available soon');
  };

  const handleManageBilling = async () => {
    if (!session?.user?.id) {
      toast.error('Please log in to manage billing');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open billing portal');
      }

      // Redirect to Stripe billing portal
      window.location.href = data.url;
    } catch (error: any) {
      console.error('Billing portal error:', error);
      toast.error(error.message || 'Failed to open billing portal');
      setLoading(false);
    }
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    // Use Stripe billing portal for cancellation
    handleManageBilling();
    setShowCancelModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const plans = [
    {
      id: 'looker',
      name: 'The Looker',
      price: 0,
      period: 'forever',
      features: [
        '3 property searches per month',
        'Basic zoning information',
        'Save properties to dashboard',
        'Perfect for trying it out',
      ],
    },
    {
      id: 'pro',
      name: 'The Pro',
      price: 49,
      period: 'month',
      popular: true,
      features: [
        'Unlimited property searches',
        'Full zoning details & permitted uses',
        'Save unlimited properties',
        'Look smart in front of clients',
        'Email support',
      ],
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
        'Perfect for developers & architects',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Plan</h2>
            <div className="flex items-center gap-3">
              <TierBadge tier={userTier} size="md" />
              {subscription.price > 0 ? (
                <span className="text-2xl font-bold text-gray-900">
                  ${subscription.price}
                  <span className="text-base font-normal text-gray-600">/month</span>
                </span>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  Free
                  <span className="text-base font-normal text-gray-600"> forever</span>
                </span>
              )}
            </div>
          </div>
          {userTier !== 'whale' && (
            <Link href="/dashboard?tab=billing" className="btn-gold">
              Upgrade Plan
            </Link>
          )}
        </div>

        {subscription.price > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Billing Cycle</p>
              <p className="font-medium text-gray-900 capitalize">{subscription.billingCycle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
              <p className="font-medium text-gray-900">
                {subscription.nextBillingDate
                  ? formatDate(subscription.nextBillingDate)
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Method</p>
              <div className="flex items-center gap-2">
                <FiCreditCard className="w-4 h-4 text-gray-400" />
                <p className="font-medium text-gray-900">{subscription.paymentMethod}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">
                {subscription.status}
              </span>
            </div>
          </div>
        )}

        {subscription.price > 0 && (
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button 
              onClick={handleManageBilling} 
              disabled={loading}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Manage Billing'}
            </button>
            <button
              onClick={handleCancelSubscription}
              disabled={loading}
              className="px-6 py-3 text-error border-2 border-error rounded-lg font-semibold hover:bg-error hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>

      {/* Plan Comparison */}
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
                  className={`relative rounded-2xl p-5 sm:p-6 transition-all ${
                plan.id === userTier
                  ? 'bg-blue-50 border-2 border-[#152F50]'
                  : 'border-2 border-[#A8BDBE] hover:border-[#D8B368]'
              }`}
            >
              {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="bg-[#D8B368] text-white text-xs font-semibold px-4 py-1 rounded-full inline-flex items-center gap-1.5">
                      <FiStar className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
              )}

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 mt-2">{plan.name}</h3>
              
              <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-sm sm:text-base text-gray-600">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#D8B368]/20 flex items-center justify-center mt-0.5">
                      <FiCheck className="w-3 h-3 text-[#D8B368]" />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.id === userTier ? (
                <div className="text-center py-3 bg-gray-100 rounded-lg font-semibold text-gray-600 text-sm sm:text-base">
                  Current Plan
                </div>
              ) : plan.id === 'looker' && userTier !== 'looker' ? (
                <div className="text-center py-3 bg-gray-50 rounded-lg font-medium text-gray-500 text-sm sm:text-base">
                  Downgrade Not Available
                </div>
              ) : plan.id === 'looker' ? (
                <div className="text-center py-3 bg-gray-50 rounded-lg font-medium text-gray-500 text-sm sm:text-base">
                  Current Plan
                </div>
              ) : (
                <UpgradeButton
                  tier={plan.id === 'pro' ? 'pro' : 'business'}
                  currentTier={userTier}
                  className="block text-center w-full py-3 rounded-lg font-semibold transition-all bg-[#152F50] text-white hover:bg-[#82B8DE] text-sm sm:text-base"
                >
                  {plan.price > subscription.price ? 'Upgrade Now' : 'Select Plan'}
                </UpgradeButton>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invoice History */}
      {invoices.length > 0 && (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Invoice History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{invoice.description}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${invoice.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="inline-flex items-center gap-2 text-sm text-[#82B8DE] hover:text-[#152F50] hover:underline"
                      >
                        <FiDownload className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Billing Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 mb-1">Manage Your Subscription</p>
            <p className="text-sm text-blue-800">
              Use the "Manage Billing" button to update your payment method, view invoices, or cancel your subscription. 
              Access continues until the end of your billing period if you cancel.
            </p>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Subscription</h3>
            <p className="text-gray-600 mb-6">
              You'll be redirected to our secure billing portal where you can cancel your {subscription.tierName} subscription.
              Your access will continue until the end of your current billing period.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 btn-secondary"
              >
                Go Back
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 px-6 py-3 bg-[#152F50] text-white rounded-lg font-semibold hover:bg-[#82B8DE] transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

