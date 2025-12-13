import { motion } from 'framer-motion';
import { FiTrendingUp, FiSearch } from 'react-icons/fi';

interface PopularZone {
  zone: string;
  count: number;
  county: string;
}

interface PopularZonesCardProps {
  zones?: PopularZone[];
  onSearchZone?: (zone: string, county: string) => void;
}

export default function PopularZonesCard({ zones = [], onSearchZone }: PopularZonesCardProps) {
  // Default mock data if none provided
  const defaultZones: PopularZone[] = [
    { zone: 'R-3', count: 8, county: 'New Castle' },
    { zone: 'C-2', count: 6, county: 'Sussex' },
    { zone: 'I-1', count: 5, county: 'New Castle' },
    { zone: 'R-1', count: 4, county: 'Kent' },
    { zone: 'MX-1', count: 3, county: 'New Castle' },
  ];

  const displayZones = zones.length > 0 ? zones : defaultZones;
  const maxCount = Math.max(...displayZones.map(z => z.count));
  const topZone = displayZones[0];

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-md p-5 border border-[#A8BDBE] h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900">Popular Zones</h3>
          <p className="text-xs text-gray-500 mt-0.5">Most Searched Districts</p>
        </div>
        <div className="p-2 bg-[#D8B368]/10 rounded-lg">
          <FiTrendingUp className="w-4 h-4 text-[#D8B368]" />
        </div>
      </div>

      {/* Insight */}
      {topZone && (
        <div className="mb-3 p-2 bg-amber-50 rounded-lg">
          <p className="text-xs text-gray-700">
            <span className="font-semibold text-[#152F50]">{topZone.zone}</span> in {topZone.county} is{' '}
            trending with <span className="font-semibold">{topZone.count} searches</span>
          </p>
        </div>
      )}

      <div className="space-y-3 flex-1 overflow-y-auto">
        {displayZones.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiTrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No search data yet</p>
            <p className="text-xs text-gray-500">Start searching to see popular zones</p>
          </div>
        ) : (
          displayZones.map((zone, index) => (
            <motion.div
              key={zone.zone}
              className="relative group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 w-4">#{index + 1}</span>
                  <span className="text-sm font-bold text-[#152F50]">{zone.zone}</span>
                  <span className="text-xs text-gray-500">{zone.county}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600">{zone.count}</span>
                  {onSearchZone && (
                    <button
                      onClick={() => onSearchZone(zone.zone, zone.county)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#152F50]/10 rounded transition-all"
                      title={`Search ${zone.zone}`}
                    >
                      <FiSearch className="w-3 h-3 text-[#152F50]" />
                    </button>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#152F50] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(zone.count / maxCount) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

