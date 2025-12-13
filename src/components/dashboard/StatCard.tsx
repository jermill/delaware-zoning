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
  const getIconColor = () => {
    switch (color) {
      case 'blue':
        return 'text-white bg-[#82B8DE]';
      case 'gold':
        return 'text-white bg-[#D8B368]';
      case 'gray':
        return 'text-white bg-[#A8BDBE]';
      case 'green':
        return 'text-white bg-[#82B8DE]';
      case 'purple':
        return 'text-white bg-[#152F50]';
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg border border-[#A8BDBE] transition-all cursor-default h-full"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wide mb-2 truncate">{title}</p>
          <motion.p 
            className="text-3xl font-bold text-gray-900 mb-1 whitespace-nowrap"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              delay: 0.1 
            }}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
          )}
        </div>
        <div 
          className={`${getIconColor()} flex-shrink-0 p-3 rounded-xl shadow-sm`}
        >
          <div className="w-6 h-6">
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

