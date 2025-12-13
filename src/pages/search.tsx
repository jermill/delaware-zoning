import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import SearchResults from '@/components/search/SearchResults';
import PropertyDetailsModal from '@/components/dashboard/PropertyDetailsModal';
import { useZoningSearch } from '@/hooks/useZoningSearch';
import { useAuth } from '@/contexts/AuthContext';
import { FiHome, FiChevronRight, FiAlertCircle, FiLoader } from 'react-icons/fi';
import SEOHead from '@/components/seo/SEOHead';
import BreadcrumbSchema from '@/components/seo/schemas/BreadcrumbSchema';

export default function SearchPage() {
  const router = useRouter();
  const { address, lat, lon } = router.query;
  const { data, loading, error, search } = useZoningSearch();
  const { user, subscription } = useAuth();
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Get user tier - map from subscription tier to component tier
  const userTier: 'looker' | 'pro' | 'whale' = 
    (subscription?.tier as any) === 'looker' || subscription?.tier === 'free' ? 'looker' :
    (subscription?.tier as any) === 'pro' ? 'pro' :
    (subscription?.tier as any) === 'whale' || subscription?.tier === 'business' ? 'whale' : 'looker';

  // Geocode address if coordinates not provided
  const geocodeAddress = async (addressString: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
      throw new Error('No results found');
    } catch (err) {
      console.error('Geocoding error:', err);
      return null;
    }
  };

  // Execute search when query params are available
  useEffect(() => {
    const executeSearch = async () => {
      if (!address) return;

      // If we have coordinates, use them directly
      if (lat && lon) {
        const latitude = parseFloat(lat as string);
        const longitude = parseFloat(lon as string);
        
        if (!isNaN(latitude) && !isNaN(longitude)) {
          search(address as string, latitude, longitude);
          return;
        }
      }

      // Otherwise, geocode the address
      console.log('[SearchPage] No coordinates provided, geocoding address:', address);
      const coords = await geocodeAddress(address as string);
      
      if (coords) {
        console.log('[SearchPage] Geocoded coordinates:', coords);
        search(address as string, coords.lat, coords.lng);
      } else {
        console.error('[SearchPage] Failed to geocode address');
        // The search hook will handle the error state
      }
    };

    executeSearch();
  }, [address, lat, lon]);

  const handleSaveProperty = async () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(router.asPath));
      return;
    }

    if (!data) return;

    try {
      const response = await fetch('/api/properties/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`, // In production, use actual JWT token
        },
        body: JSON.stringify({
          property_id: `${data.coordinates.latitude}-${data.coordinates.longitude}`,
          parcel_id: data.zoning.id,
          address: data.address || `${data.coordinates.latitude}, ${data.coordinates.longitude}`,
          city: data.zoning.municipality || data.zoning.county,
          county: data.zoning.county,
          zip_code: null,
          zoning_district: data.zoning.districtCode,
          permitted_uses: data.permittedUses,
          dimensional_standards: data.dimensionalStandards,
        }),
      });

      if (response.ok) {
        alert('Property saved successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to save property');
      }
    } catch (err) {
      console.error('Error saving property:', err);
      alert('Failed to save property');
    }
  };

  // Transform data for PropertyDetailsModal
  const modalProperty = data ? {
    id: data.zoning.id,
    address: data.address || `${data.coordinates.latitude}, ${data.coordinates.longitude}`,
    zoneCode: data.zoning.districtCode,
    zoneName: data.zoning.name,
    county: data.zoning.county as 'New Castle' | 'Kent' | 'Sussex',
    city: data.zoning.municipality || data.zoning.county,
    municipality: data.zoning.municipality || undefined,
    dateSaved: new Date().toISOString(),
    dimensionalStandards: data.dimensionalStandards ? {
      frontSetback: data.dimensionalStandards.frontSetback,
      sideSetback: data.dimensionalStandards.sideSetback,
      rearSetback: data.dimensionalStandards.rearSetback,
      maxHeight: data.dimensionalStandards.maxHeight,
      minLotArea: data.dimensionalStandards.minLotArea,
      minLotWidth: data.dimensionalStandards.minLotWidth,
      far: data.dimensionalStandards.far,
      lotCoverage: 50,
    } : undefined,
    parkingRequirements: data.dimensionalStandards ? {
      ratio: data.dimensionalStandards.parkingRatio?.toString() || 'N/A',
      notes: data.dimensionalStandards.parkingNotes || '',
    } : undefined,
    permittedUses: data.permittedUses.map(use => ({
      category: use.category,
      description: use.type,
      type: (use.status === 'not_allowed' ? 'prohibited' : use.status) as 'allowed' | 'conditional' | 'prohibited',
      conditions: use.conditions || undefined,
    })),
    floodZone: data.floodZone ? {
      femaZone: data.floodZone.femaZone,
      floodRisk: data.floodZone.floodRisk as any,
      description: data.floodZone.description,
    } : undefined,
    requiredPermits: data.requiredPermits.map(permit => ({
      type: permit.type,
      description: permit.description,
      processingTime: undefined,
      estimatedCost: undefined,
    })),
    lastVerified: data.zoning.lastVerified || undefined,
  } : null;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="flex items-center text-gray-600 hover:text-delaware-blue transition-colors">
                  <FiHome className="w-4 h-4" />
                  <span className="ml-1">Home</span>
                </Link>
              </li>
              <FiChevronRight className="w-4 h-4 text-gray-400" />
              <li className="text-gray-900 font-medium">Search Results</li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Property Zoning Search
            </h1>
            <p className="text-gray-600">
              Comprehensive zoning information for Delaware properties
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <FiLoader className="w-12 h-12 text-delaware-blue animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Searching...</h3>
              <p className="text-gray-600">
                Looking up zoning information for <span className="font-medium">{address}</span>
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 rounded-xl border-2 border-red-200 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Failed</h3>
              <p className="text-gray-700 mb-6 max-w-md mx-auto">{error}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-delaware-blue text-white rounded-lg font-semibold hover:bg-blue-800 transition-all"
                >
                  Try Another Search
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  View Plans
                </Link>
              </div>
            </div>
          )}

          {/* Results */}
          {data && !loading && !error && (
            <>
              <SearchResults
                data={data}
                onViewDetails={() => setShowDetailsModal(true)}
                onSaveProperty={user ? handleSaveProperty : undefined}
                userTier={userTier}
              />

              {/* Additional Info */}
              <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Need More Information?
                    </h3>
                    <p className="text-gray-700 mb-4">
                      This search shows basic zoning information. Upgrade to unlock comprehensive details including:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-delaware-blue rounded-full"></div>
                        Detailed dimensional standards and setback requirements
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-delaware-blue rounded-full"></div>
                        Required permits with processing times and costs
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-delaware-blue rounded-full"></div>
                        Direct contact information for local zoning offices
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-delaware-blue rounded-full"></div>
                        PDF export capabilities for reports and presentations
                      </li>
                    </ul>
                    <div className="mt-4">
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 px-5 py-2 bg-delaware-gold text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all text-sm"
                      >
                        View Upgrade Options
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* No Query State */}
          {!address && !loading && router.isReady && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Search Query</h3>
              <p className="text-gray-600 mb-6">
                Please enter an address to search for zoning information
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-delaware-blue text-white rounded-lg font-semibold hover:bg-blue-800 transition-all"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Property Details Modal */}
      {modalProperty && (
        <PropertyDetailsModal
          property={modalProperty}
          userTier={userTier}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </Layout>
  );
}


