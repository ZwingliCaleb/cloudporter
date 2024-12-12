import React from 'react';
import { useState } from 'react';
import { s3Upload } from '../utils/s3Upload';

const FileUploader = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setStatus("No file selected");
            return;
        }

        setUploading(true);
        setStatus("Uploading file...");

        try {
            const uploadResult = await s3Upload(file);
            setStatus (`Upload successful: ${uploadResult.Location}`);
        } catch (error) {
            setStatus (`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

  return (
    <div>
        <input type="file" onChange={handleFileChange}/>
        <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload File'}
        </button>
        {status && <p>{status}</p>}
    </div>
  )
}

export default FileUploader;