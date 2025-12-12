import Layout from '@/components/layout/Layout';
import { FiShield, FiLock, FiEye, FiUserCheck } from 'react-icons/fi';

export default function PrivacyPolicy() {
  const lastUpdated = 'December 13, 2024';

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 mb-6">
              Last Updated: <span className="font-semibold">{lastUpdated}</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <FiShield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">GDPR Compliant</h3>
                  <p className="text-sm text-blue-700">EU data protection standards</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <FiLock className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">CCPA Compliant</h3>
                  <p className="text-sm text-green-700">California privacy rights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  Delaware Zoning (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
                  our website and services (collectively, the &quot;Service&quot;).
                </p>
                <p>
                  Please read this Privacy Policy carefully. By using the Service, you consent to the practices described 
                  in this policy. If you do not agree with this policy, please do not use the Service.
                </p>
              </div>
            </section>

            {/* 1. Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiEye className="text-delaware-blue" />
                1. Information We Collect
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1.1 Personal Information You Provide</h3>
                  <p className="text-gray-700 mb-2">When you create an account or use our Service, we collect:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                    <li><strong>Account Information:</strong> Name, email address, password (encrypted)</li>
                    <li><strong>Profile Information:</strong> Company name, phone number, business address (optional)</li>
                    <li><strong>Payment Information:</strong> Credit card details (processed securely by Stripe; we do not store full card numbers)</li>
                    <li><strong>Communication Data:</strong> Messages you send us through contact forms or support</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1.2 Usage Information We Collect Automatically</h3>
                  <p className="text-gray-700 mb-2">When you use our Service, we automatically collect:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                    <li><strong>Search History:</strong> Property addresses you search for</li>
                    <li><strong>Saved Properties:</strong> Properties you save to your dashboard</li>
                    <li><strong>Usage Data:</strong> Features you use, time spent, clicks, pages viewed</li>
                    <li><strong>Device Information:</strong> Browser type, operating system, device type</li>
                    <li><strong>Log Data:</strong> IP address, access times, referring URLs</li>
                    <li><strong>Location Data:</strong> General location based on IP address (not precise GPS)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1.3 Cookies and Tracking Technologies</h3>
                  <p className="text-gray-700 mb-2">We use cookies and similar technologies to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-700">
                    <li>Keep you logged in to your account</li>
                    <li>Remember your preferences and settings</li>
                    <li>Analyze how you use the Service</li>
                    <li>Provide personalized content and features</li>
                  </ul>
                  <p className="text-gray-700 mt-2">
                    You can control cookies through your browser settings. Note that disabling cookies may limit 
                    functionality of the Service.
                  </p>
                </div>
              </div>
            </section>

            {/* 2. How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Provide the Service:</strong> Process searches, save properties, manage your account</li>
                  <li><strong>Process Payments:</strong> Handle subscriptions, billing, and refunds</li>
                  <li><strong>Communicate:</strong> Send transactional emails, respond to support requests</li>
                  <li><strong>Improve the Service:</strong> Analyze usage patterns, fix bugs, develop new features</li>
                  <li><strong>Ensure Security:</strong> Detect fraud, prevent abuse, protect user accounts</li>
                  <li><strong>Comply with Law:</strong> Meet legal obligations and respond to legal requests</li>
                  <li><strong>Marketing (with consent):</strong> Send promotional emails about new features or plans</li>
                </ul>
              </div>
            </section>

            {/* 3. How We Share Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Share Your Information</h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-4">
                <p>We do not sell your personal information. We share your information only in these limited circumstances:</p>
                
                <div>
                  <h4 className="font-semibold text-gray-900">3.1 Service Providers</h4>
                  <p>We share data with third-party service providers who help us operate the Service:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Stripe:</strong> Payment processing (PCI DSS compliant)</li>
                    <li><strong>Supabase:</strong> Database hosting and authentication</li>
                    <li><strong>Google:</strong> Maps and geocoding services</li>
                    <li><strong>Netlify:</strong> Web hosting and CDN</li>
                    <li><strong>Sentry:</strong> Error monitoring</li>
                    <li><strong>Google Analytics:</strong> Usage analytics (anonymized)</li>
                  </ul>
                  <p className="text-sm mt-2">
                    All service providers are contractually obligated to protect your data and use it only for the 
                    purposes we specify.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">3.2 Legal Requirements</h4>
                  <p>We may disclose your information if required by law or in response to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Court orders or subpoenas</li>
                    <li>Legal processes or government requests</li>
                    <li>Protection of our rights, property, or safety</li>
                    <li>Investigations of fraud or security issues</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">3.3 Business Transfers</h4>
                  <p>
                    If we are acquired by or merged with another company, your information may be transferred to 
                    the new owner.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiLock className="text-delaware-blue" />
                4. Data Security
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>We implement industry-standard security measures to protect your information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Encryption:</strong> All data transmitted over HTTPS/TLS encryption</li>
                  <li><strong>Password Security:</strong> Passwords are hashed using bcrypt</li>
                  <li><strong>Database Security:</strong> Row-level security and access controls</li>
                  <li><strong>PCI Compliance:</strong> Payment data handled by Stripe (PCI DSS Level 1)</li>
                  <li><strong>Regular Audits:</strong> Security reviews and vulnerability scanning</li>
                  <li><strong>Access Controls:</strong> Limited employee access to personal data</li>
                </ul>
                <p className="text-sm italic mt-4">
                  While we take reasonable measures to protect your information, no security system is impenetrable. 
                  We cannot guarantee absolute security.
                </p>
              </div>
            </section>

            {/* 5. Your Privacy Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiUserCheck className="text-delaware-blue" />
                5. Your Privacy Rights
              </h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">GDPR Rights (EU Users)</h4>
                  <p className="text-blue-800 text-sm mb-2">If you are in the European Union, you have the right to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-blue-800">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
                    <li><strong>Erasure:</strong> Request deletion of your personal data (&quot;right to be forgotten&quot;)</li>
                    <li><strong>Restriction:</strong> Limit how we use your data</li>
                    <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                    <li><strong>Object:</strong> Object to processing of your data</li>
                    <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <h4 className="font-semibold text-green-900 mb-2">CCPA Rights (California Users)</h4>
                  <p className="text-green-800 text-sm mb-2">If you are a California resident, you have the right to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-green-800">
                    <li><strong>Know:</strong> Request disclosure of personal information collected</li>
                    <li><strong>Delete:</strong> Request deletion of your personal information</li>
                    <li><strong>Opt-Out:</strong> Opt-out of the sale of personal information (we do not sell data)</li>
                    <li><strong>Non-Discrimination:</strong> Not be discriminated against for exercising your rights</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How to Exercise Your Rights</h4>
                  <p className="text-gray-700 mb-2">To exercise any of these rights:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4 text-gray-700">
                    <li>Email us at privacy@delawarezoning.com</li>
                    <li>Include your full name and email address</li>
                    <li>Specify which right(s) you wish to exercise</li>
                    <li>We will respond within 30 days</li>
                  </ol>
                  <p className="text-sm text-gray-600 mt-2">
                    We may need to verify your identity before processing your request.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>We retain your information for as long as necessary to provide the Service and comply with legal obligations:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Account Data:</strong> Until you delete your account, plus 90 days for backups</li>
                  <li><strong>Search History:</strong> 2 years from the date of search</li>
                  <li><strong>Payment Records:</strong> 7 years for tax and accounting purposes</li>
                  <li><strong>Usage Analytics:</strong> Aggregated data retained indefinitely (anonymized)</li>
                  <li><strong>Support Communications:</strong> 3 years from last contact</li>
                </ul>
                <p>
                  You can request deletion of your data at any time by emailing privacy@delawarezoning.com.
                </p>
              </div>
            </section>

            {/* 7. Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children&apos;s Privacy</h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  Our Service is not intended for children under 18 years of age. We do not knowingly collect personal 
                  information from children under 18. If you become aware that a child has provided us with personal 
                  information, please contact us immediately, and we will delete such information.
                </p>
              </div>
            </section>

            {/* 8. International Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  Your information may be transferred to and processed in the United States or other countries where 
                  our service providers operate. These countries may have different data protection laws than your country.
                </p>
                <p>
                  For EU users, we ensure adequate protection through:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Standard Contractual Clauses approved by the European Commission</li>
                  <li>Service providers with Privacy Shield or GDPR compliance certifications</li>
                </ul>
              </div>
            </section>

            {/* 9. Marketing Communications */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Marketing Communications</h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  With your consent, we may send you promotional emails about new features, special offers, and other 
                  information we think you may find interesting.
                </p>
                <p>
                  You can opt-out of marketing emails at any time by:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Clicking &quot;Unsubscribe&quot; in any marketing email</li>
                  <li>Updating your preferences in your account settings</li>
                  <li>Emailing us at privacy@delawarezoning.com</li>
                </ul>
                <p className="text-sm">
                  Note: You cannot opt-out of transactional emails (e.g., password resets, billing notifications).
                </p>
              </div>
            </section>

            {/* 10. Third-Party Links */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Links</h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  Our Service may contain links to third-party websites, such as local government zoning offices. 
                  We are not responsible for the privacy practices of these third-party sites. We encourage you to 
                  read their privacy policies before providing any personal information.
                </p>
              </div>
            </section>

            {/* 11. Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of significant changes by:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Posting the new Privacy Policy on this page with a new &quot;Last Updated&quot; date</li>
                  <li>Sending an email notification for material changes</li>
                </ul>
                <p>
                  Your continued use of the Service after changes are posted constitutes your acceptance of the 
                  updated Privacy Policy.
                </p>
              </div>
            </section>

            {/* 12. Contact Us */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <div className="prose prose-blue max-w-none text-gray-700">
                <p className="mb-4">
                  If you have questions about this Privacy Policy or how we handle your data, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-3">Delaware Zoning - Privacy Office</p>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> privacy@delawarezoning.com</p>
                    <p><strong>Support:</strong> support@delawarezoning.com</p>
                    <p><strong>Data Protection Officer:</strong> dpo@delawarezoning.com</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    We will respond to all inquiries within 30 days.
                  </p>
                </div>
              </div>
            </section>

            {/* Summary Box */}
            <section className="border-t pt-6 mt-8">
              <div className="bg-delaware-blue text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Privacy in Brief</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-1">✓ We collect</p>
                    <p className="text-blue-100">Only what's needed to provide the service</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">✓ We don't sell</p>
                    <p className="text-blue-100">Your data to third parties</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">✓ You control</p>
                    <p className="text-blue-100">Your data with full access rights</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
