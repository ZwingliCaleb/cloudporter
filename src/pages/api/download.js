import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    Credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

const handler = async (req, res) => {
    const { key } = req.query;

    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
        };

        const command = new GetObjectCommand(params);
        const data = await s3Client.send(command);

        data.Body.pipe(res);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ message: `Failed to download file: ${error.message}` });
    }
};

export default handler;