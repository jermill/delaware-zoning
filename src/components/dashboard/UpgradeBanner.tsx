import { useState } from 'react';
import { FiX, FiZap, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
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
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 relative">
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 p-1 hover:bg-blue-100 rounded-md transition-colors text-gray-500 hover:text-gray-700"
        aria-label="Dismiss banner"
      >
        <FiX className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div className="flex-shrink-0 w-8 h-8 bg-delaware-blue/10 rounded-lg flex items-center justify-center text-delaware-blue">
          {content.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{content.title}</h3>
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            {content.description}
          </p>
          <Link
            href={content.ctaLink}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-delaware-blue hover:text-blue-700 transition-colors"
          >
            {content.ctaText}
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

