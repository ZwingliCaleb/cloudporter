import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import formidable from 'formidable';
import fs from 'fs';

// Set up S3 and DynamoDB clients
const s3Client = new S3Client({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));

export const config = {
  api: {
    bodyParser: false, // We are using formidable to parse the form data
  },
};

// Function to upload file to S3
const uploadFileToS3 = async (file) => {
  // Log file details to understand the structure
  console.log('File received for S3 upload:', file);

  if (!file.filepath) {
    throw new Error('File path is undefined');
  }

  const fileStream = fs.createReadStream(file.filepath);
  const s3Params = {
    Bucket: 'cloudporter-uploads',
    Key: `uploads/${file.newFilename}`, // Ensure unique filenames
    Body: fileStream,
    ContentType: file.mimetype,
  };

  const uploadResult = await s3Client.send(new PutObjectCommand(s3Params));
  return `https://cloudporter-uploads.s3.amazonaws.com/uploads/${file.newFilename}`;
};

export default async function handler(req, res) {
  let avatar; // Declare avatar at a higher scope
  if (req.method === 'POST') {
    const form = formidable({
      uploadDir: './public/uploads', // Upload directory
      keepExtensions: true,         // Keep file extension
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing the form' });
      }

      // Log parsed fields and files for debugging
      console.log('Fields:', fields);
      console.log('Files:', files);

      try {
        const { name, email } = fields;  // Destructure fields for name and email
        avatar = files.avatar ? files.avatar[0] : null; // Access the first file in the array

        // Ensure all required fields are provided
        if (!avatar || !name || !email) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Step 1: Upload the avatar to S3
        const avatarUrl = await uploadFileToS3(avatar);

        // Step 2: Save user details to DynamoDB
        const dbParams = {
          TableName: 'users',
          Item: {
            email: email[0],  // email is the partition key, assuming it's an array
            name: name[0],     // User's name
            avatarUrl: avatarUrl, // S3 URL for the avatar
          },
        };

        await ddbDocClient.send(new PutCommand(dbParams));

        // Step 3: Respond to the client
        res.status(200).json({ message: 'Profile successfully updated', avatarUrl });
      } catch (error) {
        console.error('Error uploading to S3 or saving to DynamoDB:', error);
        res.status(500).json({ error: 'Error uploading profile' });
      }
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Finally block for cleanup
try {
  if (avatar && avatar.filepath) {
    fs.unlink(avatar.filepath, (err) => {
      if (err) {
        console.error('Error deleting temp file:', err);
      } else {
        console.log('Temp file deleted:', avatar.filepath);
      }
    });
  } else {
    console.error('No file found to delete');
  }
} catch (err) {
  console.error('Error in finally block:', err);
}

}
