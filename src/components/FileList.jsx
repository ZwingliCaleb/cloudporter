import { useState, useEffect } from 'react';
import ExpandableCard from './ExpandableCard';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure Font Awesome is included

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/files');
        const fileList = await response.json();
        if (Array.isArray(fileList)) {
          setFiles(fileList);
        } else {
          throw new Error('Parsed response is not an array');
        }
      } catch (error) {
        console.error('Error fetching files:', error);
        setError('Failed to fetch files. Please try again later.');
      }
    };

    fetchFiles();
  }, []);

  const handleDownload = async (key) => {
    try {
      const response = await fetch(`/api/download?key=${encodeURIComponent(key)}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = key.split('/').pop(); // Extract file name
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async (key) => {
    console.log('Attempting to delete file with key:', key);
    try {
      const response = await fetch(`/api/delete?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFiles(files.filter(file => file.name !== key));
      } else {
        console.error('Error deleting file:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <ExpandableCard
      title="File List"
      description="View all your uploaded files here."
      buttonLabel="Refresh List"
      onButtonClick={() => window.location.reload()}
    >
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Uploaded Files</h2>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="space-y-4">
          {Array.isArray(files) && files.map((file, index) => (
            <li key={index} className="border border-gray-300 p-4 rounded-md flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-800">{file.name.split('/').pop()}</span>
                <div className="text-sm text-gray-500">Size: {formatFileSize(file.size)}</div>
                <div className="text-sm text-gray-500">Uploaded: {formatDateTime(file.lastModified)}</div>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700" onClick={() => handleDownload(file.name)}>
                  <i className="fas fa-download"></i>
                </button>
                <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(file.name)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ExpandableCard>
  );
};

// Utility functions for formatting file size and date
const formatFileSize = (size) => {
  if (size < 1024) return `${size} bytes`;
  size = size / 1024;
  if (size < 1024) return `${size.toFixed(2)} KB`;
  size = size / 1024;
  if (size < 1024) return `${size.toFixed(2)} MB`;
  size = size / 1024;
  return `${size.toFixed(2)} GB`;
};

const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${formattedDate} at ${formattedTime}`;
};

export default FileList;
