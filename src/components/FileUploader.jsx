import { useState, useEffect } from 'react';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect (() => {
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
      alert ('User not authenticated.')
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

      // Check if the response is okay (200 range)
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
  );
};

export default UploadPage;
