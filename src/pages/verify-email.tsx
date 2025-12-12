import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMail, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function VerifyEmail() {
  const router = useRouter();
  const { email } = router.query;
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    // TODO: Implement resend verification email
    setTimeLeft(60);
    setCanResend(false);
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 sm:py-16">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-card-hover p-6 sm:p-8 md:p-10 border border-gray-100">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-delaware-gold rounded-full flex items-center justify-center">
                  <FiMail className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Check Your Email
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                We've sent a verification link to
              </p>
              {email && (
                <p className="text-sm sm:text-base font-semibold text-delaware-blue mt-2">
                  {email}
                </p>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 text-delaware-blue" />
                What to do next:
              </h3>
              <ol className="space-y-2 text-sm text-gray-700 ml-7">
                <li className="list-decimal">Check your email inbox</li>
                <li className="list-decimal">Click the verification link in the email</li>
                <li className="list-decimal">You'll be automatically signed in and redirected to your dashboard</li>
              </ol>
            </div>

            {/* Helpful Tips */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Can't find the email?</strong>
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• Wait a few minutes for the email to arrive</li>
              </ul>
            </div>

            {/* Resend Button */}
            <button
              onClick={handleResend}
              disabled={!canResend}
              className="w-full bg-delaware-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {canResend ? 'Resend Verification Email' : `Resend in ${timeLeft}s`}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already verified?{' '}
                <Link href="/login" className="text-delaware-blue font-semibold hover:text-delaware-gold transition-colors">
                  Log In
                </Link>
              </p>
            </div>

            {/* Help Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Need help? Contact us at{' '}
                <a href="mailto:support@delawarezoning.com" className="text-delaware-blue font-semibold hover:text-delaware-gold transition-colors">
                  support@delawarezoning.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
