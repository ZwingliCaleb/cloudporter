import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import nextConnect from 'next-connect';
import fs from 'fs';
import path from 'path';

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure multer for file handling (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Handle file upload API route
export const config = {
  api: {
    bodyParser: false,  // Disable default body parser to allow multer to parse form data
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Use multer to parse the incoming form data (this happens in-memory)
    const uploadMiddleware = upload.single('file');

    // Handle the file upload through multer middleware
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error('Error during file upload:', err);
        return res.status(500).json({ success: false, message: 'Error during file upload' });
      }

      const file = req.file;

      if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
      }

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname, // Use the original file name as the key
        Body: file.buffer,
        ContentType: file.mimetype,
        //ACL: 'public-read',
      };

      try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        console.log('File uploaded successfully:', data);
        return res.status(200).json({ success: true, message: 'File uploaded successfully' });
      } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ success: false, message: 'Error uploading file' });
      }
    });
  } else {
    // If it's not a POST request, return a 405 Method Not Allowed
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
