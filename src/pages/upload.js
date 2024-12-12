import React from 'react';
import FileUploader from '../components/FileUploader';

const UploadPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="p-6 text-5xl font-extrabold text-gray-800">Upload Page</h1>
        <FileUploader/>
    </div>
  )
}

export default UploadPage;