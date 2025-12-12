import { FiX, FiDownload, FiMapPin, FiInfo, FiTag, FiCalendar, FiHome, FiTrendingUp, FiLock, FiMaximize2, FiAlertTriangle, FiPhone, FiMail, FiGlobe, FiMapPin as FiLocation } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { SavedProperty, UserTier } from '@/data/mockDashboardData';
import Link from 'next/link';

interface PropertyDetailsModalProps {
  property: SavedProperty;
  userTier: UserTier;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyDetailsModal({
  property,
  userTier,
  isOpen,
  onClose,
}: PropertyDetailsModalProps) {
  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    if (userTier === 'whale') {
      alert('PDF would be generated and downloaded here (backend not connected yet)');
    } else {
      alert('PDF export is only available for The Whale subscribers. Upgrade to download PDFs!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatLastVerified = (dateString?: string) => {
    if (!dateString) return 'Not verified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  // Determine what data to show based on tier
  const showBasicInfo = true; // Everyone sees basic info
  const showDimensionalStandards = userTier !== 'looker'; // Pro and Whale
  const showParkingRequirements = userTier !== 'looker'; // Pro and Whale
  const showDetailedPermittedUses = userTier !== 'looker'; // Pro and Whale
  const showFloodZone = userTier !== 'looker'; // Pro and Whale
  const showRequiredPermits = userTier === 'whale'; // Whale only
  const showOverlayDistricts = userTier === 'whale'; // Whale only
  const showZoningContact = userTier === 'whale'; // Whale only
  const showOrdinanceLink = userTier === 'whale'; // Whale only

  // Component for locked/upgrade prompts
  const LockedSection = ({ title, tierRequired }: { title: string; tierRequired: string }) => (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
      <FiLock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 mb-4">
        Upgrade to <span className="font-bold text-delaware-gold">{tierRequired}</span> to unlock this information
      </p>
      <Link
        href="/pricing"
        className="inline-flex items-center gap-2 px-4 py-2 bg-delaware-gold text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
      >
        Upgrade Now
      </Link>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-delaware-blue to-blue-700 border-b border-gray-200 p-6 flex items-start justify-between rounded-t-xl z-10">
          <div className="flex-1 pr-4">
            <motion.h2 
              className="text-2xl font-bold text-white mb-2 flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <FiHome className="w-6 h-6" />
              Property Details
            </motion.h2>
            <motion.p 
              className="text-blue-100 flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FiMapPin className="w-4 h-4" />
              {property.address}
            </motion.p>
            {property.lastVerified && (
              <p className="text-blue-200 text-xs mt-1">
                Last verified: {formatLastVerified(property.lastVerified)}
              </p>
            )}
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close modal"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <FiX className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-delaware-blue/10 to-blue-100/50 rounded-lg p-4 border border-delaware-blue/20">
              <p className="text-xs text-gray-600 mb-1">Zone Code</p>
              <p className="text-2xl font-bold text-delaware-blue">{property.zoneCode}</p>
            </div>
            <div className="bg-gradient-to-br from-delaware-gold/10 to-yellow-100/50 rounded-lg p-4 border border-delaware-gold/20">
              <p className="text-xs text-gray-600 mb-1">County</p>
              <p className="text-2xl font-bold text-delaware-gold">{property.county}</p>
            </div>
          </motion.div>

          {/* Zoning Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiInfo className="w-5 h-5 text-delaware-blue" />
              Zoning Information
            </h3>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 space-y-3 border border-gray-200">
              <div className="flex items-center justify-between p-2 hover:bg-white/50 rounded transition-colors">
                <span className="text-gray-600 font-medium">Zone Name</span>
                <span className="font-semibold text-gray-900">{property.zoneName}</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-white/50 rounded transition-colors">
                <span className="text-gray-600 font-medium">City</span>
                <span className="font-semibold text-gray-900">{property.city}</span>
              </div>
              {property.municipality && (
                <div className="flex items-center justify-between p-2 hover:bg-white/50 rounded transition-colors">
                  <span className="text-gray-600 font-medium">Municipality</span>
                  <span className="font-semibold text-gray-900">{property.municipality}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Dimensional Standards - Pro & Whale Only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiMaximize2 className="w-5 h-5 text-delaware-blue" />
              Dimensional Standards
              {!showDimensionalStandards && <FiLock className="w-4 h-4 text-gray-400" />}
            </h3>
            {showDimensionalStandards && property.dimensionalStandards ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">Front Setback</p>
                  <p className="text-xl font-bold text-delaware-blue">{property.dimensionalStandards.frontSetback} ft</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">Side Setback</p>
                  <p className="text-xl font-bold text-delaware-blue">{property.dimensionalStandards.sideSetback} ft</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">Rear Setback</p>
                  <p className="text-xl font-bold text-delaware-blue">{property.dimensionalStandards.rearSetback} ft</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">Max Height</p>
                  <p className="text-xl font-bold text-delaware-blue">{property.dimensionalStandards.maxHeight} ft</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-gray-600 mb-1">Min Lot Area</p>
                  <p className="text-xl font-bold text-green-700">{property.dimensionalStandards.minLotArea.toLocaleString()} sq ft</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-gray-600 mb-1">Min Lot Width</p>
                  <p className="text-xl font-bold text-green-700">{property.dimensionalStandards.minLotWidth} ft</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-xs text-gray-600 mb-1">FAR</p>
                  <p className="text-xl font-bold text-purple-700">{property.dimensionalStandards.far}</p>
                </div>
                {property.dimensionalStandards.lotCoverage && (
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-xs text-gray-600 mb-1">Max Coverage</p>
                    <p className="text-xl font-bold text-purple-700">{property.dimensionalStandards.lotCoverage}%</p>
                  </div>
                )}
              </div>
            ) : !showDimensionalStandards ? (
              <LockedSection title="Dimensional Standards" tierRequired="The Pro" />
            ) : (
              <p className="text-gray-500 italic">No dimensional standards data available</p>
            )}
          </motion.div>

          {/* Parking Requirements - Pro & Whale Only */}
          {property.parkingRequirements && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-delaware-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                Parking Requirements
                {!showParkingRequirements && <FiLock className="w-4 h-4 text-gray-400" />}
              </h3>
              {showParkingRequirements ? (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-5 border border-indigo-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {property.parkingRequirements.ratio}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Required Ratio</p>
                      <p className="text-sm text-gray-700">{property.parkingRequirements.notes}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <LockedSection title="Parking Requirements" tierRequired="The Pro" />
              )}
            </motion.div>
          )}

          {/* Permitted Uses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5 text-delaware-blue" />
              Permitted Uses
              {!showDetailedPermittedUses && <FiLock className="w-4 h-4 text-gray-400" />}
            </h3>
            {showDetailedPermittedUses && property.permittedUses ? (
              <div className="space-y-2">
                {property.permittedUses.filter(use => use.type === 'allowed').map((use, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{use.category}</p>
                      <p className="text-sm text-gray-600">{use.description}</p>
                      {use.conditions && (
                        <p className="text-xs text-gray-500 mt-1 italic">{use.conditions}</p>
                      )}
                    </div>
                  </div>
                ))}
                {property.permittedUses.filter(use => use.type === 'conditional').map((use, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{use.category} <span className="text-xs text-yellow-600">(Conditional)</span></p>
                      <p className="text-sm text-gray-600">{use.description}</p>
                      {use.conditions && (
                        <p className="text-xs text-gray-700 mt-1 font-medium">⚠️ {use.conditions}</p>
                      )}
                    </div>
                  </div>
                ))}
                {property.permittedUses.filter(use => use.type === 'prohibited').length > 0 && (
                  <details className="bg-red-50 rounded-lg border border-red-200 p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer hover:text-red-700">
                      Prohibited Uses (click to expand)
                    </summary>
                    <div className="mt-3 space-y-2">
                      {property.permittedUses.filter(use => use.type === 'prohibited').map((use, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{use.category}</p>
                            <p className="text-xs text-gray-600">{use.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ) : !showDetailedPermittedUses ? (
              <LockedSection title="Detailed Permitted Uses" tierRequired="The Pro" />
            ) : (
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Allowed</p>
                    <p className="text-sm text-gray-600">Commercial retail, offices, restaurants</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">Conditional</p>
                    <p className="text-sm text-gray-600">Mixed-use developments (requires approval)</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Flood Zone Information - Pro & Whale Only */}
          {property.floodZone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiAlertTriangle className="w-5 h-5 text-delaware-blue" />
                FEMA Flood Zone
                {!showFloodZone && <FiLock className="w-4 h-4 text-gray-400" />}
              </h3>
              {showFloodZone ? (
                <div className={`rounded-lg p-5 border-2 ${
                  property.floodZone.floodRisk === 'High Risk' 
                    ? 'bg-red-50 border-red-300' 
                    : property.floodZone.floodRisk === 'Moderate Risk'
                    ? 'bg-orange-50 border-orange-300'
                    : 'bg-green-50 border-green-300'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`text-3xl font-bold px-4 py-2 rounded ${
                      property.floodZone.floodRisk === 'High Risk'
                        ? 'bg-red-600 text-white'
                        : property.floodZone.floodRisk === 'Moderate Risk'
                        ? 'bg-orange-600 text-white'
                        : 'bg-green-600 text-white'
                    }`}>
                      {property.floodZone.femaZone}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">{property.floodZone.floodRisk}</p>
                      <p className="text-sm text-gray-700">{property.floodZone.description}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <LockedSection title="FEMA Flood Zone Information" tierRequired="The Pro" />
              )}
            </motion.div>
          )}

          {/* Required Permits - Whale Only */}
          {property.requiredPermits && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-delaware-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Required Permits
                {!showRequiredPermits && <FiLock className="w-4 h-4 text-delaware-gold" />}
              </h3>
              {showRequiredPermits ? (
                <div className="space-y-3">
                  {property.requiredPermits.map((permit, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{permit.type}</h4>
                          <p className="text-sm text-gray-700 mb-2">{permit.description}</p>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                            {permit.processingTime && (
                              <span className="flex items-center gap-1">
                                <FiCalendar className="w-3 h-3" />
                                {permit.processingTime}
                              </span>
                            )}
                            {permit.estimatedCost && (
                              <span className="font-medium text-green-700">
                                💰 {permit.estimatedCost}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <LockedSection title="Required Permits & Timeline" tierRequired="The Whale" />
              )}
            </motion.div>
          )}

          {/* Overlay Districts - Whale Only */}
          {property.overlayDistricts && property.overlayDistricts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-delaware-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Overlay Districts
                {!showOverlayDistricts && <FiLock className="w-4 h-4 text-delaware-gold" />}
              </h3>
              {showOverlayDistricts ? (
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <ul className="space-y-2">
                    {property.overlayDistricts.map((district, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="font-medium">{district}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-600 mt-3 italic">
                    These overlay districts may impose additional requirements beyond base zoning.
                  </p>
                </div>
              ) : (
                <LockedSection title="Overlay Districts" tierRequired="The Whale" />
              )}
            </motion.div>
          )}

          {/* Zoning Contact - Whale Only */}
          {property.zoningContact && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiPhone className="w-5 h-5 text-delaware-gold" />
                Zoning Office Contact
                {!showZoningContact && <FiLock className="w-4 h-4 text-delaware-gold" />}
              </h3>
              {showZoningContact ? (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-4">{property.zoningContact.office}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <FiPhone className="w-4 h-4 text-delaware-blue flex-shrink-0" />
                      <a href={`tel:${property.zoningContact.phone}`} className="hover:text-delaware-blue hover:underline">
                        {property.zoningContact.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <FiMail className="w-4 h-4 text-delaware-blue flex-shrink-0" />
                      <a href={`mailto:${property.zoningContact.email}`} className="hover:text-delaware-blue hover:underline">
                        {property.zoningContact.email}
                      </a>
                    </div>
                    {property.zoningContact.website && (
                      <div className="flex items-center gap-3 text-gray-700">
                        <FiGlobe className="w-4 h-4 text-delaware-blue flex-shrink-0" />
                        <a 
                          href={property.zoningContact.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-delaware-blue hover:underline break-all"
                        >
                          {property.zoningContact.website.replace('https://', '')}
                        </a>
                      </div>
                    )}
                    {property.zoningContact.address && (
                      <div className="flex items-start gap-3 text-gray-700">
                        <FiLocation className="w-4 h-4 text-delaware-blue flex-shrink-0 mt-1" />
                        <span>{property.zoningContact.address}</span>
                      </div>
                    )}
                  </div>
                  {property.ordinanceUrl && showOrdinanceLink && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <a
                        href={property.ordinanceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-delaware-blue hover:text-blue-700 font-medium text-sm"
                      >
                        <FiGlobe className="w-4 h-4" />
                        View Full Zoning Ordinance
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <LockedSection title="Zoning Office Contact Information" tierRequired="The Whale" />
              )}
            </motion.div>
          )}

          {/* Notes */}
          {property.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Notes</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700">{property.notes}</p>
              </div>
            </motion.div>
          )}

          {/* Tags */}
          {property.tags && property.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiTag className="w-5 h-5" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {property.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Date Saved */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <FiCalendar className="w-4 h-4" />
              Saved on {formatDate(property.dateSaved)}
            </p>
          </div>

          {/* Upgrade CTA if not Whale */}
          {userTier !== 'whale' && (
            <div className="bg-gradient-to-r from-delaware-gold to-yellow-600 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                {userTier === 'looker' ? '🔓 Unlock Complete Zoning Data' : '🐋 Get the Full Picture'}
              </h3>
              <p className="text-white/90 mb-4">
                {userTier === 'looker' 
                  ? 'Upgrade to see dimensional standards, parking requirements, flood zones, and more!' 
                  : 'Upgrade to The Whale for required permits, timelines, zoning office contacts, and PDF exports!'}
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-delaware-gold rounded-lg font-bold hover:bg-gray-100 transition-all"
              >
                View Pricing
              </Link>
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadPDF}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                userTier === 'whale'
                  ? 'bg-delaware-gold text-white hover:bg-opacity-90'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              title={userTier === 'whale' ? 'Download PDF Report' : 'Whale tier feature'}
            >
              <FiDownload className="w-5 h-5" />
              {userTier === 'whale' ? 'Download PDF Report' : 'Download PDF (Whale Only)'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
          
          {userTier !== 'whale' && (
            <p className="text-xs text-center text-gray-500 mt-3">
              Upgrade to The Whale to download professional PDF reports
            </p>
          )}
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
