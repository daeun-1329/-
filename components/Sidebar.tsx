import React from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';
import { Lock, Unlock } from 'lucide-react';

interface SidebarProps {
  activeTab: Category;
  setActiveTab: (tab: Category) => void;
  isUserMode: boolean;
  onAdminClick: () => void;
  isMobileOpen: boolean;
  closeMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isUserMode, 
  onAdminClick,
  isMobileOpen,
  closeMobileMenu
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 bg-white/80 backdrop-blur-md border-r border-teal-100/50
        flex flex-col p-6 shadow-xl md:shadow-none
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-teal-900 tracking-tight">PORTFOLIO</h1>
          <p className="text-xs text-teal-600 font-medium tracking-widest mt-1">ARCHITECTURAL DESIGN</p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {CATEGORIES.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                closeMobileMenu();
              }}
              className={`
                w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${activeTab === tab 
                  ? 'bg-teal-50 text-teal-800 shadow-sm ring-1 ring-teal-100 translate-x-1' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={onAdminClick}
            className={`
              flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200
              ${isUserMode 
                ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }
            `}
          >
            {isUserMode ? <Unlock size={18} /> : <Lock size={18} />}
            <span className="text-sm font-medium">
              {isUserMode ? 'Admin Active' : 'Admin Login'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
