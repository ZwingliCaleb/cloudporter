import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const handler = async (req, res) => {
  const { key } = req.query;

  console.log('Received delete request for key:', key); // Log the received key

  if (!key) {
    return res.status(400).json({ message: 'No key provided' });
  }

  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    console.log('Delete parameters:', params); // Log the delete parameters

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error); // Log detailed error
    res.status(500).json({ message: `Failed to delete file: ${error.message}` });
  }
};

export default handler;
