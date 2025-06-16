import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import { useState } from "react";
import { FaTachometerAlt, FaPlus, FaUserPlus, FaList, FaTasks, FaTrophy, FaUser } from "react-icons/fa"; // Importing icons

const links = [
  { to: "/ceo/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/ceo/add-task", label: "Add Task", icon: <FaPlus /> },
  { to: "/ceo/add-user", label: "Add User", icon: <FaUserPlus /> },
  { to: "/ceo/leaderboard", label: "Leaderboard", icon: <FaList /> },
  { to: "/ceo/tasks", label: "My-Tasks", icon: <FaTasks /> },
  { to: "/top", label: "Top Performance", icon: <FaTrophy /> }
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true); // State to control sidebar visibility

  // Toggle sidebar open/close
  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className={`h-screen ${isOpen ? "w-64" : "w-16"} bg-[#181824] border-r border-[#25253a] flex flex-col transition-all duration-300`}>
      <div className={`flex items-center px-6 py-7 ${isOpen ? 'justify-center gap-3' : 'justify-center'}`}>
        <img src={logo} alt="AfterInk" className="w-10 h-10 rounded-lg" />
        {isOpen && (
          <span className="text-xl text-white font-bold tracking-wide">
            AfterInk
          </span>
        )}
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block px-5 py-2 rounded-lg font-medium transition ${
              pathname === link.to
                ? "bg-[#232338] text-[#78aaff]"
                : "text-gray-300 hover:bg-[#20202d]"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-lg">{link.icon}</span>
              {isOpen && <span>{link.label}</span>} {/* Show label if sidebar is open */}
            </div>
          </Link>
        ))}
      </nav>      <div className="px-6 py-6 mt-auto">
        <div className={`flex items-center ${isOpen ? 'justify-between gap-2' : 'justify-center'}`}> 
          {isOpen && (
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors cursor-pointer"
            >
              <FaUser size={14} />
              <span>{user?.name}</span>
            </button>
          )}
          {!isOpen && (
            <button
              onClick={handleProfileClick}
              className="text-gray-400 hover:text-white transition-colors"
              title="Profile"
            >
              <FaUser size={16} />
            </button>
          )}
          <button
            className="text-[#fa5252] text-xs font-semibold hover:underline"
            onClick={logout}
          >
            {isOpen ? 'Logout' : 'Out'}
          </button>
        </div>
      </div>
    </div>
  );
}
