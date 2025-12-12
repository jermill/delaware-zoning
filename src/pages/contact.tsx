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
        <div className="min-h-screen bg-delaware-cream py-12 sm:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-overline text-delaware-gold mb-3">Get in Touch</p>
              <h1 className="text-section-heading text-delaware-navy mb-4">Contact Us</h1>
              <p className="text-lg text-gray-600">We're here to help with any questions about Delaware zoning</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="card-elevated">
                <h2 className="text-card-heading text-delaware-navy mb-6">Get in Touch</h2>
                
                <div className="space-y-5">
                  <div>
                    <h3 className="font-bold text-delaware-navy mb-2">Email Support</h3>
                    <a href="mailto:support@delawarezoning.com" className="text-delaware-blue hover:text-delaware-gold transition-colors font-semibold">
                      support@delawarezoning.com
                    </a>
                    <p className="text-sm text-gray-600 mt-1">We typically respond within 24 hours</p>
                  </div>

                  <div className="h-px bg-delaware-sage/20"></div>

                  <div>
                    <h3 className="font-bold text-delaware-navy mb-2">Sales Inquiries</h3>
                    <a href="mailto:sales@delawarezoning.com" className="text-delaware-blue hover:text-delaware-gold transition-colors font-semibold">
                      sales@delawarezoning.com
                    </a>
                    <p className="text-sm text-gray-600 mt-1">For team plans and enterprise pricing</p>
                  </div>

                  <div className="h-px bg-delaware-sage/20"></div>

                  <div>
                    <h3 className="font-bold text-delaware-navy mb-2">Business Hours</h3>
                    <p className="text-gray-700">Monday - Friday: 9 AM - 5 PM EST</p>
                    <p className="text-sm text-gray-600 mt-1">Weekend support via email only</p>
                  </div>
                </div>
              </div>

              {/* Quick Help */}
              <div className="card-elevated bg-delaware-sage/10">
                <h2 className="text-card-heading text-delaware-navy mb-6">Quick Help</h2>
                
                <div className="space-y-5">
                  <div>
                    <h3 className="font-bold text-delaware-navy mb-2 flex items-center gap-2">
                      <span className="text-xl">📚</span> Documentation
                    </h3>
                    <p className="text-sm text-gray-700">Check our guides and FAQs on the homepage</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-delaware-navy mb-2 flex items-center gap-2">
                      <span className="text-xl">🏛️</span> County Resources
                    </h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><strong>New Castle County:</strong> (302) 395-5400</p>
                      <p><strong>Sussex County:</strong> (302) 855-7878</p>
                      <p><strong>Kent County:</strong> (302) 744-2471</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-delaware-navy mb-2 flex items-center gap-2">
                      <span className="text-xl">💳</span> Billing Support
                    </h3>
                    <p className="text-sm text-gray-700">Manage your subscription from your dashboard or email us</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center mt-12">
              <a 
                href="/" 
                className="btn-secondary"
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
