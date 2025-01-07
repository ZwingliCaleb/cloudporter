import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Set up S3 and DynamoDB clients
const s3Client = new S3Client({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));

// Function to get the avatar from S3 using a signed URL
const getAvatarUrl = async (avatarKey) => {
  const getObjectParams = {
    Bucket: 'cloudporter-uploads',
    Key: `uploads/${avatarKey}`,
  };
  const avatarUrl = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), { expiresIn: 3600 });
  return avatarUrl;
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Fetch user data from DynamoDB
      const dbParams = {
        TableName: 'users',
        Key: { email },
      };

      const result = await ddbDocClient.send(new GetCommand(dbParams));

      if (!result.Item) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userData = result.Item;

      // Get avatar URL from S3
      const avatarUrl = await getAvatarUrl(userData.avatarUrl);

      // Return the user data along with profileCompleted and avatar URL
      res.status(200).json({
        name: userData.name,
        email: userData.email,
        avatar: avatarUrl,
        profileCompleted: userData.profileCompleted || false, // Check if profile is completed
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
