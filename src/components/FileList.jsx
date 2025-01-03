import { useState, useEffect } from 'react';
import ExpandableCard from './ExpandableCard';

// Utility function to format file size
const formatFileSize = (size) => {
  if (size < 1024) return `${size} bytes`;
  size = size / 1024;
  if (size < 1024) return `${size.toFixed(2)} KB`;
  size = size / 1024;
  if (size < 1024) return `${size.toFixed(2)} MB`;
  size = size / 1024;
  return `${size.toFixed(2)} GB`;
};

// Utility function to format date time
const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${formattedDate} at ${formattedTime}`;
};

// Utility function to extract the file name from the full path
const extractFileName = (filePath) => {
  const parts = filePath.split('/');
  return parts[parts.length - 1];
};

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
                <span className="font-medium text-gray-800">{extractFileName(file.name)}</span>
                {/* Display additional file details here */}
                <div className="text-sm text-gray-500">Size: {formatFileSize(file.size)}</div>
                <div className="text-sm text-gray-500">Uploaded: {formatDateTime(file.lastModified)}</div>
              </div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                Download
              </button>
            </li>
          ))}
        </ul>
      </div>
    </ExpandableCard>
  );
};

export default FileList;
