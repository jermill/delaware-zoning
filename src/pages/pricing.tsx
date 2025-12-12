import Layout from '@/components/layout/Layout';
import Pricing from '@/components/landing/Pricing';
import FinalCTA from '@/components/landing/FinalCTA';

export default function PricingPage() {
  return (
    <Layout>
      <div className="bg-white">
        <Pricing />
        <FinalCTA />
      </div>
    </Layout>
  );
}

