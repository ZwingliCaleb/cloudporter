import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const s3Upload = async (file, bucketName, key) => {
    // Debugging log statements to ensure environment variables are set
    console.log('AWS_REGION:', process.env.AWS_REGION);
    console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
    console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY);
    console.log('Bucket Name:', process.env.AWS_BUCKET_NAME);
    console.log('Key:', key)

    // Ensure AWS Region and Credentials are set correctly
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        throw new Error('AWS environment variables are missing');
    }

    // If you want to use bucketName passed as an argument, you can pass it in the function call
    const finalBucketName = bucketName || process.env.AWS_BUCKET_NAME;

    const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    const params = {
        Bucket: finalBucketName,          // The name of your S3 bucket
        Key: key,                    // The name (or path) for the uploaded file
        Body: file.buffer,           // The file's buffer data
        ContentType: file.mimetype,  // MIME type of the file (e.g., 'image/jpeg', 'text/plain')
        ACL: 'public-read',          // Sets the file to be publicly accessible
    };

    console.log("AWS Configuration:", {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    // Log the parameters for debugging purposes
    console.log("Uploading with params:", params);

    try {
        // Send the PutObjectCommand to S3 to upload the file
        const data = await s3.send(new PutObjectCommand(params));
        console.log("Upload successful:", data);
        return data;  // Return data if upload is successful
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;  // Re-throw the error to be handled by the calling function
    }
};
