import React from 'react';

const HamburgerMenu = () => {
  const handleLogout = () => {
    // Implement logout functionality
    console.log("Logging out...");
    // Redirect to login page or handle logout as required
  };

  return (
    <div className="relative">
      <button className="bg-gray-800 text-white p-2 rounded-lg shadow-md focus:outline-none">
        ☰
      </button>
      <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-40">
        <button className="block w-full px-4 py-2 text-left" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default HamburgerMenu;
