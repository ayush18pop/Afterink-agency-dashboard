import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiHome, FiTarget, FiUsers, FiTrendingUp, FiUser, FiLogOut, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

export default function FoundingSidebar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/founding', icon: FiHome, label: 'Dashboard', exact: true },
    { path: '/founding/tasks', icon: FiTarget, label: 'My Tasks' },
    { path: '/founding/freelancers', icon: FiUsers, label: 'Freelancers' },
    { path: '/founding/analytics', icon: FiTrendingUp, label: 'Analytics' },
    { path: '/founding/profile', icon: FiUser, label: 'Profile' },
  ];

  return (
    <div className="h-full bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'F'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{user?.name || 'Founding Member'}</h2>
            <p className="text-sm text-gray-600 capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group hover-lift ${
                isActive
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-white/50 hover:text-gray-900'
              }`
            }
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <item.icon className="text-xl" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl font-medium text-gray-700 hover:bg-white/50 hover:text-gray-900 transition-all duration-300 hover-lift"
        >
          {theme === 'dark' ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>

      {/* Logout */}
      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 hover-lift"
        >
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
