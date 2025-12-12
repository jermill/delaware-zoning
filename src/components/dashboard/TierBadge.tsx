import { FiCheck, FiStar } from 'react-icons/fi';
import { UserTier } from '@/data/mockDashboardData';

interface TierBadgeProps {
  tier: UserTier;
  size?: 'sm' | 'md' | 'lg';
}

export default function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const getTierConfig = () => {
    switch (tier) {
      case 'looker':
        return {
          name: 'The Looker',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          icon: null,
        };
      case 'pro':
        return {
          name: 'The Pro',
          bgColor: 'bg-delaware-blue/10',
          textColor: 'text-delaware-blue',
          borderColor: 'border-delaware-blue',
          icon: <FiCheck className={getSizeClass()} />,
        };
      case 'whale':
        return {
          name: 'The Whale',
          bgColor: 'bg-delaware-gold/10',
          textColor: 'text-delaware-gold',
          borderColor: 'border-delaware-gold',
          icon: <FiStar className={getSizeClass()} />,
        };
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'md':
        return 'w-4 h-4';
      case 'lg':
        return 'w-5 h-5';
    }
  };

  const getPaddingClass = () => {
    switch (size) {
      case 'sm':
        return 'px-2.5 py-0.5 text-xs';
      case 'md':
        return 'px-3 py-1 text-sm';
      case 'lg':
        return 'px-4 py-1.5 text-base';
    }
  };

  const config = getTierConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${config.bgColor} ${config.textColor} ${config.borderColor} ${getPaddingClass()}`}
    >
      {config.icon}
      {config.name}
    </span>
  );
}

