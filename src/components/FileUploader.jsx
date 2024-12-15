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

    const getPresignedUrl = async (file) => {
        const response = await fetch('/api/upload');
        const data = await response.json();

        return data.presignedUrl;
    }

    const handleUpload = async () => {
        if (!file) {
            setStatus("No file selected");
            return;
        }

        setUploading(true);
        setStatus("Uploading file...");

        try {
            const presignedUrl = await getPresignedUrl(file);
            const uploadResult = await uploadFileToS3(presignedUrl, file);
            setStatus (`Upload successful: ${uploadResult.Location}`);
        } catch (error) {
            setStatus (`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const uploadFileToS3 = async (URL, file) => {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type,
            },
            body: file,
        });
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        return response;
    }

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