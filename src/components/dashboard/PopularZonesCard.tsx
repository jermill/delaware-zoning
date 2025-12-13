import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';

interface PopularZone {
  zone: string;
  count: number;
  county: string;
}

interface PopularZonesCardProps {
  zones?: PopularZone[];
}

export default function PopularZonesCard({ zones = [] }: PopularZonesCardProps) {
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

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-md p-5 border border-[#A8BDBE] h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Popular Zones</h3>
          <p className="text-xs text-gray-500 mt-0.5">Most Searched Districts</p>
        </div>
        <div className="p-2 bg-[#D8B368]/10 rounded-lg">
          <FiTrendingUp className="w-4 h-4 text-[#D8B368]" />
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {displayZones.map((zone, index) => (
          <motion.div
            key={zone.zone}
            className="relative"
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
              <span className="text-xs font-semibold text-gray-600">{zone.count} searches</span>
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
        ))}
      </div>

      {displayZones.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No search data yet</p>
          <p className="text-xs text-gray-400 mt-1">Start searching to see popular zones</p>
        </div>
      )}
    </motion.div>
  );
}
