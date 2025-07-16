import React from "react";
import { BarChart2, Bell, Home, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-2 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100"
        } fixed lg:relative w-72 sm:w-80 lg:w-72 h-screen bg-white/90 backdrop-blur-xl shadow-2xl transform transition-all duration-300 ease-in-out z-40 border-r border-gray-200/50`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 border-b border-gray-200/50 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-sm">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-white to-white-600 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/25">
              <img
                src="/assets/logo.png"
                alt="Agri Eye Logo"
                className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-transparent bg-clip-text">
              agriEYE
            </h1>
            <p className="text-xs text-gray-600 mt-1 text-center px-2">Smart Farm Protection</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-2 overflow-y-auto">
            <NavItem 
              icon={<Home size={20} />} 
              text="Dashboard" 
              active 
              onClick={() => setIsOpen(false)}
            />
            <NavItem 
              icon={<BarChart2 size={20} />} 
              text="Analytics" 
              onClick={() => setIsOpen(false)}
            />
            <NavItem 
              icon={<Bell size={20} />} 
              text="Alerts" 
              badge="3" 
              onClick={() => setIsOpen(false)}
            />
          </nav>

          {/* User profile */}
          <div className="p-3 sm:p-4 border-t border-gray-200/50 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200/50 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <User className="text-white" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-600 capitalize truncate">{user?.role || 'Farmer'}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 transition-all duration-200 flex-shrink-0"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}

const NavItem = ({ icon, text, active, badge, onClick }: NavItemProps) => {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className={`group flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-cyan-500/20 text-gray-800 border border-blue-500/30 shadow-lg shadow-blue-500/10"
          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100/50 border border-transparent"
      }`}
    >
      <div className="flex items-center min-w-0">
        <span className={`${active ? "text-blue-600" : "group-hover:text-blue-600"} transition-colors duration-200 flex-shrink-0`}>
          {icon}
        </span>
        <span className="ml-3 font-medium truncate">{text}</span>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        {badge && (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
            {badge}
          </span>
        )}
        {active && (
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 animate-pulse shadow-sm shadow-blue-600/50"></span>
        )}
      </div>
    </a>
  );
};

export default Sidebar;