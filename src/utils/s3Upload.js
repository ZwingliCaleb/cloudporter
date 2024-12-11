
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

/**
 * Upload a file to S3
 * @param {File} file The file to upload
 * @param {string} bucketName The S3 bucket name
 * @param {string} key The key path where the file will be stored in the s3 bucket
 * @returns {promise} Resolves with the upload data, or rejects with an error
 */

const uploadFile = (file, bucketName, key) => {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public read',
    };

    return s3.upload(params).promise();
};

module.exports = { uploadFile };