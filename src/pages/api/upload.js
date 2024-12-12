import multer from 'multer';
const { uploadFile } = require('../utils/s3Upload');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

export default async function handler(req, res) {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file Uploaded'});
        }

        try {
            const file = req.file;
            const bucketName = process.env.AWS_BUCKET_NAME;
            const key = `${Date.now()}-${file.originalname}`;

            const uploadData = await uploadFile(file, bucketName, key);

            res.status(200).json({ success: true, data: uploadData }); 
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ success: false, message: `Upload failed: ${error.message}`});
        }
    });
};