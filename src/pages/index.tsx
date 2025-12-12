import Layout from '@/components/layout/Layout';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import UseCases from '@/components/landing/UseCases';
import Coverage from '@/components/landing/Coverage';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <Coverage />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </Layout>
  );
}
