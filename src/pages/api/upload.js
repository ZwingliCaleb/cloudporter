const { uploadFile } = require('../utils/s3Upload');
const path = require('path');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
           const file = req.file;
           const bucketName = process.env.cloudporter-uploads;
           const key = `${Date.now()}-${file.originalname}`;
           
           const uploadData = await uploadFile(file, bucketName, key);

           res.status(200).json({ success: true, data: uploadData });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message});
        } 
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
};