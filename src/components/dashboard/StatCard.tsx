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
        return 'text-delaware-blue bg-blue-50';
      case 'gold':
        return 'text-delaware-gold bg-yellow-50';
      case 'gray':
        return 'text-gray-400 bg-gray-50';
      case 'green':
        return 'text-success bg-green-50';
      case 'purple':
        return 'text-purple-600 bg-purple-50';
    }
  };

  return (
    <motion.div 
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-200/50 transition-all cursor-default h-full relative overflow-hidden"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between gap-4 relative z-10">
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
        <motion.div 
          className={`${getIconColor()} flex-shrink-0 p-3 rounded-xl shadow-sm`}
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-6 h-6">
            {icon}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

