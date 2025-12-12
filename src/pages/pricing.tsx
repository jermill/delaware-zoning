import Layout from '@/components/layout/Layout';
import Pricing from '@/components/landing/Pricing';
import FinalCTA from '@/components/landing/FinalCTA';
import SEOHead from '@/components/seo/SEOHead';
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema';

export default function PricingPage() {
  return (
    <>
      <SEOHead
        title="Pricing Plans | Delaware Zoning Lookup"
        description="Affordable zoning lookup plans for Delaware real estate professionals. Free trial with 5 searches. Basic plan $19/month for unlimited searches. Pro plan $49/month with PDF exports."
        keywords="Delaware zoning pricing, zoning lookup cost, real estate tools Delaware, zoning subscription"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Pricing', url: '/pricing' },
        ]}
      />
      
      <Layout>
        <div className="bg-white">
          <Pricing />
          <FinalCTA />
        </div>
      </Layout>
    </>
  );
}

