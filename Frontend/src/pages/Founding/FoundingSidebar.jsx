<<<<<<< HEAD
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
=======
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png"; // Adjust path if needed
import { FaTachometerAlt, FaUserPlus, FaTasks, FaUser } from "react-icons/fa"; // Importing icons for better visuals
import "../../sidebar-logo-fix.css";

const links = [
  { to: "/founding/tasks", label: "My Tasks", icon: <FaTasks /> },
  { to: "/founding/add-user", label: "Add Freelancer", icon: <FaUserPlus /> },
];

export default function FoundingSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <aside className="h-screen w-64 bg-gray-950 border-r border-gray-800 text-white flex flex-col transition-all duration-300">
      {/* Logo Section */}
      <div className="flex flex-col items-center gap-4 px-6 py-10">
        <div className="sidebar-logo-container mb-2">
          <img 
            src={logo} 
            alt="Logo" 
            className="sidebar-logo-img rounded-lg"
          />
        </div>
        <span className="text-2xl font-bold tracking-wide text-center">AfterInk FM</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 flex flex-col gap-2 px-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>      {/* Logout Section */}
      <div className="px-6 py-6 mt-auto border-t border-gray-800">
        <div className="flex items-center justify-between gap-2 text-sm">
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <FaUser size={14} />
            <span>{user?.name}</span>
          </button>
          <button
            onClick={logout}
            className="text-red-500 font-semibold hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
  );
}
