import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch files from the API
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/files');
        if (!response.ok) throw new Error('Failed to fetch files');
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  // Handle image preview click
  const handlePreviewClick = (file) => {
    setSelectedFile(file);
  };

  // Close the preview modal
  const handleClosePreview = () => {
    setSelectedFile(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h3 className="text-xl font-semibold mb-4">Files</h3>
      
      {/* Files List */}
      <div className="space-y-4 overflow-y-auto max-h-80">
        {files.length === 0 ? (
          <p>No files available</p>
        ) : (
          files.map((file) => (
            <div
              key={file.name}
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => handlePreviewClick(file)}
            >
              <div className="w-16 h-16 relative">
                <Image
                  src={`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.name}`}
                  alt={file.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <button
              onClick={handleClosePreview}
              className="absolute top-2 right-2 text-white bg-black p-2 rounded-full"
            >
              ✕
            </button>
            <div className="flex justify-center mb-4">
              <div className="w-64 h-64 relative">
                <Image
                  src={`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${selectedFile.name}`}
                  alt={selectedFile.name}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileList;
