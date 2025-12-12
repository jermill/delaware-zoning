import Layout from '@/components/layout/Layout';
import { FiCheckCircle } from 'react-icons/fi';

export default function TermsOfService() {
  const lastUpdated = 'December 13, 2024';

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600">
              Last Updated: <span className="font-semibold">{lastUpdated}</span>
            </p>
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> Please read these terms carefully before using Delaware Zoning services. 
                By accessing or using our service, you agree to be bound by these terms.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            {/* 1. Acceptance */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-delaware-blue" />
                1. Acceptance of Terms
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  By accessing and using Delaware Zoning (&quot;the Service&quot;), you accept and agree to be bound by 
                  these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Service.
                </p>
                <p>
                  We reserve the right to modify these Terms at any time. Your continued use of the Service after 
                  changes are posted constitutes your acceptance of the modified Terms.
                </p>
              </div>
            </section>

            {/* 2. Service Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-delaware-blue" />
                2. Service Description
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  Delaware Zoning provides online access to zoning information for properties in Delaware. 
                  The Service includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Zoning district classifications and codes</li>
                  <li>Permitted and conditional use information</li>
                  <li>Dimensional standards and setback requirements</li>
                  <li>Required permits and approval processes</li>
                  <li>Flood zone information</li>
                  <li>Property search and save functionality</li>
                </ul>
              </div>
            </section>

            {/* 3. User Accounts */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-delaware-blue" />
                3. User Accounts and Registration
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  To access certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
                <p>
                  You may not share your account credentials or allow others to access your account. 
                  We reserve the right to suspend or terminate accounts that violate these Terms.
                </p>
              </div>
            </section>

            {/* 4. Subscription and Payment */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-delaware-blue" />
                4. Subscription Plans and Payment
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  <strong>4.1 Subscription Tiers:</strong> We offer three subscription tiers: Looker (Free), Pro, and Whale. 
                  Each tier includes different features and usage limits as described on our Pricing page.
                </p>
                <p>
                  <strong>4.2 Billing:</strong> Paid subscriptions are billed monthly in advance. By subscribing, 
                  you authorize us to charge your payment method on a recurring basis until you cancel.
                </p>
                <p>
                  <strong>4.3 Cancellation:</strong> You may cancel your subscription at any time through your account 
                  dashboard or by contacting support. Cancellations take effect at the end of the current billing period.
                </p>
                <p>
                  <strong>4.4 Refund Policy:</strong> We offer a 30-day money-back guarantee for first-time subscribers. 
                  Refund requests must be submitted within 30 days of initial purchase. Subsequent renewals are non-refundable.
                </p>
                <p>
                  <strong>4.5 Price Changes:</strong> We reserve the right to change subscription prices with 30 days 
                  advance notice. Existing subscribers will be grandfathered at their current rate for 90 days.
                </p>
                <p>
                  <strong>4.6 Failed Payments:</strong> If payment fails, we will attempt to charge your payment method 
                  for up to 7 days. After 7 days, your account will be downgraded to the Free tier.
                </p>
              </div>
            </section>

            {/* 5. Data Accuracy Disclaimer */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-delaware-blue" />
                5. Data Accuracy and Disclaimer
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                  <p className="text-yellow-800 font-semibold mb-2">
                    CRITICAL LEGAL DISCLAIMER - PLEASE READ CAREFULLY
                  </p>
                  <div className="text-yellow-800 space-y-2">
                    <p>
                      <strong>5.1 Informational Purposes Only:</strong> All zoning information provided through the Service 
                      is for informational and reference purposes only. It should NOT be relied upon as the sole basis for 
                      any property purchase, development, construction, or investment decision.
                    </p>
                    <p>
                      <strong>5.2 No Professional Advice:</strong> The Service does not provide legal, architectural, 
                      engineering, or professional zoning advice. Nothing on this platform should be construed as such advice.
                    </p>
                    <p>
                      <strong>5.3 Data Limitations:</strong> While we strive for accuracy, zoning information is:
                    </p>
                    <ul className="list-disc list-inside ml-4">
                      <li>Subject to change without notice by local authorities</li>
                      <li>Based on our interpretation of public records and may contain errors</li>
                      <li>Not a substitute for official zoning verification from local authorities</li>
                      <li>May be incomplete or missing certain overlays, conditions, or variances</li>
                    </ul>
                  </div>
                </div>
                <p>
                  <strong>5.4 Verification Required:</strong> Before making any property-related decisions, you MUST:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Verify all information with the appropriate local zoning office or planning department</li>
                  <li>Consult with licensed professionals (attorneys, architects, engineers, surveyors)</li>
                  <li>Obtain official zoning verification letters and certificates from the municipality</li>
                  <li>Review current zoning ordinances, comprehensive plans, and any recent amendments</li>
                  <li>Investigate any special conditions, variances, or non-conforming use status</li>
                </ul>
              </div>
            </section>

            {/* 6. Acceptable Use */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-delaware-blue" />
                6. Acceptable Use Policy
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>You agree NOT to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the Service for any illegal purpose or in violation of any laws</li>
                  <li>Scrape, crawl, or systematically download data from the Service</li>
                  <li>Attempt to gain unauthorized access to our systems or user accounts</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Upload viruses, malware, or malicious code</li>
                  <li>Impersonate another person or entity</li>
                  <li>Share your account credentials with others</li>
                  <li>Resell or redistribute our data without written permission</li>
                  <li>Use automated tools to access the Service beyond normal human use</li>
                </ul>
                <p>
                  Violation of this policy may result in immediate account termination without refund.
                </p>
              </div>
            </section>

            {/* 7. Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-delaware-blue" />
                7. Intellectual Property Rights
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  The Service, including all content, features, design, and functionality, is owned by Delaware Zoning 
                  and is protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  You are granted a limited, non-exclusive, non-transferable license to access and use the Service 
                  for your personal or business purposes in accordance with these Terms.
                </p>
                <p>
                  Zoning data itself is public information. However, our compilation, organization, presentation, 
                  and interpretation of that data is our proprietary work product.
                </p>
              </div>
            </section>

            {/* 8. Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-delaware-blue" />
                8. Limitation of Liability
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                  <p className="text-red-800 font-semibold uppercase mb-2">
                    IMPORTANT - PLEASE READ CAREFULLY
                  </p>
                  <div className="text-red-800 space-y-2">
                    <p>
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, DELAWARE ZONING SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                      INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, 
                      WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER 
                      INTANGIBLE LOSSES.
                    </p>
                    <p>
                      THIS INCLUDES BUT IS NOT LIMITED TO DAMAGES ARISING FROM:
                    </p>
                    <ul className="list-disc list-inside ml-4">
                      <li>Reliance on information provided through the Service</li>
                      <li>Errors, omissions, or inaccuracies in zoning data</li>
                      <li>Property purchase or development decisions made based on our information</li>
                      <li>Inability to access or use the Service</li>
                      <li>Unauthorized access to your account</li>
                    </ul>
                    <p>
                      OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 9. Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-delaware-blue" />
                9. Indemnification
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  You agree to indemnify, defend, and hold harmless Delaware Zoning, its officers, directors, employees, 
                  and agents from any claims, liabilities, damages, losses, and expenses (including reasonable attorney fees) 
                  arising from:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your use or misuse of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any rights of another party</li>
                  <li>Any decisions or actions you take based on information from the Service</li>
                </ul>
              </div>
            </section>

            {/* 10. Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-delaware-blue" />
                10. Termination
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  We may suspend or terminate your access to the Service at any time, with or without cause, 
                  with or without notice, effective immediately.
                </p>
                <p>
                  Upon termination, your right to use the Service will immediately cease. All provisions of these 
                  Terms that by their nature should survive termination shall survive, including ownership provisions, 
                  warranty disclaimers, and limitations of liability.
                </p>
              </div>
            </section>

            {/* 11. Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-delaware-blue" />
                11. Dispute Resolution and Governing Law
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  <strong>11.1 Governing Law:</strong> These Terms shall be governed by and construed in accordance 
                  with the laws of the State of Delaware, without regard to its conflict of law provisions.
                </p>
                <p>
                  <strong>11.2 Arbitration:</strong> Any dispute arising from these Terms or the Service shall be 
                  resolved through binding arbitration in accordance with the American Arbitration Association rules, 
                  conducted in Delaware. You waive your right to a jury trial.
                </p>
                <p>
                  <strong>11.3 Class Action Waiver:</strong> You agree to resolve disputes individually and waive 
                  your right to participate in class actions or class arbitrations.
                </p>
              </div>
            </section>

            {/* 12. Changes to Service */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-delaware-blue" />
                12. Changes to Service
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
                <p>
                  We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, 
                  with or without notice. We shall not be liable to you or any third party for any modification, 
                  suspension, or discontinuance of the Service.
                </p>
              </div>
            </section>

            {/* 13. Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="text-delaware-blue" />
                13. Contact Information
              </h2>
              <div className="prose prose-blue max-w-none text-gray-700">
                <p>
                  For questions about these Terms or the Service, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="font-semibold">Delaware Zoning</p>
                  <p>Email: legal@delawarezoning.com</p>
                  <p>Support: support@delawarezoning.com</p>
                </div>
              </div>
            </section>

            {/* Acknowledgment */}
            <section className="border-t pt-6 mt-8">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
                <p className="text-blue-900 font-semibold mb-2">
                  Acknowledgment
                </p>
                <p className="text-blue-800 text-sm">
                  BY USING DELAWARE ZONING, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY 
                  THESE TERMS OF SERVICE. IF YOU DO NOT AGREE, PLEASE DO NOT USE THE SERVICE.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
