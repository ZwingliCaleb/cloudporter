import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

export const s3Upload = async (file, bucketName, key) => {
    const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: 'application/octet-stream',
        ACL: 'public-read',
    };

    try {
        const data = await s3.send(new PutObjectCommand(params));
        console.log("Upload succesful:", data);
        return data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export const generatePresignedUrl = async (fileName, fileType, bucketName) => {
    const s3 = new S3Client ({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    });

    const params = {
        BucketName: bucketName,
        Key: fileName,
        ContentType: fileType,
        ACL: 'public-read',
        Expires: 3600,
    };

    try {
        const command = new PutObjectCommand(params);
        const presignedUrl = await s3.getSignedUrl(command, {expiresIn: 3600 });
        console.log("Generated pre-signed URL:", presignedUrl);
        return presignedUrl;
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        throw new Error('Error generating pre-signed URL: ' + error.message);
    }
}
