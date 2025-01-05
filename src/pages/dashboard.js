import React from 'react';
import UserProfile from '../components/UserProfile';
import FileUploader from '../components/FileUploader';
import FileList from '../components/FileList';
//import ActivityLog from '../components/ActivityLog';
//import Notifications from '../components/Notifications';

const dashboard = () => {
  return (
    <div className="rounded-lg shadow-lg w-full min-h-screen max-w-8xl mx-auto p-8 m-4">
      <div className = "min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        <UserProfile className="bg-white p-6 rounded-lg shadow-md w-full"/>
        <FileUploader className="bg-white p-6 rounded-lg shadow-md w-full"/>
        <FileList />
        {/*<ActivityLog />
        <Notifications /> */}
      </div>
      </div>
    </div>
  )
}

export default dashboard