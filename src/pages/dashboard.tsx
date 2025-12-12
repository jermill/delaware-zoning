import Layout from '@/components/layout/Layout';
import { FiSearch, FiBookmark, FiUser } from 'react-icons/fi';

export default function Dashboard() {
  return (
    <Layout>
      <div className="section-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your properties and account
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Searches This Month</p>
                <p className="text-3xl font-bold text-gray-900">0 / 5</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiSearch className="w-6 h-6 text-delaware-blue" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Saved Properties</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiBookmark className="w-6 h-6 text-delaware-blue" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Current Plan</p>
                <p className="text-3xl font-bold text-gray-900">Free</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiUser className="w-6 h-6 text-delaware-blue" />
              </div>
            </div>
          </div>
        </div>

        {/* Saved Properties */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Saved Properties
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <FiBookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                You haven't saved any properties yet
              </p>
              <a href="/" className="btn-primary inline-block">
                Search Properties
              </a>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            <strong>Note:</strong> This is a preview. Full dashboard functionality will be available once backend integration is complete.
          </p>
        </div>
      </div>
    </Layout>
  );
}
