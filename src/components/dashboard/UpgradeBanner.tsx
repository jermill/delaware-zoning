import { useState } from 'react';
import { FiX, FiZap, FiTrendingUp } from 'react-icons/fi';
import { UserTier } from '@/data/mockDashboardData';
import Link from 'next/link';

interface UpgradeBannerProps {
  currentTier: UserTier;
}

export default function UpgradeBanner({ currentTier }: UpgradeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show banner for whale tier
  if (currentTier === 'whale' || isDismissed) {
    return null;
  }

  const getbannerContent = () => {
    if (currentTier === 'looker') {
      return {
        icon: <FiZap className="w-5 h-5" />,
        title: 'Upgrade to The Pro',
        description: 'Get unlimited searches and save unlimited properties',
        ctaText: 'Upgrade Now',
        ctaLink: '/dashboard?tab=billing',
      };
    } else {
      return {
        icon: <FiTrendingUp className="w-5 h-5" />,
        title: 'Upgrade to The Whale',
        description: 'Export professional PDF reports and access property dimensions',
        ctaText: 'Go Whale',
        ctaLink: '/dashboard?tab=billing',
      };
    }
  };

  const content = getbannerContent();

  return (
    <div className="bg-delaware-gold text-white rounded-2xl p-5 relative shadow-lg overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/20 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-600/20 rounded-full -ml-12 -mb-12"></div>
      
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-lg transition-colors z-10"
        aria-label="Dismiss banner"
      >
        <FiX className="w-4 h-4" />
      </button>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            {content.icon}
          </div>
          <h3 className="font-bold text-lg">{content.title}</h3>
        </div>
        <p className="text-sm text-white/95 mb-4 leading-relaxed">
          {content.description}
        </p>
        <Link
          href={content.ctaLink}
          className="inline-flex items-center justify-center w-full bg-white text-delaware-gold px-5 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {content.ctaText} →
        </Link>
      </div>
    </div>
  );
}

