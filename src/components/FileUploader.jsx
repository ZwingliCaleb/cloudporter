import { useState, useEffect } from 'react';
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

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId') || 'defaultUserId';
    setUserId(userIdFromStorage)
  }, [setUserId]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    if (!userId) {
      alert('User not authenticated.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', userId);

    try {
      setUploading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('File uploaded successfully!');
      } else {
        setMessage('Error uploading file: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ExpandableCard title="File Uploader">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl mb-4">Upload File to S3</h1>
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button
          className={`px-6 py-3 ${uploading ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded`}
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </ExpandableCard>
  );
};

export default FileUploader;
