import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Ensure the upload directory exists
const uploadDir = path.join(process.cwd(), 'public/uploads');
fs.mkdirSync(uploadDir, { recursive: true });

// Create DynamoDB client
const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// Formidable configuration
const form = formidable({
  uploadDir: uploadDir, // Temporary directory for file storage
  keepExtensions: true, // Keep file extensions
  maxFileSize: 10 * 1024 * 1024, // Max file size (10MB)
  multiples: false, // Single file upload
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, form-data is coming
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('Received a non-POST request');
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      res.status(500).json({ message: 'Error parsing form' });
      return;
    }

    const { name, email } = fields;
    const avatar = files.avatar ? files.avatar[0] : files.avatar;

    if (!name || !email || !avatar) {
      console.log('Missing fields:', { name, email, avatar });
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    console.log('Parsed file:', avatar);

    if (!avatar || !avatar.filepath) {
      console.log('Filepath is not defined for avatar');
      res.status(500).json({ message: 'Filepath is not defined' });
      return;
    }

    const s3Params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `avatars/${avatar.newFilename}`,
      Body: fs.createReadStream(avatar.filepath),
      ContentType: avatar.mimetype,
    };

    try {
      // Check if the file exists and is readable
      fs.accessSync(avatar.filepath, fs.constants.R_OK);

      console.log('Attempting to upload file to S3');
      const s3Data = await s3.send(new PutObjectCommand(s3Params));
      console.log('S3 response:', s3Data);

      // Construct the avatar URL
      const avatarUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/avatars/${avatar.newFilename}`;

      const dbParams = {
        TableName: 'users',  // Ensure this is your correct table name in DynamoDB
        Item: {
          email: { S: email },
          name: name,
          avatarUrl: avatarUrl,
        },
      };

      console.log('Attempting to save user details to DynamoDB');
      const dbData = await ddbDocClient.send(new PutCommand(dbParams));
      console.log('DynamoDB response:', dbData);

      // Respond with success
      res.status(200).json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error uploading to S3 or saving to DynamoDB:', error);
      
      // Check if the error is related to the S3 upload timeout
      if (error.name === 'RequestTimeout') {
        return res.status(500).json({ success: false, message: 'S3 request timed out, please try again' });
      }

      // Handle errors from file system or DynamoDB
      res.status(500).json({ success: false, message: 'Error uploading avatar or saving user data' });
    } finally {
      // Clean up the uploaded file in the server after it's been processed
      if (avatar && avatar.filepath) {
        fs.unlinkSync(avatar.filepath);
        console.log('Temporary file deleted');
      }
    }
  });
}
