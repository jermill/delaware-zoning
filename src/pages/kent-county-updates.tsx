import { useState, FormEvent } from 'react';
import Layout from '@/components/layout/Layout';
import { FaCheckCircle, FaHourglassHalf, FaEnvelope, FaPhone } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function KentCountyUpdates() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Integrate with your email service (Mailchimp, SendGrid, etc.)
    // For now, just simulate subscription
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
      toast.success('You\'ll be notified when Kent County goes live!');
    }, 1000);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
              <FaHourglassHalf className="text-4xl text-yellow-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Kent County Coverage
              <span className="block text-yellow-600 mt-2">Coming Soon!</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're expanding to serve all of Delaware, including Dover and central Delaware communities.
            </p>
          </div>

          {/* Current Coverage Status */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Coverage</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <FaCheckCircle className="text-green-500 text-2xl mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">New Castle County</h3>
                  <p className="text-gray-600">999 zoning districts covering Wilmington, Newark, and surrounding areas</p>
                  <p className="text-sm text-gray-500 mt-1">✅ Fully operational with real-time data</p>
                </div>
              </div>

              <div className="flex items-start">
                <FaCheckCircle className="text-green-500 text-2xl mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Sussex County</h3>
                  <p className="text-gray-600">63 zoning districts covering Rehoboth Beach, Lewes, and coastal communities</p>
                  <p className="text-sm text-gray-500 mt-1">✅ Fully operational with real-time data</p>
                </div>
              </div>

              <div className="flex items-start border-t pt-4">
                <FaHourglassHalf className="text-yellow-500 text-2xl mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Kent County</h3>
                  <p className="text-gray-600">Coming next week - covering Dover, Smyrna, Milford, and all of central Delaware</p>
                  <p className="text-sm text-yellow-600 mt-1 font-medium">🔄 In progress - data integration underway</p>
                </div>
              </div>
            </div>
          </div>

          {/* What This Means */}
          <div className="bg-blue-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What This Means For You</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Available Now:</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Search New Castle County properties</li>
                  <li>• Search Sussex County properties</li>
                  <li>• Access 1,000+ real zoning districts</li>
                  <li>• View permitted uses & requirements</li>
                  <li>• Save properties to dashboard</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🔜 Coming Soon:</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Dover metropolitan area</li>
                  <li>• Smyrna and Camden</li>
                  <li>• Milford and surrounding towns</li>
                  <li>• All Kent County unincorporated areas</li>
                  <li>• Complete Delaware state coverage</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Email Notification Signup */}
          <div className="bg-gradient-to-r from-delaware-blue to-blue-600 rounded-2xl p-8 text-white mb-8">
            <div className="text-center mb-6">
              <FaEnvelope className="text-4xl mx-auto mb-4 opacity-90" />
              <h2 className="text-2xl font-bold mb-2">Get Notified When Kent County Goes Live</h2>
              <p className="text-blue-100">
                Be the first to know when Dover-area coverage launches
              </p>
            </div>

            {subscribed ? (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
                <FaCheckCircle className="text-4xl mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
                <p className="text-blue-100">We'll email you as soon as Kent County coverage is live.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-white text-delaware-blue font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {loading ? 'Subscribing...' : 'Notify Me'}
                  </button>
                </div>
                <p className="text-xs text-blue-100 mt-2 text-center">
                  We'll only email you about Kent County updates. No spam!
                </p>
              </form>
            )}
          </div>

          {/* Need Data Now? */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Kent County Data Now?</h2>
            <p className="text-gray-600 mb-6">
              While we finalize integration, you can contact Kent County directly for immediate zoning information:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaPhone className="mr-2 text-delaware-blue" />
                  Planning Services
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong>Phone:</strong> <a href="tel:302-744-2471" className="text-delaware-blue hover:underline">(302) 744-2471</a>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Hours:</strong> Mon-Fri, 8:00 AM - 4:30 PM
                </p>
                <a 
                  href="https://www.co.kent.de.us/departments/community-services/planning-services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-delaware-blue hover:underline"
                >
                  Visit website →
                </a>
              </div>

              <div className="border rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaPhone className="mr-2 text-delaware-blue" />
                  GIS Department
                </h3>
                <p className="text-gray-700 mb-2">
                  <strong>Phone:</strong> <a href="tel:302-744-2416" className="text-delaware-blue hover:underline">(302) 744-2416</a>
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> <a href="mailto:GIS@kentcountyde.gov" className="text-delaware-blue hover:underline">GIS@kentcountyde.gov</a>
                </p>
                <a 
                  href="https://www.kentcountyde.gov/Doing-Business-with-Kent-County/Development-Resources/Kent-County-GIS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-delaware-blue hover:underline"
                >
                  Visit GIS portal →
                </a>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Integration Timeline</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <FaCheckCircle className="text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Week of Dec 9, 2024</h3>
                  <p className="text-gray-600 text-sm">New Castle & Sussex Counties launched with 1,000+ real districts</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <FaHourglassHalf className="text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Week of Dec 16, 2024</h3>
                  <p className="text-gray-600 text-sm">Contacting Kent County GIS & requesting data access</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Week of Dec 23, 2024</h3>
                  <p className="text-gray-600 text-sm">Data integration, testing, and Kent County coverage launch!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12">
            <a
              href="/"
              className="inline-block px-8 py-3 bg-delaware-blue text-white font-semibold rounded-xl hover:bg-opacity-90 transition-all"
            >
              ← Back to Delaware Zoning
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}


