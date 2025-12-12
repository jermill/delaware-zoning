import { FiMapPin, FiInfo, FiCheckCircle, FiAlertTriangle, FiExternalLink } from 'react-icons/fi';
import { ZoningData } from '@/hooks/useZoningSearch';
import DataDisclaimer from '@/components/common/DataDisclaimer';

interface SearchResultsProps {
  data: ZoningData;
  onViewDetails: () => void;
  onSaveProperty?: () => void;
  userTier?: 'looker' | 'pro' | 'whale';
}

export default function SearchResults({ data, onViewDetails, onSaveProperty, userTier = 'looker' }: SearchResultsProps) {
  const allowedUses = data.permittedUses.filter(use => use.status === 'allowed');
  const conditionalUses = data.permittedUses.filter(use => use.status === 'conditional');

  return (
    <div className="space-y-6">
      {/* Data Disclaimer */}
      <DataDisclaimer 
        variant="warning"
        lastVerified={data.zoning.lastVerified || undefined}
      />

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-delaware-blue to-blue-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              Zoning Information Found
            </h2>
            {data.address && (
              <p className="text-blue-100 flex items-center gap-2">
                <FiMapPin className="w-4 h-4" />
                {data.address}
              </p>
            )}
          </div>
          {data.zoning.isMock && (
            <div className="ml-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-100 rounded-full text-xs font-medium">
                <FiInfo className="w-3 h-3" />
                Mock Data
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Zone Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-delaware-blue/10 to-blue-100/50 rounded-lg p-4 border border-delaware-blue/20">
            <p className="text-xs text-gray-600 mb-1">Zone Code</p>
            <p className="text-3xl font-bold text-delaware-blue">{data.zoning.districtCode}</p>
          </div>
          <div className="bg-gradient-to-br from-delaware-gold/10 to-yellow-100/50 rounded-lg p-4 border border-delaware-gold/20">
            <p className="text-xs text-gray-600 mb-1">County</p>
            <p className="text-3xl font-bold text-delaware-gold">{data.zoning.county}</p>
          </div>
        </div>

        {/* Zone Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
          <div>
            <p className="text-sm text-gray-600 mb-1">Zone Name</p>
            <p className="text-lg font-semibold text-gray-900">{data.zoning.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Description</p>
            <p className="text-gray-700">{data.zoning.description}</p>
          </div>
          {data.zoning.municipality && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Municipality</p>
              <p className="text-gray-900 font-medium">{data.zoning.municipality}</p>
            </div>
          )}
        </div>

        {/* Permitted Uses Preview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
            Permitted Uses
          </h3>
          <div className="space-y-2">
            {allowedUses.slice(0, 3).map((use, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{use.category}: {use.type}</p>
                  {use.notes && <p className="text-xs text-gray-600 mt-1">{use.notes}</p>}
                </div>
              </div>
            ))}
            {conditionalUses.length > 0 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <FiAlertTriangle className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {conditionalUses.length} Conditional Use{conditionalUses.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Requires special permits or approval</p>
                </div>
              </div>
            )}
            {data.permittedUses.length > 4 && (
              <p className="text-sm text-gray-600 text-center py-2">
                + {data.permittedUses.length - 4} more uses
              </p>
            )}
          </div>
        </div>

        {/* Dimensional Standards Preview (Pro/Whale only) */}
        {userTier !== 'looker' && data.dimensionalStandards ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Dimensional Standards</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Max Height</p>
                <p className="text-lg font-bold text-delaware-blue">{data.dimensionalStandards.maxHeight} ft</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Min Lot</p>
                <p className="text-lg font-bold text-delaware-blue">{data.dimensionalStandards.minLotArea.toLocaleString()} sf</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Front Setback</p>
                <p className="text-lg font-bold text-delaware-blue">{data.dimensionalStandards.frontSetback} ft</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">FAR</p>
                <p className="text-lg font-bold text-delaware-blue">{data.dimensionalStandards.far}</p>
              </div>
            </div>
          </div>
        ) : userTier === 'looker' && (
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-700 mb-2">Dimensional Standards</h4>
            <p className="text-sm text-gray-600 mb-4">
              Upgrade to <span className="font-bold text-delaware-blue">The Pro</span> to unlock setbacks, heights, and lot requirements
            </p>
          </div>
        )}

        {/* Data Source Info */}
        {data.zoning.dataSource && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">Data Source</p>
                <p className="text-sm text-gray-700">{data.zoning.dataSource}</p>
                {data.zoning.lastVerified && (
                  <p className="text-xs text-gray-600 mt-1">
                    Last verified: {new Date(data.zoning.lastVerified).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-gray-50 border-t border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onViewDetails}
            className="flex-1 bg-delaware-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
          >
            <FiExternalLink className="w-5 h-5" />
            View Full Details
          </button>
          {onSaveProperty && (
            <button
              onClick={onSaveProperty}
              className="px-6 py-3 bg-white border-2 border-delaware-blue text-delaware-blue rounded-lg font-semibold hover:bg-blue-50 transition-all"
            >
              Save Property
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
