import Layout from '@/components/layout/Layout';
import Link from 'next/link';

export default function Signup() {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 sm:py-16">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-card-hover p-6 sm:p-8 md:p-10 border border-gray-100">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                Get Started Free
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Create your account and start exploring Delaware zoning data.
              </p>
            </div>

            <form className="space-y-5 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-delaware-gold focus:ring-2 focus:ring-delaware-gold/20 transition-all"
                  placeholder="John Doe"
                  disabled
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-delaware-gold focus:ring-2 focus:ring-delaware-gold/20 transition-all"
                  placeholder="you@example.com"
                  disabled
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-delaware-gold focus:ring-2 focus:ring-delaware-gold/20 transition-all"
                  placeholder="••••••••"
                  disabled
                />
              </div>

              <button
                type="submit"
                className="w-full bg-delaware-blue text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl font-semibold opacity-50 cursor-not-allowed transition-all duration-300"
                disabled
              >
                Sign Up (Coming Soon)
              </button>
            </form>

            <div className="mt-5 sm:mt-6 text-center">
              <p className="text-sm sm:text-base text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-delaware-blue font-semibold hover:text-delaware-gold transition-colors">
                  Log In
                </Link>
              </p>
            </div>

            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-100">
              <p className="text-xs sm:text-sm text-gray-600 text-center">
                <strong>Note:</strong> Authentication features are coming soon. This is a frontend-only preview.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
