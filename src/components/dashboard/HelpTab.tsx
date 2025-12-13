import { useState } from 'react';
import { FiChevronDown, FiMail, FiMessageCircle, FiBook, FiSearch, FiFileText, FiCode } from 'react-icons/fi';

export default function HelpTab() {
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const faqs = [
    {
      id: 1,
      question: 'How accurate is the zoning information?',
      answer:
        'All zoning data is sourced directly from Delaware county and municipal planning offices. We update our database monthly to ensure accuracy. However, we always recommend verifying critical information with the relevant planning office before making final decisions.',
    },
    {
      id: 2,
      question: 'What does "conditional use" mean?',
      answer:
        'A conditional use means the property use is allowed in that zone, but requires special approval from the local planning board or zoning commission. You\'ll need to apply for a conditional use permit, which typically involves a public hearing.',
    },
    {
      id: 3,
      question: 'Can I export my search results?',
      answer:
        'Yes! The Whale subscribers can export professional PDF reports for any property search. These reports include the zoning code, permitted uses, dimensional standards, and permit requirements. Upgrade to The Whale to unlock PDF exports.',
    },
    {
      id: 4,
      question: 'How do I upgrade or downgrade my plan?',
      answer:
        'You can upgrade your plan anytime from the Billing tab. Upgrades take effect immediately. If you need to downgrade or cancel, you can do so from the same page. Changes take effect at the end of your current billing period.',
    },
    {
      id: 5,
      question: 'What counties are covered?',
      answer:
        'We currently cover all three Delaware counties (New Castle, Kent, and Sussex) plus the major cities of Wilmington, Dover, and Newark. We\'re working on expanding to neighboring states soon.',
    },
    {
      id: 6,
      question: 'Can I cancel my subscription?',
      answer:
        'Yes, you can cancel your subscription anytime from the Billing tab in your dashboard. Your access will continue until the end of your current billing period. No refunds are provided for partial months.',
    },
  ];

  const guides = [
    {
      id: 1,
      icon: <FiSearch className="w-6 h-6" />,
      title: 'How to Search for Zoning',
      description: 'Learn how to use the address search and find zoning information quickly.',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Follow these steps to search for zoning information:</p>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li><strong>Enter an Address:</strong> Type any Delaware address in the search bar. Use our autocomplete for accurate results.</li>
            <li><strong>Select from Suggestions:</strong> Choose the correct address from the dropdown suggestions.</li>
            <li><strong>View Results:</strong> Instantly see the zoning code, permitted uses, setbacks, and requirements.</li>
            <li><strong>Save Properties:</strong> Click "Save Property" to add it to your dashboard for future reference.</li>
            <li><strong>Export (Whale only):</strong> Generate a professional PDF report of the zoning details.</li>
          </ol>
          <p className="text-sm text-gray-600 mt-4">💡 <strong>Tip:</strong> Pro and Whale members get unlimited searches!</p>
        </div>
      ),
    },
    {
      id: 2,
      icon: <FiCode className="w-6 h-6" />,
      title: 'Understanding Zone Codes',
      description: 'Decode common zoning classifications like R-1, C-3, and I-1.',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Common Delaware zoning codes explained:</p>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p><strong className="text-delaware-navy">R-1, R-2, R-3:</strong> Residential zones (single-family, duplex, multi-family)</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p><strong className="text-delaware-navy">C-1, C-2, C-3:</strong> Commercial zones (neighborhood, general, intensive)</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p><strong className="text-delaware-navy">I-1, I-2:</strong> Industrial zones (light, heavy)</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p><strong className="text-delaware-navy">MX:</strong> Mixed-use zones (residential + commercial)</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p><strong className="text-delaware-navy">AG:</strong> Agricultural zones</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">💡 <strong>Tip:</strong> Each code has specific permitted uses and restrictions.</p>
        </div>
      ),
    },
    {
      id: 3,
      icon: <FiFileText className="w-6 h-6" />,
      title: 'Reading Zoning Results',
      description: 'Understand permitted uses, conditional uses, and restrictions.',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Your zoning results include:</p>
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="font-semibold text-gray-900">Permitted Uses</p>
              <p className="text-sm text-gray-600">Uses allowed by-right without special approval</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4 py-2">
              <p className="font-semibold text-gray-900">Conditional Uses</p>
              <p className="text-sm text-gray-600">Uses requiring special permit and public hearing</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-semibold text-gray-900">Dimensional Standards</p>
              <p className="text-sm text-gray-600">Setbacks, lot sizes, height limits, and coverage ratios</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <p className="font-semibold text-gray-900">Required Permits</p>
              <p className="text-sm text-gray-600">Building permits, site plan reviews, and special permits needed</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">💡 <strong>Tip:</strong> Always verify with local planning office for final decisions.</p>
        </div>
      ),
    },
    {
      id: 4,
      icon: <FiBook className="w-6 h-6" />,
      title: 'Tips for Realtors',
      description: 'Best practices for using zoning info in client consultations.',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Best practices for real estate professionals:</p>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li><strong>Pre-listing Research:</strong> Check zoning before listing to highlight opportunities (ADU potential, commercial conversion, etc.)</li>
            <li><strong>Buyer Consultations:</strong> Show clients what they can build or operate on the property</li>
            <li><strong>Due Diligence:</strong> Include zoning reports in your buyer packages</li>
            <li><strong>Investment Properties:</strong> Identify properties with development potential</li>
            <li><strong>Competitive Edge:</strong> Be the realtor who knows zoning inside-out</li>
          </ol>
          <div className="mt-4 p-4 bg-delaware-gold/10 border border-delaware-gold rounded-lg">
            <p className="text-sm text-gray-700"><strong>📈 Pro Tip:</strong> Upgrade to The Whale to generate professional PDF reports for clients!</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Support Card */}
      <div className="bg-blue-900 text-white rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-white/10 rounded-lg">
            <FiMessageCircle className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Need Help?</h2>
            <p className="text-white/90 mb-4">
              Our support team is here to help you Monday through Friday, 9am-5pm EST.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:support@delawarezoning.com"
                className="inline-flex items-center gap-2 bg-white text-delaware-blue px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <FiMail className="w-4 h-4" />
                Email Support
              </a>
              <a
                href="mailto:feedback@delawarezoning.com"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                Send Feedback
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Guides */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {guides.map((guide) => (
            <button
              key={guide.id}
              onClick={() => setSelectedGuide(guide.id)}
              className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-delaware-blue hover:bg-blue-50 transition-all text-left group"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-delaware-blue transition-colors">
                <div className="text-delaware-blue group-hover:text-white transition-colors">
                  {guide.icon}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-delaware-blue mb-1">
                  {guide.title}
                </h3>
                <p className="text-sm text-gray-600">{guide.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                <FiChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openFaqId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaqId === faq.id && (
                <div className="px-4 pb-4 text-gray-700 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Support Email</h3>
            <a
              href="mailto:support@delawarezoning.com"
              className="text-delaware-blue hover:underline"
            >
              support@delawarezoning.com
            </a>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Feedback & Feature Requests</h3>
            <a
              href="mailto:feedback@delawarezoning.com"
              className="text-delaware-blue hover:underline"
            >
              feedback@delawarezoning.com
            </a>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Business Inquiries</h3>
            <a
              href="mailto:hello@delawarezoning.com"
              className="text-delaware-blue hover:underline"
            >
              hello@delawarezoning.com
            </a>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Support Hours</h3>
            <p className="text-gray-700">Monday - Friday</p>
            <p className="text-gray-700">9:00 AM - 5:00 PM EST</p>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Looking for Official Zoning Documents?</h3>
        <p className="text-sm text-gray-700 mb-4">
          For official zoning ordinances and detailed regulations, visit your county or municipal
          planning office website:
        </p>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="https://www.newcastlede.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-delaware-blue hover:underline"
            >
              New Castle County Planning →
            </a>
          </li>
          <li>
            <a
              href="https://www.co.kent.de.us"
              target="_blank"
              rel="noopener noreferrer"
              className="text-delaware-blue hover:underline"
            >
              Kent County Planning →
            </a>
          </li>
          <li>
            <a
              href="https://www.sussexcountyde.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-delaware-blue hover:underline"
            >
              Sussex County Planning →
            </a>
          </li>
        </ul>
      </div>

      {/* Guide Modal */}
      {selectedGuide !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={() => setSelectedGuide(null)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-delaware-blue rounded-lg">
                  <div className="text-white">
                    {guides.find(g => g.id === selectedGuide)?.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {guides.find(g => g.id === selectedGuide)?.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {guides.find(g => g.id === selectedGuide)?.content}
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <button
                onClick={() => setSelectedGuide(null)}
                className="w-full px-4 py-3 bg-delaware-blue text-white rounded-lg font-semibold hover:bg-[#82B8DE] transition-colors"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

