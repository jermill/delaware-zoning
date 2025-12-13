import { useState } from 'react';
import { FiSearch, FiX, FiMapPin } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSearch({ isOpen, onClose }: DashboardSearchProps) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) return;
    
    setLoading(true);
    
    // Redirect to search results page with the query
    window.location.href = `/?address=${encodeURIComponent(address)}`;
  };

  const handleClose = () => {
    setAddress('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-[#152F50] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <FiSearch className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Property Search</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close search"
                >
                  <FiX className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Search Form */}
              <div className="p-6">
                <form onSubmit={handleSearch}>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Property Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiMapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address (e.g., 123 Main St, Wilmington, DE)"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-base focus:border-[#82B8DE] focus:ring-4 focus:ring-[#82B8DE]/20 transition-all outline-none"
                        autoFocus
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Search for any property in Delaware to view zoning information
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !address.trim()}
                      className="flex-1 px-6 py-3 bg-[#152F50] text-white rounded-xl font-semibold hover:bg-[#82B8DE] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <FiSearch className="w-5 h-5" />
                          Search Property
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Quick Tips */}
                <div className="mt-6 p-4 bg-blue-50 border border-[#A8BDBE] rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Search Tips:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Include street number, street name, city, and state</li>
                    <li>• Example: "100 W 10th St, Wilmington, DE 19801"</li>
                    <li>• Works for all three Delaware counties</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
