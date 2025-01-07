import { useState } from 'react';
import ExpandableCard from './ExpandableCard';

const ProfileForm = () => {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('avatar', avatar);
    formData.append('name', name);
    formData.append('email', email);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Profile successfully updated');
        // After profile update, mark the profile as complete in the backend
        const userResponse = await fetch('/api/user/markComplete', { method: 'POST' });
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      setMessage('Error submitting profile');
    }
  };

  return (
    <ExpandableCard
      title="User Profile"
      description="Update your profile information and avatar."
      buttonLabel="Save Changes"
      onButtonClick={handleSubmit}
    >
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {avatar && (
              <img
                src={URL.createObjectURL(avatar)}
                alt="Avatar Preview"
                className="mt-4 w-32 h-32 object-cover rounded-full mx-auto"
              />
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
          {message && <p className="mt-4 text-center text-green-500">{message}</p>}
        </form>
      </div>
    </ExpandableCard>
  );
};

export default ProfileForm;
