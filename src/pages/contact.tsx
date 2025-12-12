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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-delaware-blue mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 mb-8">Coming Soon</p>
            <a href="/" className="text-delaware-blue hover:underline">
              ← Back to Home
            </a>
          </div>
        </div>
      </Layout>
    </>
  );
}

