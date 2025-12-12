import Layout from '@/components/layout/Layout';

export default function Terms() {
  return (
    <Layout>
      <div className="section-container">
        <div className="max-w-4xl mx-auto prose">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> This is a placeholder page. Complete terms of service will be added before launch.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using Delaware Zoning, you accept and agree to be bound by these Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Use of Service</h2>
            <p className="text-gray-600 mb-4">
              Delaware Zoning provides zoning information for Delaware properties. All information should be verified with local zoning offices before making final decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
            <p className="text-gray-600 mb-4">
              While we strive for accuracy, zoning information is provided "as is" without warranty. Always consult with local authorities for official determinations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-600">
              Questions about these terms? Please contact us.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
