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
    <div className="bg-white border border-[#82B8DE] rounded-xl p-4 relative">
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-gray-700"
        aria-label="Dismiss banner"
      >
        <FiX className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <div className="flex-shrink-0 w-10 h-10 bg-[#82B8DE] rounded-xl flex items-center justify-center text-white">
          {content.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base mb-1.5">{content.title}</h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {content.description}
          </p>
          <Link
            href={content.ctaLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#152F50] text-white text-sm font-semibold rounded-xl hover:bg-[#82B8DE] transition-all shadow-sm"
          >
            {content.ctaText}
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

