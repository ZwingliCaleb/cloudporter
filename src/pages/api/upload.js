import multer from 'multer';
import { s3Upload } from '../utils/s3Upload';  // Ensure correct import of the s3Upload function

// Configure multer to use memory storage (files are not saved to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');  // Only handle one file at a time

export default async function handler(req, res) {
    // Use multer to process the file in the request
    upload(req, res, async (err) => {
        if (err) {
            // Multer error (e.g., file size limit or invalid file type)
            return res.status(500).json({ success: false, message: err.message });
        }

        // Check if the file is present
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        try {
            const file = req.file;

            // Log the file to ensure it's being processed correctly
            console.log("Uploaded File:", file);

            // Ensure the bucket name is loaded from environment variables
            const bucketName = process.env.AWS_BUCKET_NAME;
            if (!bucketName) {
                throw new Error('Bucket name is not defined in environment variables');
            }

            // Create a unique key for the file in the S3 bucket
            const key = `${Date.now()}-${file.originalname}`;

            // Log the key for debugging
            console.log('File:', file);
            console.log("Generated Key:", key);

            // Upload the file to S3
            const uploadData = await s3Upload(file, bucketName, key); // Ensure key is passed here

            // Respond with success
            return res.status(200).json({ success: true, data: uploadData });
        } catch (error) {
            // Handle any errors during the upload
            console.error('Upload error:', error);
            return res.status(500).json({ success: false, message: `Upload failed: ${error.message}` });
        }
    });
}
