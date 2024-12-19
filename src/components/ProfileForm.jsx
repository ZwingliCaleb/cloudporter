import React, { useState } from 'react';

const ProfileForm = () => {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!name || !email || !avatar) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('avatar', avatar); // Attach the file

      const response = await fetch('/api/profile', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Profile updated successfully');
      } else {
        setError(result.message || 'Error updating profile.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="avatar" className="block text-gray-600 mb-2">Avatar:</label>
          <input
            type="file"
            id="avatar"
            className="border rounded-lg p-2 w-full"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-600 mb-2">Name:</label>
          <input
            type="text"
            id="name"
            className="border rounded-md p-2 w-full"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600 mb-2">Email:</label>
          <input
            type="email"
            id="email"
            className="border rounded-md p-2 w-full"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Updating...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
