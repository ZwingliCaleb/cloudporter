import { useState, useEffect } from 'react';
import ExpandableCard from './ExpandableCard';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure Font Awesome is included
import Image from 'next/image'; // Import Next.js Image component

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [previewFile, setPreviewFile] = useState(null); // Preview state
  const [previewUrl, setPreviewUrl] = useState(null);  // Preview URL
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [modalUrl, setModalUrl] = useState(null); // Modal image URL

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

  const handlePreview = async (key) => {
    try {
      const response = await fetch(`/api/download?key=${encodeURIComponent(key)}`);
      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      setPreviewFile(key);
      setPreviewUrl(fileUrl);
    } catch (error) {
      console.error('Error previewing file:', error);
    }
  };

  const handleModalOpen = (fileUrl) => {
    setModalUrl(fileUrl);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalUrl(null);
  };

  const renderPreview = () => {
    if (!previewUrl) return null;
    const fileExtension = previewFile.split('.').pop().toLowerCase();

    if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
      return (
        <Image 
          src={previewUrl} 
          alt="File preview" 
          className="mt-4 cursor-pointer" 
          onClick={() => handleModalOpen(previewUrl)} 
          width="max-w-full"
          height="max-h-64"
        />
      );
    } else {
      return <p className="text-gray-500 mt-4">Preview not available for this file type.</p>;
    }
  };

  const renderModal = () => {
    if (!isModalOpen || !modalUrl) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-md max-w-3xl max-h-96 overflow-hidden relative shadow-lg">
          <button 
            className="absolute top-2 right-2 text-white font-bold text-xl"
            onClick={handleModalClose}
          >
            X
          </button>
          <img src={modalUrl} alt="Full preview" className="w-full h-auto object-contain" />
        </div>
      </div>
    );
  };

  return (
    <ExpandableCard
      title="File List"
      description="View all your uploaded files here."
      buttonLabel="Refresh List"
      onButtonClick={() => window.location.reload()}
    >
      <div className="bg-white shadow-md rounded-lg p-8 w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">Uploaded Files</h2>
        {error && <p className="text-red-500">{error}</p>}
        
        {/* Adjust the width and height of the file list container */}
        <div className="w-full max-h-80 overflow-y-auto overflow-x-hidden">
          <ul className="space-y-4">
            {Array.isArray(files) && files.map((file, index) => (
              <li 
                key={index} 
                className="border border-gray-300 p-4 rounded-md flex justify-between items-center w-full"
              >
                <div className="flex-1 min-w-0">
                  {/* Ensure text doesn't wrap and stays within the width */}
                  <span className="font-medium text-gray-800 block truncate">{file.name.split('/').pop()}</span>
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
                  <div 
                    className="cursor-pointer" 
                    onClick={() => handlePreview(file.name)}
                  >
                    <img 
                      src={file.thumbnailUrl || previewUrl} 
                      alt="File preview" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Preview section */}
        {previewFile && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Preview: {previewFile.split('/').pop()}</h3>
            {renderPreview()}
          </div>
        )}
      </div>

      {/* Modal for image preview */}
      {renderModal()}
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