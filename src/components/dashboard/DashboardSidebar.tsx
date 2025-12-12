import { FiHome, FiBookmark, FiClock, FiUser, FiCreditCard, FiHelpCircle, FiLogOut } from 'react-icons/fi';
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
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-delaware-blue flex items-center justify-center font-bold text-white text-lg shadow-md">
            {userName.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-base truncate">{userName}</p>
              <TierBadge tier={userTier} size="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1" role="navigation" aria-label="Dashboard navigation">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-delaware-blue text-delaware-navy shadow-md'
                  : 'text-gray-600 hover:bg-delaware-cream hover:text-gray-900'
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
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-delaware-blue'}`} aria-hidden="true" />
              {!isCollapsed && (
                <span className="text-sm font-semibold">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      {!isCollapsed && userTier !== 'whale' && (
        <div className="px-3 pb-4">
          <UpgradeBanner currentTier={userTier} />
        </div>
      )}

      {/* Logout Button */}
      {!isCollapsed && (
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => {
              // In production, this would call your logout function
              // For now, redirect to home
              alert('Logout functionality will be connected to authentication system');
              window.location.href = '/';
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
          >
            <FiLogOut className="w-4 h-4 group-hover:text-red-600" />
            <span className="text-sm font-semibold">Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

