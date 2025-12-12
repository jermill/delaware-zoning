import Layout from '@/components/layout/Layout';
import Pricing from '@/components/landing/Pricing';
import FinalCTA from '@/components/landing/FinalCTA';

export default function PricingPage() {
  return (
    <Layout>
      <div className="pt-8">
        <div className="text-center section-container">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pricing Plans
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that fits your needs
          </p>
        </div>
        <Pricing />
        <FinalCTA />
      </div>
    </Layout>
  );
}
