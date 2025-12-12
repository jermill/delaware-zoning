import Layout from '@/components/layout/Layout';
import { FiMail, FiMapPin } from 'react-icons/fi';

export default function Contact() {
  return (
    <Layout>
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Have questions? We'd love to hear from you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-delaware-blue text-white rounded-full mb-4">
                <FiMail className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">support@delawarezoning.com</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-delaware-blue text-white rounded-full mb-4">
                <FiMapPin className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">Delaware, USA</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-delaware-blue"
                  placeholder="Your name"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-delaware-blue"
                  placeholder="you@example.com"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-delaware-blue"
                  placeholder="How can we help?"
                  disabled
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary opacity-50 cursor-not-allowed"
                disabled
              >
                Send Message (Coming Soon)
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                <strong>Note:</strong> Contact form functionality will be added soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
