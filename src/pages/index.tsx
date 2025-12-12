import Layout from '@/components/layout/Layout';
import Hero from '@/components/landing/Hero';
import SocialProof from '@/components/landing/SocialProof';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
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
        {/* Hero with search - primary conversion point */}
        <Hero />
        
        {/* Social proof immediately after hero */}
        <SocialProof />
        
        {/* Simple 3-step process */}
        <HowItWorks />
        
        {/* Pricing - key conversion section */}
        <Pricing />
        
        {/* FAQ - overcome objections */}
        <FAQ />
        
        {/* Final CTA - last chance conversion */}
        <FinalCTA />
      </Layout>
    </>
  );
}
