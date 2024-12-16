import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import multer from 'multer';
import nextConnect from 'next-connect';

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 300000, // 5 minutes
    socketTimeout: 300000, // 5 minutes
  }),
});

// Configure multer for file handling (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Handle file upload API route
export const config = {
  api: {
    bodyParser: false,  // Disable default body parser to allow multer to parse form data
  },
};

const handler = nextConnect()
  .use(upload.single('file'))
  .post(async (req, res) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname, // Use the original file name as the key
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read', // Optional access control
    };

    try {
      const data = await s3.send(new PutObjectCommand(uploadParams));
      console.log('File uploaded successfully:', data);
      res.status(200).json({ success: true, message: 'File uploaded successfully' });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ success: false, message: 'Error uploading file', error: error.message });
    }
  })
  .all((req, res) => {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  });

export default handler;
