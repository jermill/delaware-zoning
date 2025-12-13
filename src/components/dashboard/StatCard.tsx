import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  color?: 'blue' | 'gold' | 'gray' | 'green' | 'purple';
}

export default function StatCard({ title, value, icon, subtitle, color = 'blue' }: StatCardProps) {
  const getGradientColors = () => {
    switch (color) {
      case 'blue':
        return {
          gradient: 'bg-white',
          iconBg: 'bg-[#82B8DE]',
          border: 'border-[#82B8DE]/30',
          accentRing: 'ring-[#82B8DE]/20'
        };
      case 'gold':
        return {
          gradient: 'bg-white',
          iconBg: 'bg-[#D8B368]',
          border: 'border-[#D8B368]/30',
          accentRing: 'ring-[#D8B368]/20'
        };
      case 'gray':
        return {
          gradient: 'bg-white',
          iconBg: 'bg-[#A8BDBE]',
          border: 'border-[#A8BDBE]/30',
          accentRing: 'ring-[#A8BDBE]/20'
        };
      case 'green':
        return {
          gradient: 'bg-white',
          iconBg: 'bg-[#82B8DE]',
          border: 'border-[#82B8DE]/30',
          accentRing: 'ring-[#82B8DE]/20'
        };
      case 'purple':
        return {
          gradient: 'bg-white',
          iconBg: 'bg-[#152F50]',
          border: 'border-[#152F50]/30',
          accentRing: 'ring-[#152F50]/20'
        };
    }
  };

  const colors = getGradientColors();

  return (
    <motion.div 
      className={`relative ${colors.gradient} rounded-2xl p-6 shadow-lg hover:shadow-xl border-2 ${colors.border} transition-all cursor-default h-full overflow-hidden group`}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 ${colors.iconBg} opacity-5 rounded-full blur-3xl`}></div>
      </div>

      <div className="relative">
        {/* Title */}
        <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
          {title}
        </p>
        
        {/* Value and Icon Row */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              delay: 0.1 
            }}
          >
            <p className="text-4xl font-extrabold text-gray-900 leading-none">
              {value}
            </p>
          </motion.div>
          
          <div 
            className={`${colors.iconBg} flex-shrink-0 p-3.5 rounded-xl shadow-lg ring-4 ${colors.accentRing}`}
          >
            <div className="w-6 h-6 text-white">
              {icon}
            </div>
          </div>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div className="flex items-center gap-2">
            <div className={`h-1 w-8 rounded-full ${colors.iconBg}`}></div>
            <p className="text-sm text-gray-700 font-semibold">{subtitle}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

