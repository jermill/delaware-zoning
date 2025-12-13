import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiCheckCircle, FiDownload, FiMail, FiHome } from 'react-icons/fi';

export default function SingleReportSuccess() {
  const router = useRouter();
  const { session_id } = router.query;
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      // Fetch session details
      fetch(`/api/stripe/session?session_id=${session_id}`)
        .then(res => res.json())
        .then(data => {
          setSessionData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching session:', error);
          setLoading(false);
        });
    }
  }, [session_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-delaware-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-delaware-cream via-white to-delaware-sage/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>

          {/* Address */}
          {sessionData?.metadata?.address && (
            <div className="mb-6 p-4 bg-delaware-cream rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Zoning Report For:</p>
              <p className="text-lg font-semibold text-delaware-navy">
                {sessionData.metadata.address}
              </p>
            </div>
          )}

          {/* Message */}
          <p className="text-lg text-gray-600 mb-8">
            Your zoning report is being generated and will be sent to your email shortly.
          </p>

          {/* Info Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-left">
              <div className="flex items-center gap-2 mb-2">
                <FiMail className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Check Your Email</h3>
              </div>
              <p className="text-sm text-gray-600">
                Your report will arrive within 5-10 minutes
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-left">
              <div className="flex items-center gap-2 mb-2">
                <FiDownload className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Download Link</h3>
              </div>
              <p className="text-sm text-gray-600">
                A secure download link is included in the email
              </p>
            </div>
          </div>

          {/* Receipt Info */}
          <div className="mb-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              A receipt has been sent to{' '}
              <span className="font-semibold text-gray-900">
                {sessionData?.customer_details?.email || 'your email'}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-delaware-blue text-white font-semibold rounded-xl hover:bg-[#82B8DE] transition-colors"
            >
              <FiHome className="w-5 h-5" />
              Back to Home
            </Link>
            <Link
              href="/signup"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-delaware-gold text-white font-semibold rounded-xl hover:opacity-90 transition-colors"
            >
              Create Free Account
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-delaware-cream border border-delaware-gold/30 rounded-xl">
            <p className="text-sm text-gray-700">
              <strong>💡 Tip:</strong> Need unlimited reports? Our Pro plan starts at just $49/month with unlimited searches and PDF exports.
            </p>
          </div>
        </div>

        {/* Support Note */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Questions? Email us at{' '}
          <a href="mailto:support@delawarezoning.com" className="text-delaware-blue hover:underline font-medium">
            support@delawarezoning.com
          </a>
        </p>
      </div>
    </div>
  );
}
