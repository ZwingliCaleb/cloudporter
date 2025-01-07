import React, { useEffect, useState } from 'react';
import { CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import UserProfile from '../components/UserProfile';
import FileUploader from '../components/FileUploader';
import FileList from '../components/FileList';
import HamburgerMenu from '../components/HamburgerMenu';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [avatar, setAvatar] = useState(null); // Local state for the avatar image
  const [userInfo, setUserInfo] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cognitoClient = new CognitoIdentityProviderClient({
          region: "us-east-1",  // Add your AWS region here
        });

        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error("Access token not found. Redirecting to login");
          window.location.href = '/loginpage';  // Redirect to login page
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
          avatar: userAttributes.picture, // Assuming the avatar is stored as 'picture' attribute
          profileCompleted: userAttributes['custom:profileCompleted'] === 'true', // Custom attribute to track profile completion
        };

        setUserInfo(userInfo);
        setAvatar(userInfo.avatar);
        setIsProfileUpdated(userInfo.profileCompleted);
        setUser(userInfo);

        // Show profile pop-up if profile is not completed
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
    setShowUserProfile(true);
  };

  const handleAvatarUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const s3Client = new S3Client({
        region: "us-east-1",  // Set your AWS region
      });

      const bucketName = "cloudporter-uploads";  // Replace with your actual S3 bucket name
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

  const renderWelcomeMessage = () => {
    if (user) {
      return (
        <div className="flex items-center space-x-4">
          <div className="text-md font-semibold">
            Welcome back, {user.name}!
          </div>
          {avatar ? (
            <img src={avatar} alt="Avatar" className="w-12 h-12 rounded-full cursor-pointer" onClick={() => document.getElementById('avatarInput').click()} />
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

  return (
    <div className="rounded-lg shadow-lg w-full min-h-screen max-w-8xl mx-auto p-8 m-4">
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
        <div className="w-full flex justify-end mb-8">
          {user && renderWelcomeMessage()}
          <HamburgerMenu />
        </div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        {showUserProfile ? (
          <UserProfile className="bg-white p-6 rounded-lg shadow-md w-full" user={user} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
            <UserProfile className="bg-white p-6 rounded-lg shadow-md w-full" user={user} />
            <FileUploader className="bg-white p-6 rounded-lg shadow-md w-full" />
            <FileList />
          </div>
        )}
      </div>
      {showProfilePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-semibold mb-4">Complete Your Profile</h2>
            <p>Please complete your profile to get the best experience.</p>
            <div className="mt-4">
              <button onClick={handleProfileUpdate} className="btn btn-primary">Complete Profile</button>
              <button onClick={() => setShowProfilePopup(false)} className="btn btn-secondary ml-2">Later</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
