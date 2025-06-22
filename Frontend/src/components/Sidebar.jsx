import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/logo.png";
import { 
  FiHome, 
  FiUsers, 
  FiTarget, 
  FiBarChart, 
  FiUser, 
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiAward,
  FiClock,
  FiTrendingUp,
  FiGrid,
  FiPlus,
  FiUserPlus
} from "react-icons/fi";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getNavLinks = () => {
    if (user?.role === "ceo") {
      return [
        { to: "/ceo/dashboard", label: "Dashboard", icon: <FiHome /> },
        { to: "/ceo/tasks", label: "Tasks", icon: <FiTarget /> },
        { to: "/ceo/add-task", label: "Add Task", icon: <FiPlus /> },
        { to: "/ceo/add-user", label: "Add User", icon: <FiUserPlus /> },
        { to: "/ceo/leaderboard", label: "Leaderboard", icon: <FiAward /> },
        { to: "/ceo/top", label: "Top Performance", icon: <FiBarChart /> },
        { to: "/ceo/profile", label: "Profile", icon: <FiUser /> },
      ];
    } else if (user?.role === "founding_member") {
      return [
        { to: "/founding/tasks", label: "My Tasks", icon: <FiTarget /> },
        { to: "/founding/analysis", label: "Analysis", icon: <FiBarChart /> },
        { to: "/founding/add-user", label: "Add Freelancer", icon: <FiUserPlus /> },
        { to: "/founding/profile", label: "Profile", icon: <FiUser /> },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className={`h-screen transition-all duration-500 ${
      isOpen ? "w-64" : "w-16"
    } card-premium border-r border-border-primary flex flex-col`}>
      
      {/* Header */}
      <div className="flex items-center px-4 py-6 border-b border-border-primary">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <img src={logo} alt="AfterInk" className="w-6 h-6 rounded-lg" />
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-premium">
                AfterInk
              </span>
              <span className="text-xs text-premium-secondary">
                Dashboard
              </span>
            </div>
          )}
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto p-2 rounded-lg text-premium-secondary hover:text-premium hover:bg-glass-bg transition-all duration-300"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-premium-secondary hover:text-premium hover:bg-glass-bg'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
              )}
              
              {/* Icon */}
              <span className={`text-lg transition-all duration-300 ${
                isActive ? 'text-white' : 'text-premium-secondary group-hover:text-premium'
              }`}>
                {link.icon}
              </span>
              
              {/* Label */}
              {isOpen && (
                <span className="ml-3 transition-all duration-300">
                  {link.label}
                </span>
              )}
              
              {/* Hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                isActive ? 'opacity-0' : ''
              }`}></div>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-border-primary">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-premium">
                {user?.name || "User"}
              </p>
              <p className="text-xs truncate text-premium-secondary">
                {user?.role?.replace("_", " ")}
              </p>
            </div>
          )}
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 rounded-xl font-medium text-premium-secondary hover:text-red-600 hover:bg-red-50 transition-all duration-300"
        >
          <FiLogOut className="text-lg" />
          {isOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
}