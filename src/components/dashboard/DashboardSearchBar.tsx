import { useState } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface DashboardSearchBarProps {
  onSearch?: () => void;
}

export default function DashboardSearchBar({ onSearch }: DashboardSearchBarProps) {
  const [focused, setFocused] = useState(false);

  const handleClick = () => {
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white via-blue-50/30 to-white rounded-2xl shadow-md p-6 sm:p-8 border border-[#A8BDBE] mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Search Delaware Properties
          </h2>
          <p className="text-sm text-gray-600">
            Enter an address to get instant zoning information
          </p>
        </div>

        <div className="relative">
          <button
            onClick={handleClick}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full flex items-center gap-3 px-5 py-4 bg-white rounded-xl border-2 transition-all duration-300 text-left group hover:border-[#152F50] hover:shadow-lg ${
              focused ? 'border-[#152F50] shadow-lg' : 'border-[#A8BDBE] shadow-sm'
            }`}
          >
            <div className="flex-shrink-0 p-2.5 bg-[#82B8DE] rounded-lg group-hover:bg-[#152F50] transition-colors">
              <FiSearch className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1">
              <span className="text-gray-500 text-base">
                Search by address, parcel ID, or location...
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
              <FiMapPin className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs font-semibold text-gray-600">Delaware</span>
            </div>
          </button>
        </div>

        {/* Quick Search Suggestions */}
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Quick search:</span>
          <button
            onClick={handleClick}
            className="text-xs px-3 py-1.5 bg-white border border-[#A8BDBE] rounded-lg hover:border-[#152F50] hover:bg-blue-50 transition-all font-medium text-gray-700"
          >
            Wilmington
          </button>
          <button
            onClick={handleClick}
            className="text-xs px-3 py-1.5 bg-white border border-[#A8BDBE] rounded-lg hover:border-[#152F50] hover:bg-blue-50 transition-all font-medium text-gray-700"
          >
            Newark
          </button>
          <button
            onClick={handleClick}
            className="text-xs px-3 py-1.5 bg-white border border-[#A8BDBE] rounded-lg hover:border-[#152F50] hover:bg-blue-50 transition-all font-medium text-gray-700"
          >
            Dover
          </button>
          <button
            onClick={handleClick}
            className="text-xs px-3 py-1.5 bg-white border border-[#A8BDBE] rounded-lg hover:border-[#152F50] hover:bg-blue-50 transition-all font-medium text-gray-700"
          >
            Rehoboth Beach
          </button>
        </div>
      </div>
    </motion.div>
  );
}

