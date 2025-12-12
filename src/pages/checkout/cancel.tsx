import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { FiXCircle } from 'react-icons/fi';

export default function CheckoutCancel() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <FiXCircle className="w-16 h-16 text-gray-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Cancelled
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your payment was cancelled. No charges have been made to your account.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Need help?</h3>
              <p className="text-sm text-gray-600 mb-3">
                If you encountered any issues or have questions about our pricing, we're here to help.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-delaware-gold mr-2">→</span>
                  <span>View our <Link href="/pricing" className="text-delaware-blue hover:underline">pricing plans</Link></span>
                </li>
                <li className="flex items-start">
                  <span className="text-delaware-gold mr-2">→</span>
                  <span>Contact our <Link href="/contact" className="text-delaware-blue hover:underline">support team</Link></span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link
                href="/pricing"
                className="block w-full bg-delaware-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                View Pricing Plans
              </Link>
              <Link
                href="/dashboard"
                className="block w-full bg-white text-delaware-blue px-6 py-3 rounded-lg font-semibold border-2 border-delaware-blue hover:bg-blue-50 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              You can upgrade anytime from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
