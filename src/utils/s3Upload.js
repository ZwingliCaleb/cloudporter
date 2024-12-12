import {S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID); 
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);


export const s3Upload = async (file, bucketName, key) => {
    const s3 = new S3Client ({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    });

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    };

    try {
        const data = await s3.send(new PutObjectCommand(params));
        return data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}