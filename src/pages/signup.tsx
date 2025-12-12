import Layout from '@/components/layout/Layout';
import Link from 'next/link';

export default function Signup() {
  return (
    <Layout>
      <div className="section-container">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Get Started Free
          </h1>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-delaware-blue"
                placeholder="John Doe"
                disabled
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-delaware-blue"
                placeholder="you@example.com"
                disabled
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-delaware-blue"
                placeholder="••••••••"
                disabled
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary opacity-50 cursor-not-allowed"
              disabled
            >
              Sign Up (Coming Soon)
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-delaware-blue font-semibold hover:underline">
                Log In
              </Link>
            </p>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              <strong>Note:</strong> Authentication features are coming soon. This is a frontend-only preview.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
