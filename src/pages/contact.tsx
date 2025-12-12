import Layout from '@/components/layout/Layout';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Contact() {
  return (
    <Layout>
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-delaware-blue mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600">
              Have questions? We're here to help.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FiMail className="w-6 h-6 text-delaware-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <a 
                    href="mailto:support@delawarezoning.com" 
                    className="text-delaware-blue hover:underline"
                  >
                    support@delawarezoning.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FiPhone className="w-6 h-6 text-delaware-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <a 
                    href="tel:+13025550100" 
                    className="text-delaware-blue hover:underline"
                  >
                    (302) 555-0100
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    Monday - Friday, 9am - 5pm EST
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FiMapPin className="w-6 h-6 text-delaware-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">
                    123 Market Street<br />
                    Wilmington, DE 19801
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form className="mt-8 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  placeholder="How can we help?"
                />
              </div>

              <button
                type="button"
                disabled
                className="w-full px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
              >
                Form Coming Soon
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
