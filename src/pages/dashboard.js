import React, { useEffect, useState } from 'react';
import UserProfile from '../components/UserProfile';
import FileUploader from '../components/FileUploader';
import FileList from '../components/FileList';
// import ActivityLog from '../components/ActivityLog';
// import Notifications from '../components/Notifications';
import UserTab from '../components/UserTab';
import HamburgerMenu from '../components/HamburgerMenu';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
  
        // Decode the token to extract the user's email
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const email = decodedToken.email;
  
        const response = await fetch(`/api/user?username=${encodeURIComponent(email)}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        console.log('Fetch response:', response);
  
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
  
        const userInfo = await response.json();
        setUser(userInfo);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);
   // Empty dependency array means this runs once after the component mounts

  return (
    <div className="rounded-lg shadow-lg w-full min-h-screen max-w-8xl mx-auto p-8 m-4">
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
        <div className="w-full flex justify-end mb-8">
          {user && (
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
              <div className="text-md font-semibold">
                Welcome, {user.username}!
              </div>
              {user.avatar && <img src={user.avatar} alt="Avatar" className="w-12 h-12 rounded-full"/>}
              <HamburgerMenu />
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
          <UserProfile className="bg-white p-6 rounded-lg shadow-md w-full" user={user}/>
          <FileUploader className="bg-white p-6 rounded-lg shadow-md w-full"/>
          <FileList />
          {/* <ActivityLog /> */}
          {/* <Notifications /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
