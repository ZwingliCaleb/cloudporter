import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME;
const uploadsPrefix = 'uploads/'; // Match the prefix used in upload.js

const handler = async (req, res) => {
  console.log('API Route Hit: /api/files'); // Log to verify route is hit
  console.log('Bucket Name:', bucketName); // Log bucket name to ensure it's set
  console.log('Prefix:', uploadsPrefix); // Log prefix to ensure it's set

  if (req.method === 'GET') {
    try {
      const params = {
        Bucket: bucketName,
        Prefix: uploadsPrefix, // Use the correct prefix to list files
      };

      const command = new ListObjectsV2Command(params);
      const data = await s3Client.send(command);
      console.log('S3 Response:', data); // Log the full S3 response

      const files = data.Contents?.map(item => ({ name: item.Key })) || [];
      console.log('Fetched Files:', files); // Log fetched files

      res.status(200).json(files);
    } catch (error) {
      console.error('Error listing files:', error); // Log detailed error
      res.status(500).json({ message: `Failed to list files: ${error.message}` });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;
