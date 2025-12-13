import { motion } from 'framer-motion';
import { FiSearch, FiPlus } from 'react-icons/fi';
import Link from 'next/link';

interface FloatingActionButtonProps {
  onClick?: () => void;
  href?: string;
}

export default function FloatingActionButton({ onClick, href }: FloatingActionButtonProps) {
  const button = (
    <motion.button
      onClick={onClick}
      className="fixed bottom-20 md:bottom-8 right-6 z-50 w-16 h-16 bg-gradient-to-br from-delaware-blue to-blue-700 text-white rounded-2xl shadow-[0_8px_30px_rgba(44,95,158,0.4)] hover:shadow-[0_12px_40px_rgba(44,95,158,0.5)] flex items-center justify-center group transition-all duration-300"
      whileHover={{ scale: 1.05, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.div
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.3 }}
      >
        <FiSearch className="w-7 h-7" />
      </motion.div>
      
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
        New Search
      </span>
    </motion.button>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {button}
      </Link>
    );
  }

  return button;
}
