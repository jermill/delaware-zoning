import { FiHome, FiBookmark, FiClock, FiUser, FiCreditCard, FiHelpCircle, FiLogOut } from 'react-icons/fi';
import Link from 'next/link';
import { UserTier } from '@/data/mockDashboardData';
import TierBadge from './TierBadge';

interface DashboardSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userName: string;
  userTier: UserTier;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function DashboardSidebar({
  currentTab,
  onTabChange,
  userName,
  userTier,
  isCollapsed = false,
  onToggleCollapse,
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
    <div className="h-full bg-white border-r border-[#A8BDBE] flex flex-col relative transition-all duration-300">
      {/* User Profile Section - Only show when not collapsed */}
      {!isCollapsed && (
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#152F50] flex items-center justify-center font-bold text-white text-xl shadow-md flex-shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-base truncate mb-1.5">{userName}</p>
              <TierBadge tier={userTier} size="sm" />
            </div>
          </div>
        </div>
      )}

      {/* Icon-only avatar when collapsed */}
      {isCollapsed && (
        <div className="p-4 border-b border-gray-200 flex justify-center">
          <div className="w-10 h-10 rounded-xl bg-[#152F50] flex items-center justify-center font-bold text-white text-base shadow-md">
            {userName.charAt(0)}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-3'} py-4 space-y-1`} role="navigation" aria-label="Dashboard navigation">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'gap-3 px-4'} py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-[#152F50] text-white shadow-md'
                  : 'text-gray-600 hover:bg-[#FFFCF6] hover:text-gray-900'
              }`}
              aria-label={`${item.label} tab`}
              aria-current={isActive ? 'page' : undefined}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#A8BDBE] group-hover:text-[#152F50]'}`} aria-hidden="true" />
              {!isCollapsed && (
                <span className="text-sm font-semibold">{item.label}</span>
              )}
              
              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <span className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      {!isCollapsed && userTier !== 'whale' && (
        <div className="px-3 pb-4">
          <div className="bg-[#FFFCF6] border border-[#82B8DE] rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-[#82B8DE] rounded-md flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-xs">
                Upgrade to{userTier === 'looker' ? ' The Pro' : ' The Whale'}
              </h3>
            </div>
            <p className="text-[11px] text-gray-600 mb-3 leading-relaxed">
              {userTier === 'looker' 
                ? 'Get unlimited searches and save unlimited properties'
                : 'Get PDF reports and property dimensions'}
            </p>
            <Link
              href="/dashboard?tab=billing"
              className="block w-full text-center bg-[#152F50] text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-[#82B8DE] transition-colors"
            >
              Upgrade Now →
            </Link>
          </div>
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

