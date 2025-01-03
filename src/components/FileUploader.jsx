import { useState, useEffect } from 'react';
import ExpandableCard from './ExpandableCard'; // Adjust the import path as necessary

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId') || 'defaultUserId';
    setUserId(userIdFromStorage);
  }, [setUserId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = [
      'image/jpeg', 'image/png', 'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (file && allowedTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid file type (JPEG, PNG, PDF, DOC, DOCX, XLS, XLSX).');
    }
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
    <ExpandableCard
      title="File Uploader"
      description="Upload your files to the S3 bucket securely."
      buttonLabel="Start Upload"
      onButtonClick={handleUpload}
    >
      <div className="flex flex-col items-center justify-center">
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
