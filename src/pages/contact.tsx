import Layout from '@/components/layout/Layout';

export default function Contact() {
  return (
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
  );
}

