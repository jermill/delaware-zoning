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
      <div className="bg-delaware-cream min-h-screen flex items-center justify-center py-12 sm:py-16 px-4">
        <div className="max-w-md w-full">
          <div className="card-elevated border border-delaware-sage/20">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-delaware-sage/20 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-12 h-12 text-delaware-blue" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-delaware-gold rounded-full flex items-center justify-center shadow-lg">
                  <FiMail className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-delaware-navy mb-3">
                Check Your Email
              </h1>
              <p className="text-base text-gray-600">
                We've sent a verification link to
              </p>
              {email && (
                <p className="text-base font-bold text-delaware-blue mt-2">
                  {email}
                </p>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-delaware-blue/10 border border-delaware-blue/20 rounded-xl p-5 mb-6">
              <h3 className="font-bold text-delaware-navy mb-3 flex items-center gap-2">
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
            <div className="bg-delaware-cream rounded-xl p-5 mb-6 border border-delaware-sage/20">
              <p className="text-sm text-delaware-navy font-bold mb-2">
                Can't find the email?
              </p>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• Wait a few minutes for the email to arrive</li>
              </ul>
            </div>

            {/* Resend Button */}
            <button
              onClick={handleResend}
              disabled={!canResend}
              className="btn-secondary w-full mb-4"
            >
              {canResend ? 'Resend Verification Email' : `Resend in ${timeLeft}s`}
            </button>

            {/* Back to Login */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already verified?{' '}
                <Link href="/login" className="text-delaware-blue font-bold hover:text-delaware-gold transition-colors">
                  Log In
                </Link>
              </p>
            </div>

            {/* Help Section */}
            <div className="mt-6 pt-6 border-t border-delaware-sage/20 text-center">
              <p className="text-sm text-gray-600">
                Need help? Contact us at{' '}
                <a href="mailto:support@delawarezoning.com" className="text-delaware-blue font-bold hover:text-delaware-gold transition-colors">
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


