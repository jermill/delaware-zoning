import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';
import Link from 'next/link';

export default function CheckoutSuccess() {
  const router = useRouter();
  const { session_id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session_id) {
      // Give webhooks a moment to process
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [session_id]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {loading ? (
              <>
                <div className="flex justify-center mb-6">
                  <FiLoader className="w-16 h-16 text-delaware-blue animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Processing your subscription...
                </h1>
                <p className="text-gray-600">
                  Please wait while we confirm your payment
                </p>
              </>
            ) : error ? (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">⚠️</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Something went wrong
                </h1>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link
                  href="/dashboard?tab=billing"
                  className="inline-block bg-delaware-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <FiCheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome aboard!
                </h1>
                <p className="text-gray-600 mb-6">
                  Your subscription has been activated successfully. You now have access to all premium features.
                </p>
                
                <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
                  <h3 className="font-semibold text-delaware-blue mb-2">What's next?</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="text-delaware-gold mr-2">✓</span>
                      <span>Access your enhanced search limits</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-delaware-gold mr-2">✓</span>
                      <span>Save unlimited properties</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-delaware-gold mr-2">✓</span>
                      <span>Export unlimited PDF reports</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-delaware-gold mr-2">✓</span>
                      <span>Manage your billing anytime in the dashboard</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/dashboard"
                    className="block w-full bg-delaware-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/dashboard?tab=billing"
                    className="block w-full bg-white text-delaware-blue px-6 py-3 rounded-lg font-semibold border-2 border-delaware-blue hover:bg-blue-50 transition-colors"
                  >
                    View Billing Details
                  </Link>
                </div>

                <p className="text-xs text-gray-500 mt-6">
                  You'll receive a confirmation email with your invoice shortly.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
