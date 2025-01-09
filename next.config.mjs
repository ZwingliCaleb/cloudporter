/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      AWS_REGION: process.env.AWS_REGION,
      AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    },
    images: {
      domains: ['cloudporter-uploads.s3.us-east-1.amazonaws.com'], // Add your S3 domain here
    },
  };
  
  export default nextConfig;
  