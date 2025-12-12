import Layout from '@/components/layout/Layout';
import SEOHead from '@/components/seo/SEOHead';
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema';

export default function Contact() {
  return (
    <>
      <SEOHead
        title="Contact Us | Delaware Zoning"
        description="Get in touch with Delaware Zoning. Questions about zoning codes, subscription plans, or technical support? We're here to help."
        keywords="Delaware zoning contact, zoning support, customer service"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ]}
      />
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-delaware-blue mb-4">Contact Us</h1>
              <p className="text-lg text-gray-600">We're here to help with any questions about Delaware zoning</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                    <a href="mailto:support@delawarezoning.com" className="text-delaware-blue hover:text-delaware-gold transition-colors">
                      support@delawarezoning.com
                    </a>
                    <p className="text-sm text-gray-600 mt-1">We typically respond within 24 hours</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sales Inquiries</h3>
                    <a href="mailto:sales@delawarezoning.com" className="text-delaware-blue hover:text-delaware-gold transition-colors">
                      sales@delawarezoning.com
                    </a>
                    <p className="text-sm text-gray-600 mt-1">For team plans and enterprise pricing</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                    <p className="text-gray-700">Monday - Friday: 9 AM - 5 PM EST</p>
                    <p className="text-sm text-gray-600 mt-1">Weekend support via email only</p>
                  </div>
                </div>
              </div>

              {/* Quick Help */}
              <div className="bg-blue-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Help</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">📚 Documentation</h3>
                    <p className="text-sm text-gray-700">Check our guides and FAQs on the homepage</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">🏛️ County Resources</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><strong>New Castle County:</strong> (302) 395-5400</p>
                      <p><strong>Sussex County:</strong> (302) 855-7878</p>
                      <p><strong>Kent County:</strong> (302) 744-2471</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">💳 Billing Support</h3>
                    <p className="text-sm text-gray-700">Manage your subscription from your dashboard or email us</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center mt-12">
              <a 
                href="/" 
                className="inline-block px-8 py-3 bg-delaware-blue text-white font-semibold rounded-xl hover:bg-opacity-90 transition-all"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

