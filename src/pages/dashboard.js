import React, { useEffect, useState } from 'react';
import { CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import UserProfile from '../components/UserProfile';
import FileUploader from '../components/FileUploader';
import FileList from '../components/FileList';
import Sidebar from '../components/Sidebar'; // Import the Sidebar component
import Image from 'next/image';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar toggle

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cognitoClient = new CognitoIdentityProviderClient({
          region: "us-east-1",
        });

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error("Access token not found. Redirecting to login");
          window.location.href = '/loginpage';
          return;
        }

        const command = new GetUserCommand({
          AccessToken: accessToken,
        });

        const data = await cognitoClient.send(command);

        const userAttributes = data.UserAttributes.reduce((acc, attr) => {
          acc[attr.Name] = attr.Value;
          return acc;
        }, {});

        const userInfo = {
          name: userAttributes.name,
          email: userAttributes.email,
          avatar: userAttributes.picture,
          profileCompleted: userAttributes['custom:profileCompleted'] === 'true',
        };

        setUserInfo(userInfo);
        setAvatar(userInfo.avatar);
        setIsProfileUpdated(userInfo.profileCompleted);
        setUser(userInfo);

        if (!userInfo.profileCompleted) {
          setShowProfilePopup(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = () => {
    setShowProfilePopup(false);
    setShowUserProfile(true);
  };

  const handleAvatarUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const s3Client = new S3Client({
        region: "us-east-1",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
      });

      const bucketName = "cloudporter-uploads";
      const key = `avatars/${file.name}`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file,
        ContentType: file.type,
      });

      const uploadResponse = await s3Client.send(command);
      const avatarUrl = `https://${bucketName}.s3.${"us-east-1"}.amazonaws.com/${key}`;
      setAvatar(avatarUrl);

      console.log('Avatar uploaded successfully!', uploadResponse);
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
  }

  const closePreview = () => {
    setSelectedFile(null);
  }

  const renderWelcomeMessage = () => {
    if (user) {
      return (
        <div className="flex items-center space-x-4">
          <div className="text-md font-semibold">
            Welcome back, {user.name}!
          </div>
          {avatar ? (
            <div className="w-12 h-12 rounded-full cursor-pointer" onClick={() => document.getElementById('avatarInput').click()}>
              <Image
                src={avatar}
                alt="Avatar"
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer" onClick={() => document.getElementById('avatarInput').click()}>
              {user.name.charAt(0)}
            </div>
          )}
          <input
            type="file"
            id="avatarInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarUpload}
          />
        </div>
      );
    }
  };

  const handleProfileUpdateCallback = (updatedName, updatedAvatarUrl) => {
    setUser(prevUser => ({
      ...prevUser,
      name: updatedName,
      avatar: updatedAvatarUrl,
    }));
    setAvatar(updatedAvatarUrl);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="rounded-lg shadow-lg w-full min-h-screen max-w-8xl mx-auto p-8 m-4">
          <div className="min-h-screen flex flex-col items-center py-8">
            <div className="w-full flex justify-end mb-8">
              {user && renderWelcomeMessage()}
            </div>
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
              <UserProfile className="bg-white p-6 rounded-lg shadow-md w-full" user={user} onProfileUpdate={handleProfileUpdateCallback} autoEdit={showUserProfile} />
              <FileUploader className="bg-white p-6 rounded-lg shadow-md w-full" />
              <FileList />
            </div>
          </div>
          {showProfilePopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <h2 className="text-lg font-semibold mb-4">Complete Your Profile</h2>
                <p>Please complete your profile to get the best experience.</p>
                <div className="mt-4">
                  <button onClick={handleProfileUpdate} className="btn btn-primary p-2 bg-teal-200 hover:bg-teal-400 rounded-md">Complete Profile</button>
                  <button onClick={() => setShowProfilePopup(false)} className="btn btn-secondary p-2 ml-2 bg-blue-200 hover:bg-blue-400 rounded-md">Later</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;