import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  color?: 'blue' | 'gold' | 'gray' | 'green';
}

export default function StatCard({ title, value, icon, subtitle, color = 'blue' }: StatCardProps) {
  const getIconColor = () => {
    switch (color) {
      case 'blue':
        return 'text-delaware-blue bg-blue-50';
      case 'gold':
        return 'text-delaware-gold bg-yellow-50';
      case 'gray':
        return 'text-gray-400 bg-gray-50';
      case 'green':
        return 'text-success bg-green-50';
    }
  };

  return (
    <motion.div 
      className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md hover:border-gray-300 hover:shadow-lg transition-all cursor-default h-full"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1.5 truncate">{title}</p>
          <motion.p 
            className="text-2xl font-bold text-gray-900 mb-0.5 whitespace-nowrap"
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
            <p className="text-xs text-gray-600">{subtitle}</p>
          )}
        </div>
        <motion.div 
          className={`${getIconColor()} flex-shrink-0 p-2.5 rounded-xl`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-5 h-5">
            {icon}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

