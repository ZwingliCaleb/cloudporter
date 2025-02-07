import { useState } from 'react';
import { FaHome, FaUser, FaCog, FaBars } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`flex flex-col h-screen bg-gray-800 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Hamburger Menu */}
      <div className="p-4">
        <button onClick={toggleSidebar} className="focus:outline-none">
          <FaBars className="text-2xl" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li className="hover:bg-gray-700 p-3 rounded">
            <a href="#" className="flex items-center">
              <FaHome className="text-xl" />
              {isOpen && <span className="ml-3">Home</span>}
            </a>
          </li>
          <li className="hover:bg-gray-700 p-3 rounded">
            <a href="#" className="flex items-center">
              <FaUser className="text-xl" />
              {isOpen && <span className="ml-3">Profile</span>}
            </a>
          </li>
          <li className="hover:bg-gray-700 p-3 rounded">
            <a href="#" className="flex items-center">
              <FaCog className="text-xl" />
              {isOpen && <span className="ml-3">Settings</span>}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;