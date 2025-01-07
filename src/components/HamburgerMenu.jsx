import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Auth from '../services/Auth';

const HamburgerMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    Auth.logout();
    router.push('/loginpage');  // Redirect to login page after logout
  };

  return (
    <div className="relative">
      <button onClick={toggleMenu} className="p-2 focus:outline-none">
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
          <a
            href="#"
            onClick={handleLogout}
            className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
          >
            Logout
          </a>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
