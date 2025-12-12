import Layout from '@/components/layout/Layout';
import { FiMail, FiMapPin } from 'react-icons/fi';

export default function Contact() {
  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="section-container">
          <div className="max-w-4xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-delaware-gold font-semibold text-xs sm:text-sm uppercase tracking-wide mb-3">
                Get in Touch
              </p>
              <h1 className="text-section-heading text-gray-900 mb-4">
                Contact Us
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Have questions? We'd love to hear from you.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
              <div className="card-hover text-center group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-delaware-blue text-white inline-flex items-center justify-center mx-auto mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FiMail className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-delaware-blue transition-colors duration-300">
                  Email
                </h3>
                <p className="text-sm sm:text-base text-gray-600">support@delawarezoning.com</p>
              </div>

              <div className="card-hover text-center group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-delaware-gold text-white inline-flex items-center justify-center mx-auto mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FiMapPin className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-delaware-blue transition-colors duration-300">
                  Location
                </h3>
                <p className="text-sm sm:text-base text-gray-600">Delaware, USA</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-card-hover p-6 sm:p-8 md:p-10 border border-gray-100">
              <form className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-delaware-gold focus:ring-2 focus:ring-delaware-gold/20 transition-all"
                    placeholder="Your name"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-delaware-gold focus:ring-2 focus:ring-delaware-gold/20 transition-all"
                    placeholder="you@example.com"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:border-delaware-gold focus:ring-2 focus:ring-delaware-gold/20 transition-all resize-none"
                    placeholder="How can we help?"
                    disabled
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-delaware-blue text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl font-semibold opacity-50 cursor-not-allowed transition-all duration-300"
                  disabled
                >
                  Send Message (Coming Soon)
                </button>
              </form>

              <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-100">
                <p className="text-xs sm:text-sm text-gray-600 text-center">
                  <strong>Note:</strong> Contact form functionality will be added soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
