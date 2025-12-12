import Layout from '@/components/layout/Layout';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import UseCases from '@/components/landing/UseCases';
import Coverage from '@/components/landing/Coverage';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import DataDisclaimerBanner from '@/components/common/DataDisclaimerBanner';
import SEOHead from '@/components/seo/SEOHead';
import SoftwareSchema from '@/components/seo/schemas/SoftwareSchema';
import OrganizationSchema from '@/components/seo/schemas/OrganizationSchema';

export default function Home() {
  return (
    <>
      <SEOHead
        title="Delaware Zoning Lookup | Instant Zoning Codes & Permits"
        description="Search any Delaware address to instantly see zoning codes, permitted uses, setbacks & required permits. Used by 100+ realtors, developers & architects. Free trial with 5 searches/month."
        keywords="Delaware zoning, zoning lookup, New Castle County zoning, Kent County zoning, Sussex County zoning, Delaware zoning code, Delaware zoning map, Delaware permits, zoning ordinance Delaware"
        ogImage="/images/og-image.png"
      />
      <SoftwareSchema />
      <OrganizationSchema />
      
      <Layout>
        <Hero />
        
        {/* Development Data Notice */}
        <div className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DataDisclaimerBanner variant="default" />
          </div>
        </div>
        
        <HowItWorks />
        <Pricing />
        <UseCases />
        <Features />
        <Coverage />
        <FAQ />
        <FinalCTA />
      </Layout>
    </>
  );
}

