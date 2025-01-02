import { useState } from 'react';
import Modal from 'react-modal';

const ExpandableCard = ({ children, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div onClick={toggleModal} className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer">
        <div className="font-bold text-lg">{title}</div>
      </div>
      <Modal isOpen={isOpen} onRequestClose={toggleModal} className="modal" overlayClassName="overlay">
        <div className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
          <h2 className="font-bold text-xl mb-4">{title}</h2>
          <button onClick={toggleModal} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Close</button>
          {children}
        </div>
      </Modal>
    </div>
  );
};

const ProfileForm = () => {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]); // Get the first file from the input
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
        console.log('Profile successfully updated');
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
    }
  };

  return (
    <ExpandableCard title="User Profile">
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
        </form>
      </div>
    </ExpandableCard>
  );
};

export default ProfileForm;
