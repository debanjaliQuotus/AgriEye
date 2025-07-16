import React, { useState } from 'react';
import { BellRing, Search, Zap, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 py-3 sm:py-4 px-4 sm:px-6 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side - Search (hidden on mobile, shown on sm and up) */}
        <div className="hidden sm:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
              placeholder="Search sensors, alerts, or locations..."
            />
          </div>
        </div>

        {/* Mobile search button */}
        <div className="sm:hidden">
          <button className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200">
            <Search size={20} />
          </button>
        </div>

        {/* Right side - Actions and User */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Emergency Alert - Hidden on mobile, shown on sm and up */}
          <button className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 sm:px-4 py-2 rounded-xl items-center transition-all duration-200 text-sm shadow-lg shadow-blue-500/25">
            <Zap size={16} className="mr-2" />
            <span className="hidden md:inline">Emergency Alert</span>
            <span className="md:hidden">Alert</span>
          </button>

          {/* Mobile Emergency Alert - Compact */}
          <button className="sm:hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-2 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25">
            <Zap size={18} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="relative bg-white p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-sm border border-gray-300">
              <BellRing size={20} className="text-gray-600" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 transform translate-x-1/2 -translate-y-1/2"></span>
            </button>
          </div>

          {/* User Profile - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">{user?.name}</span>
              <span className="text-xs text-gray-500">{user?.role}</span>
            </div>
          </div>

          {/* User Profile - Mobile Dropdown */}
          <div className="md:hidden relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 bg-white p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-sm border border-gray-300"
            >
              <User className="h-5 w-5 text-gray-600" />
              <ChevronDown size={16} className="text-gray-600" />
            </button>

            {/* Mobile User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Logout Button */}
          <button
            onClick={logout}
            className="hidden md:block bg-white hover:bg-gray-100 px-3 py-1.5 rounded-md text-sm text-gray-700 transition-colors duration-200 border border-gray-300 shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Search Bar - Shows when search is expanded */}
      <div className="sm:hidden mt-3 pt-3 border-t border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
            placeholder="Search sensors, alerts, or locations..."
          />
        </div>
      </div>
    </header>
  );
};

export default Header;