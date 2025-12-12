import Layout from '@/components/layout/Layout';
import DataDisclaimerBanner from '@/components/common/DataDisclaimerBanner';

export default function DataDisclaimer() {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-6xl mb-4 block">ℹ️</span>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Data Sources & Accuracy
              </h1>
              <p className="text-xl text-gray-600">
                Official Delaware county zoning data with important verification guidelines
              </p>
            </div>
            
            <DataDisclaimerBanner variant="prominent" className="mt-8" />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Data Sources */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Official Data Sources
            </h2>
            <div className="prose prose-lg text-gray-700">
              <p>
                Delaware Zoning sources its data directly from <strong>official Delaware county GIS systems</strong> 
                through their public ArcGIS REST APIs. Our platform provides real-time access to the same zoning 
                data used by county planning departments.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
                <h3 className="font-bold text-blue-900 mb-3 text-lg">Current Coverage:</h3>
                <ul className="space-y-2 text-gray-800">
                  <li>✓ <strong>New Castle County:</strong> 999 verified zoning districts from official ArcGIS REST API</li>
                  <li>✓ <strong>Sussex County:</strong> 63 verified zoning districts from official ArcGIS REST API</li>
                  <li>⏳ <strong>Kent County:</strong> Integration in progress - coming soon</li>
                  <li>✓ <strong>FEMA Flood Zones:</strong> Official National Flood Hazard Layer data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Status by County */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Data Status by County
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-3 font-bold text-gray-900">Data Type</th>
                    <th className="text-left py-3 font-bold text-gray-900">Status</th>
                    <th className="text-left py-3 font-bold text-gray-900">Source & Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 text-gray-800 font-semibold">New Castle County Zoning</td>
                    <td className="py-3">
                      <span className="inline-block bg-green-200 text-green-900 px-2 py-1 rounded text-xs font-bold">
                        LIVE ✓
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">999 districts via official ArcGIS REST API</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-800 font-semibold">Sussex County Zoning</td>
                    <td className="py-3">
                      <span className="inline-block bg-green-200 text-green-900 px-2 py-1 rounded text-xs font-bold">
                        LIVE ✓
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">63 districts via official ArcGIS REST API</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-800">Kent County Zoning</td>
                    <td className="py-3">
                      <span className="inline-block bg-amber-200 text-amber-900 px-2 py-1 rounded text-xs font-bold">
                        PENDING
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">Integration in progress - coming soon</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-800 font-semibold">FEMA Flood Zones</td>
                    <td className="py-3">
                      <span className="inline-block bg-green-200 text-green-900 px-2 py-1 rounded text-xs font-bold">
                        LIVE ✓
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">National Flood Hazard Layer (official federal data)</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-gray-800">Detailed Regulations</td>
                    <td className="py-3">
                      <span className="inline-block bg-blue-200 text-blue-900 px-2 py-1 rounded text-xs font-bold">
                        EXPANDING
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">Permitted uses, setbacks, and requirements being added progressively</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> While our zoning district boundaries are sourced from official county GIS systems, 
                detailed regulations (permitted uses, dimensional standards, permit requirements) are being added progressively. 
                Always verify specific requirements with the appropriate county planning office before making property decisions.
              </p>
            </div>
          </section>

          {/* Important Disclaimers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-amber-600 mb-4">
              ⚠️ Important: Always Verify Before Acting
            </h2>
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-6">
              <p className="text-gray-800 mb-4 font-semibold">
                While our data comes from official sources, zoning regulations can change frequently. 
                Always verify with the appropriate county planning office before:
              </p>
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Purchasing property</strong> - Confirm zoning status and any pending changes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Applying for permits</strong> - Verify current dimensional standards and requirements</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Making financial commitments</strong> - Ensure proposed use is currently permitted</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Submitting development plans</strong> - Use official county zoning maps for legal submissions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 font-bold">•</span>
                  <span><strong>Advising clients</strong> - Real estate professionals should verify all information independently</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-amber-300">
                <p className="text-sm text-gray-700">
                  <strong>Legal Notice:</strong> Delaware Zoning provides information for preliminary research and planning purposes only. 
                  This information does not constitute legal, financial, or professional advice. Zoning regulations are subject to change, 
                  and interpretations may vary. Always consult with appropriate county officials and qualified professionals before making 
                  property-related decisions.
                </p>
              </div>
            </div>
          </section>

          {/* How to Use This Tool */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              ✓ How to Use Delaware Zoning Effectively
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <ul className="space-y-3 text-gray-800">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Preliminary research</strong> - Quickly identify zoning districts for properties you're considering</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Property comparison</strong> - Compare zoning requirements across multiple locations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Due diligence starting point</strong> - Use as a first step before contacting planning offices</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Site selection</strong> - Filter potential properties by zoning characteristics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Client education</strong> - Help clients understand zoning basics (with verification)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>Time savings</strong> - Reduce trips to county offices by pre-screening properties</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span><strong>PDF reports</strong> - Generate professional reports for your records (subject to verification)</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-green-300">
                <p className="text-sm text-gray-700">
                  <strong>Best Practice:</strong> Use Delaware Zoning for initial research and property screening, 
                  then verify all critical information directly with the appropriate county planning office before making decisions.
                </p>
              </div>
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

          {/* Data Updates & Accuracy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Data Updates & Maintenance
            </h2>
            <div className="prose prose-lg text-gray-700">
              <p>
                We maintain data accuracy through regular synchronization with county GIS systems and continuous monitoring 
                of regulatory updates.
              </p>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mt-4">
                <h3 className="font-bold text-gray-900 mb-3 text-base">Update Schedule:</h3>
                <ul className="space-y-2 text-gray-800 text-base">
                  <li><strong>Zoning District Boundaries:</strong> Synced daily from county GIS APIs</li>
                  <li><strong>Flood Zone Data:</strong> Updated quarterly from FEMA</li>
                  <li><strong>Regulatory Details:</strong> Monitored continuously, updated as changes are identified</li>
                  <li><strong>Municipal Ordinances:</strong> Reviewed monthly for amendments</li>
                </ul>
              </div>
              <p className="mt-4">
                <strong>Data Limitations:</strong> While we strive for accuracy, there may be brief delays between when 
                counties update their systems and when changes appear in our platform. Additionally, some detailed 
                regulations (specific permitted uses, dimensional standards) are being added progressively county by county.
              </p>
              <div className="bg-blue-50 border border-blue-300 rounded-lg p-5 mt-4">
                <h3 className="font-bold text-blue-900 mb-2 text-base">Coming Soon:</h3>
                <ul className="space-y-1 text-gray-800 text-base">
                  <li>• Kent County zoning district integration</li>
                  <li>• Enhanced municipal overlay district data</li>
                  <li>• Historical zoning change tracking</li>
                  <li>• Pending zoning amendment notifications</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Questions */}
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 text-center border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Questions About Our Data?
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              If you have questions about our data sources, found a discrepancy, or need help understanding 
              zoning information for a specific property, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Contact Support
              </a>
              <a 
                href="mailto:support@delawarezoning.com" 
                className="inline-block bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Email Us
              </a>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Found an error? We appreciate user feedback to improve data accuracy.
            </p>
          </section>

        </div>
      </div>
    </Layout>
  );
}

