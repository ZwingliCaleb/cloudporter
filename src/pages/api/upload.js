import multer from 'multer';
import { s3Upload, generatePresignedUrl } from '../utils/s3Upload';  // Correct import

// Configure multer to use memory storage (files are not saved to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');  // Only handle one file at a time

export default async function handler(req, res) {
    // Handle pre-signed URL request (GET)
    if (req.method === 'GET') {
        try {
            const { fileName, fileType } = req.query;  // Expecting filename and filetype from query params
            if (!fileName || !fileType) {
                return res.status(400).json({ success: false, message: 'Missing file name or type' });
            }

            const bucketName = process.env.AWS_BUCKET_NAME;
            if (!bucketName) {
                throw new Error('Bucket name is not defined in environment variables');
            }

            // Generate the pre-signed URL for file upload
            const preSignedUrl = await generatePresignedUrl(fileName, fileType, bucketName);

            return res.status(200).json({ success: true, preSignedUrl });
        } catch (error) {
            console.error('Error generating pre-signed URL:', error);
            return res.status(500).json({ success: false, message: `Failed to generate pre-signed URL: ${error.message}` });
        }
    }

    // Handle file upload request (POST)
    if (req.method === 'POST') {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file uploaded' });
            }

            try {
                const file = req.file;

                console.log("Uploaded File:", file);

                const bucketName = process.env.AWS_BUCKET_NAME;
                if (!bucketName) {
                    throw new Error('Bucket name is not defined in environment variables');
                }

                const key = `${Date.now()}-${file.originalname}`;

                console.log("Generated Key:", key);

                // Upload the file to S3
                const uploadData = await s3Upload(file, bucketName, key);

                return res.status(200).json({ success: true, data: uploadData });
            } catch (error) {
                console.error('Upload error:', error);
                return res.status(500).json({ success: false, message: `Upload failed: ${error.message}` });
            }
        });
    }
}
