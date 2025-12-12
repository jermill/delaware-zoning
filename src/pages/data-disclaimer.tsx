import Layout from '@/components/layout/Layout';
import DataDisclaimerBanner from '@/components/common/DataDisclaimerBanner';

export default function DataDisclaimer() {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-amber-50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-6xl mb-4 block">⚠️</span>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Development Data Notice
              </h1>
              <p className="text-xl text-gray-600">
                Important information about the data used in this application
              </p>
            </div>
            
            <DataDisclaimerBanner variant="prominent" className="mt-8" />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* What is Mock Data */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What is "Mock Data"?
            </h2>
            <div className="prose prose-lg text-gray-700">
              <p>
                Delaware Zoning is currently in <strong>active development</strong>. To enable immediate 
                feature development, testing, and demonstrations, we've created a <strong>mock dataset</strong> that 
                simulates real Delaware zoning information.
              </p>
              <p className="mt-4">
                This mock data is based on publicly available Delaware zoning ordinances and follows realistic 
                patterns, but it has <strong>not been verified</strong> with county planning offices and should 
                <strong> never be used</strong> for actual property decisions.
              </p>
            </div>
          </section>

          {/* What's Mock vs Real */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What Data is Mock vs. Real?
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 font-bold text-gray-900">Data Type</th>
                    <th className="text-left py-3 font-bold text-gray-900">Status</th>
                    <th className="text-left py-3 font-bold text-gray-900">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 text-gray-800">Zoning District Codes</td>
                    <td className="py-3">
                      <span className="inline-block bg-amber-200 text-amber-900 px-2 py-1 rounded text-xs font-bold">
                        MOCK
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">85% - Based on real code structures</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-800">Zone Boundaries (Geography)</td>
                    <td className="py-3">
                      <span className="inline-block bg-amber-200 text-amber-900 px-2 py-1 rounded text-xs font-bold">
                        MOCK
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">50% - Approximate areas only</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-800">Permitted Uses</td>
                    <td className="py-3">
                      <span className="inline-block bg-amber-200 text-amber-900 px-2 py-1 rounded text-xs font-bold">
                        MOCK
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">70% - Typical zoning patterns</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-800">Dimensional Standards (Setbacks, Heights)</td>
                    <td className="py-3">
                      <span className="inline-block bg-amber-200 text-amber-900 px-2 py-1 rounded text-xs font-bold">
                        MOCK
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">75% - Realistic but not verified</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-800">Permit Requirements</td>
                    <td className="py-3">
                      <span className="inline-block bg-amber-200 text-amber-900 px-2 py-1 rounded text-xs font-bold">
                        MOCK
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">80% - General requirements</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-800 font-bold">FEMA Flood Zones</td>
                    <td className="py-3">
                      <span className="inline-block bg-green-200 text-green-900 px-2 py-1 rounded text-xs font-bold">
                        REAL ✓
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">100% - Official FEMA data</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-800 font-bold">Test Addresses</td>
                    <td className="py-3">
                      <span className="inline-block bg-green-200 text-green-900 px-2 py-1 rounded text-xs font-bold">
                        REAL ✓
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">100% - Real Delaware locations</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* What You Should NOT Do */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              ❌ What You Should NOT Do With This Data
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Purchase property</strong> based on zoning information shown here</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Apply for permits</strong> using dimensional standards from this site</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Make financial decisions</strong> based on permitted uses shown</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Advise clients</strong> as a realtor or professional using this data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Submit plans</strong> to county planning offices with this information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span><strong>Rely on zone boundaries</strong> for legal property descriptions</span>
                </li>
              </ul>
            </div>
          </section>

          {/* What You CAN Do */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              ✓ What You CAN Do With This Data
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Understand the app</strong> and how it will work when real data is integrated</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Test features</strong> like search, save properties, and PDF export</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Demonstrate to investors</strong> what the platform will offer (with clear disclaimers)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Provide feedback</strong> on user experience and feature design</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Get familiar</strong> with Delaware zoning concepts and terminology</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Official Sources */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📞 Where to Get Official Zoning Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h3 className="font-bold text-blue-900 mb-2">New Castle County</h3>
                <p className="text-sm text-gray-700 mb-3">Planning Division</p>
                <p className="text-sm text-gray-800">
                  📞 <strong>(302) 395-5400</strong><br/>
                  🌐 <a href="https://www.newcastlede.gov/184/Planning-Development" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" rel="noopener noreferrer">
                    newcastlede.gov/planning
                  </a><br/>
                  📍 87 Reads Way, New Castle, DE 19720
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h3 className="font-bold text-blue-900 mb-2">City of Wilmington</h3>
                <p className="text-sm text-gray-700 mb-3">Department of Land Use & Planning</p>
                <p className="text-sm text-gray-800">
                  📞 <strong>(302) 576-3050</strong><br/>
                  📧 luppermits@wilmingtonde.gov<br/>
                  📍 800 N. French Street, 3rd Floor
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h3 className="font-bold text-blue-900 mb-2">Kent County</h3>
                <p className="text-sm text-gray-700 mb-3">Planning Services</p>
                <p className="text-sm text-gray-800">
                  📞 <strong>(302) 744-2471</strong><br/>
                  🌐 <a href="https://www.co.kent.de.us/departments/community-services/planning-services" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" rel="noopener noreferrer">
                    co.kent.de.us/planning
                  </a>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h3 className="font-bold text-blue-900 mb-2">Sussex County</h3>
                <p className="text-sm text-gray-700 mb-3">Planning & Zoning</p>
                <p className="text-sm text-gray-800">
                  📞 <strong>(302) 855-7878</strong><br/>
                  🌐 <a href="https://sussexcountyde.gov/departments/county-administrative-offices/planning-zoning" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" rel="noopener noreferrer">
                    sussexcountyde.gov/planning
                  </a>
                </p>
              </div>

            </div>
          </section>

          {/* When Will Real Data Be Available */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              When Will Real Data Be Available?
            </h2>
            <div className="prose prose-lg text-gray-700">
              <p>
                We are actively working to integrate official zoning data from Delaware counties. 
                Our roadmap:
              </p>
              <ol className="list-decimal list-inside space-y-2 mt-4">
                <li><strong>Phase 1:</strong> Complete MVP development with mock data (Current)</li>
                <li><strong>Phase 2:</strong> Contact New Castle County for official data (Next)</li>
                <li><strong>Phase 3:</strong> Integrate real New Castle County data</li>
                <li><strong>Phase 4:</strong> Expand to Kent, Sussex, and municipal data</li>
              </ol>
              <p className="mt-4">
                <strong>Estimated timeline:</strong> Real data for at least one county within 2-3 months 
                of MVP launch. Full Delaware coverage within 6 months.
              </p>
              <p className="mt-4">
                Once real data is integrated, we will:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Remove these disclaimer banners (for verified counties)</li>
                <li>Add "Last Verified" dates to all data</li>
                <li>Establish regular update schedules with counties</li>
                <li>Display clear data source attribution</li>
              </ul>
            </div>
          </section>

          {/* Questions */}
          <section className="bg-gray-100 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Questions About Our Data?
            </h2>
            <p className="text-gray-700 mb-6">
              If you have questions about our data sources, accuracy, or integration plans, 
              we're happy to help.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Contact Us
            </a>
          </section>

        </div>
      </div>
    </Layout>
  );
}
