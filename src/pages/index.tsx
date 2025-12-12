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

export default function Home() {
  return (
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
  );
}

