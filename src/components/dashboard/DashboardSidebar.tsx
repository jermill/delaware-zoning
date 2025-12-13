import { FiHome, FiBookmark, FiClock, FiUser, FiCreditCard, FiHelpCircle, FiLogOut } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { UserTier } from '@/data/mockDashboardData';
import TierBadge from './TierBadge';

interface DashboardSidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  userName: string;
  userTier: UserTier;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  avatarUrl?: string;
}

export default function DashboardSidebar({
  currentTab,
  onTabChange,
  userName,
  userTier,
  isCollapsed = false,
  onToggleCollapse,
  avatarUrl,
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
    <div className="h-full bg-[#A8BDBE] border-r border-[#A8BDBE] flex flex-col relative transition-all duration-300">
      {/* Logo Section */}
      <div className={`${isCollapsed ? 'p-4' : 'p-5'} border-b border-white/20 flex ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
        <button
          onClick={() => {
            // Open Delaware Zoning affiliate/share link
            window.open('https://delawarezoning.com/?ref=dashboard', '_blank');
          }}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
          title="Share Delaware Zoning"
        >
          <div className={`relative ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'} flex-shrink-0`}>
            <Image 
              src="/images/logo.png" 
              alt="Delaware Zoning Logo" 
              width={48}
              height={48}
              className="object-contain"
              priority
              unoptimized
            />
          </div>
          {!isCollapsed && (
            <h1 className="text-[#272727] font-bold text-lg">Delaware Zoning</h1>
          )}
        </button>
      </div>

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
                  ? 'bg-white/20 backdrop-blur-md text-white shadow-lg border border-white/30'
                  : 'text-[#272727] hover:bg-white/20 hover:text-[#272727]'
              }`}
              aria-label={`${item.label} tab`}
              aria-current={isActive ? 'page' : undefined}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#272727] group-hover:text-[#272727]'}`} aria-hidden="true" />
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

      {/* Icon-only avatar when collapsed */}
      {isCollapsed && (
        <div className="p-4 border-t border-white/20 flex justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-10 h-10 rounded-xl object-cover shadow-md"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#272727] flex items-center justify-center font-bold text-white text-base shadow-md">
              {userName.charAt(0)}
            </div>
          )}
        </div>
      )}

      {/* User Profile Section - Only show when not collapsed */}
      {!isCollapsed && (
        <div className="p-5 border-t border-white/20">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                className="w-14 h-14 rounded-xl object-cover shadow-md flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-[#272727] flex items-center justify-center font-bold text-white text-xl shadow-md flex-shrink-0">
                {userName.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#272727] text-base truncate mb-1.5">
                Hi, {userName.split(' ')[0]}
              </p>
              <TierBadge tier={userTier} size="sm" />
            </div>
          </div>
        </div>
      )}

      {/* Toggle Sidebar Button - Collapsed */}
      {isCollapsed && onToggleCollapse && (
        <div className="p-2 border-t border-white/20">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center px-3 py-3 text-[#272727] hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 group relative"
            title="Expand Sidebar"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            
            {/* Tooltip for collapsed mode */}
            <span className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
              Expand Sidebar
            </span>
          </button>
        </div>
      )}

      {/* Logout Button - Collapsed */}
      {isCollapsed && (
        <div className="p-2 border-t border-white/20">
          <button
            onClick={() => {
              // In production, this would call your logout function
              // For now, redirect to home
              alert('Logout functionality will be connected to authentication system');
              window.location.href = '/';
            }}
            className="w-full flex items-center justify-center px-3 py-3 text-red-600 hover:text-red-100 hover:bg-red-600/80 rounded-xl transition-all duration-200 group relative"
            title="Log Out"
          >
            <FiLogOut className="w-5 h-5" />
            
            {/* Tooltip for collapsed mode */}
            <span className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
              Log Out
            </span>
          </button>
        </div>
      )}

      {/* Upgrade Banner */}
      {!isCollapsed && userTier !== 'whale' && (
        <div className="px-3 pb-4">
          <div className="bg-white border border-[#82B8DE] rounded-xl p-3.5">
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
              className="block w-full text-center bg-[#152F50] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#82B8DE] transition-colors"
            >
              Upgrade Now →
            </Link>
          </div>
        </div>
      )}

      {/* Toggle Sidebar Button - Expanded */}
      {!isCollapsed && onToggleCollapse && (
        <div className="p-3 border-t border-white/20">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[#272727] hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 group"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            <span className="text-sm font-semibold">Collapse Sidebar</span>
          </button>
        </div>
      )}

      {/* Logout Button */}
      {!isCollapsed && (
        <div className="p-3 border-t border-white/20">
          <button
            onClick={() => {
              // In production, this would call your logout function
              // For now, redirect to home
              alert('Logout functionality will be connected to authentication system');
              window.location.href = '/';
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:text-red-100 hover:bg-red-600/80 rounded-xl transition-all duration-200 group"
          >
            <FiLogOut className="w-4 h-4" />
            <span className="text-sm font-semibold">Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

