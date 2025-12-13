import { FiHome, FiBookmark, FiClock, FiUser, FiMoreHorizontal } from 'react-icons/fi';
import { useState } from 'react';

interface MobileTabBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function MobileTabBar({ currentTab, onTabChange }: MobileTabBarProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTabs = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'saved', label: 'Saved', icon: FiBookmark },
    { id: 'history', label: 'History', icon: FiClock },
    { id: 'account', label: 'Account', icon: FiUser },
  ];

  const moreTabs = [
    { id: 'billing', label: 'Billing' },
    { id: 'help', label: 'Help & Support' },
  ];

  const handleMoreClick = () => {
    setShowMoreMenu(!showMoreMenu);
  };

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* More Menu Overlay */}
      {showMoreMenu && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowMoreMenu(false)}
            aria-hidden="true"
          />
          <div 
            className="fixed bottom-16 right-2 bg-white rounded-lg shadow-elevated z-50 min-w-[160px]"
            role="menu"
            aria-label="Additional menu options"
          >
            {moreTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  currentTab === tab.id ? 'bg-blue-50 text-[#152F50] font-semibold' : 'text-gray-700'
                }`}
                role="menuitem"
                aria-label={`${tab.label} tab`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Bottom Tab Bar */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 md:hidden"
        role="navigation"
        aria-label="Mobile dashboard navigation"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-[#152F50] bg-blue-50'
                    : 'text-gray-600 hover:text-[#152F50] hover:bg-gray-50'
                }`}
                aria-label={`${tab.label} tab`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#152F50]' : ''}`} aria-hidden="true" />
                <span className={`text-xs ${isActive ? 'font-semibold' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* More Button */}
          <button
            onClick={handleMoreClick}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              showMoreMenu || ['billing', 'help'].includes(currentTab)
                ? 'text-[#152F50] bg-blue-50'
                : 'text-gray-600 hover:text-[#152F50] hover:bg-gray-50'
            }`}
            aria-label="More options"
            aria-expanded={showMoreMenu}
            aria-haspopup="menu"
          >
            <FiMoreHorizontal className="w-5 h-5" aria-hidden="true" />
            <span className={`text-xs ${showMoreMenu ? 'font-semibold' : ''}`}>More</span>
          </button>
        </div>
      </nav>
    </>
  );
}

