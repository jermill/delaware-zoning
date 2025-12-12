import { useState } from 'react';
import { FiCheck, FiDownload, FiCreditCard, FiAlertCircle, FiStar } from 'react-icons/fi';
import Link from 'next/link';
import { UserTier, SubscriptionInfo, Invoice } from '@/data/mockDashboardData';
import TierBadge from './TierBadge';

interface BillingTabProps {
  userTier: UserTier;
  subscription: SubscriptionInfo;
  invoices: Invoice[];
}

export default function BillingTab({ userTier, subscription, invoices }: BillingTabProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleDownloadInvoice = (invoiceId: string) => {
    alert(`Would download invoice ${invoiceId} (backend not connected yet)`);
  };

  const handleUpdatePayment = () => {
    alert('Payment method update will be available once backend integration is complete.');
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    alert('Subscription cancellation will be available once backend integration is complete.');
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
              {subscription.price > 0 && (
                <span className="text-2xl font-bold text-gray-900">
                  ${subscription.price}
                  <span className="text-base font-normal text-gray-600">/month</span>
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
            <button onClick={handleUpdatePayment} className="btn-secondary">
              Update Payment Method
            </button>
            <button
              onClick={handleCancelSubscription}
              className="px-6 py-3 text-error border-2 border-error rounded-lg font-semibold hover:bg-error hover:text-white transition-all"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>

      {/* Plan Comparison */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 transition-all ${
                plan.id === userTier
                  ? 'bg-blue-50 border-2 border-delaware-blue'
                  : 'border-2 border-gray-200 hover:border-delaware-gold/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-delaware-gold to-yellow-600 text-white text-xs font-semibold px-4 py-1 rounded-full inline-flex items-center gap-1.5">
                    <FiStar className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-2 mt-2">{plan.name}</h3>
              
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-delaware-gold/10 flex items-center justify-center mt-0.5">
                      <FiCheck className="w-3 h-3 text-delaware-gold" />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.id === userTier ? (
                <div className="text-center py-3 bg-gray-100 rounded-lg font-semibold text-gray-600">
                  Current Plan
                </div>
              ) : plan.id === 'looker' && userTier !== 'looker' ? (
                <div className="text-center py-3 bg-gray-50 rounded-lg font-medium text-gray-500">
                  Downgrade Not Available
                </div>
              ) : (
                <button
                  onClick={() => {
                    alert(`${plan.price > subscription.price ? 'Upgrade' : 'Select'} to ${plan.name} will be available once backend integration is complete.`);
                  }}
                  className="block text-center w-full py-3 rounded-lg font-semibold transition-all bg-delaware-blue text-white hover:bg-opacity-90 hover:shadow-elevated"
                >
                  {plan.price > subscription.price ? 'Upgrade' : 'Select Plan'}
                </button>
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
                        className="inline-flex items-center gap-2 text-sm text-delaware-blue hover:underline"
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

      {/* Cancellation Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 mb-1">Subscription Cancellation</p>
            <p className="text-sm text-blue-800">
              You can cancel your subscription anytime from this page. Access continues until the end of your billing period.
            </p>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Subscription?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your {subscription.tierName} subscription? You'll lose
              access to all premium features at the end of your current billing period.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 btn-secondary"
              >
                Keep Subscription
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 px-6 py-3 bg-error text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Cancel Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

