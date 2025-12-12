import { FiHome, FiBookmark, FiClock, FiUser, FiCreditCard, FiHelpCircle } from 'react-icons/fi';
import Link from 'next/link';
import { UserTier } from '@/data/mockDashboardData';
import TierBadge from './TierBadge';
import UpgradeBanner from './UpgradeBanner';

interface DashboardSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userName: string;
  userTier: UserTier;
  isCollapsed?: boolean;
}

export default function DashboardSidebar({
  currentTab,
  onTabChange,
  userName,
  userTier,
  isCollapsed = false,
}: DashboardSidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'saved', label: 'Saved Properties', icon: FiBookmark },
    { id: 'history', label: 'Search History', icon: FiClock },
    { id: 'account', label: 'Account Settings', icon: FiUser },
    { id: 'billing', label: 'Billing', icon: FiCreditCard },
    { id: 'help', label: 'Help & Support', icon: FiHelpCircle },
  ];

  return (
    <div className="h-full bg-delaware-blue text-white flex flex-col">
      {/* User Profile Section */}
      <div className="p-4 sm:p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-delaware-gold flex items-center justify-center font-bold text-white text-lg">
            {userName.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base truncate">{userName}</p>
              <TierBadge tier={userTier} size="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 sm:px-4 py-4 space-y-1" role="navigation" aria-label="Dashboard navigation">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-delaware-gold text-white shadow-lg'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
              aria-label={`${item.label} tab`}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onTabChange(item.id);
                }
              }}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} aria-hidden="true" />
              {!isCollapsed && (
                <span className="text-sm sm:text-base font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      {!isCollapsed && userTier !== 'whale' && (
        <div className="p-4 sm:p-6 border-t border-white/10">
          <UpgradeBanner currentTier={userTier} />
        </div>
      )}

      {/* Quick Links */}
      {!isCollapsed && (
        <div className="p-4 sm:p-6 border-t border-white/10">
          <button
            onClick={() => {
              // In production, this would call your logout function
              // For now, redirect to home
              alert('Logout functionality will be connected to authentication system');
              window.location.href = '/';
            }}
            className="block w-full text-center text-sm text-white/70 hover:text-white transition-colors"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
