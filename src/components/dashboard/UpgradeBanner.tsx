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
    <div className="bg-gradient-to-r from-delaware-gold to-yellow-600 text-white rounded-2xl p-4 relative">
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Dismiss banner"
      >
        <FiX className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div className="flex-shrink-0 mt-0.5">
          {content.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-1">{content.title}</h3>
          <p className="text-sm text-white/90 mb-3">{content.description}</p>
          <Link
            href={content.ctaLink}
            className="inline-block bg-white text-delaware-gold px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            {content.ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
}

