import React from 'react';

const UserTab = ({ userName, avatar }) => {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md w-full text-center flex items-center">
      <div className="text-md font-semibold">
        Welcome, {userName}!
      </div>
      {avatar && <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full ml-4"/>}
    </div>
  );
}

export default UserTab;
