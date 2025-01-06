import { DynamoDBClient, GetCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import jwtDecode from 'jwt-decode'; // To decode the JWT token

// Set up DynamoDB and S3 clients
const dynamoDB = new DynamoDBClient({ region: 'us-east-1' });
const s3Client = new S3Client({ region: 'us-east-1' });

const getUserDataFromDynamoAndS3 = async (username) => {
  // Fetch data from DynamoDB
  const dynamoData = await dynamoDB.send(new GetCommand({
    TableName: 'users',
    Key: { email: username } // Assuming email is the partition key
  }));

  if (!dynamoData.Item) {
    throw new Error('User not found');
  }

  // Fetch avatar from S3
  const getObjectParams = {
    Bucket: 'cloudporter-uploads',
    Key: `uploads/${dynamoData.Item.avatarUrl.split('/').pop()}` // Assuming avatarUrl is stored in DynamoDB
  };
  const avatarUrl = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), { expiresIn: 3600 });

  return {
    ...dynamoData.Item,
    avatar: avatarUrl
  };
};

const handler = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    // Decode and verify the token
    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
      console.log('Decoded token:', decodedToken);
    } catch (error) {
      console.log('Invalid token:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Extract username from the decoded token
    const { email } = decodedToken;

    // If the requested username does not match the token's email, deny access
    const { username } = req.query;
    if (email !== username) {
      console.log(`Forbidden access: token email ${email} does not match requested username ${username}`);
      return res.status(403).json({ error: 'Forbidden: You cannot access this data' });
    }

    // Fetch user data from DynamoDB and S3
    const userData = await getUserDataFromDynamoAndS3(username);
    res.status(200).json(userData);

  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

export default handler;

