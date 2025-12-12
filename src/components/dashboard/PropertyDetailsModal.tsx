import { FiX, FiDownload, FiMapPin, FiInfo, FiTag, FiCalendar, FiHome, FiTrendingUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { SavedProperty, UserTier } from '@/data/mockDashboardData';

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
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-delaware-blue to-blue-700 border-b border-gray-200 p-6 flex items-start justify-between rounded-t-xl">
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
            </div>
          </motion.div>

          {/* Permitted Uses (Mock Data) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5 text-delaware-blue" />
              Permitted Uses
            </h3>
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
          </motion.div>

          {/* Notes */}
          {property.notes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
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
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiTag className="w-5 h-5" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {property.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
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
