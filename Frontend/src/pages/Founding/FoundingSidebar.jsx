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
  );
}
