const multer = require('multer');
const { s3 } = require('../s3Config')
const crypto = require('crypto');

let upload = multer({
    limits: 1024 * 1024 * 5,
    fileFilter: function (req, file, next) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp') {
            next(null, true)
        } else {
            next('milter error -file type is not supported', false)
        }
    }
})

let uploadTos3 = (fileData) => {
    return new Promise((resolve, reject) => {
        const uuid = crypto.randomBytes(6).toString("hex");
        const fileName = `${uuid}_${Date.now().toString()}.webp`;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: fileData,
            ContentType: "image/webp"
        }

        const bucketParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
        };

        s3.headBucket(bucketParams, function (err, data) {
            if (err) {
                // bucket might not exist or access is denied
                reject('Bucket might not exist or access is denied');
            } else {
                // Bucket exists and accessible, you can proceed with putObject or other operations
                const request = s3.putObject(params);
                request.on('httpHeaders', (statusCode, headers) => {
                    resolve({
                        url: `https://ipfs.filebase.io/ipfs/${headers['x-amz-meta-cid']}`,
                        fileName: fileName
                    })
                });
                request.on('httpError', (error, response) => {
                    console.log('request error', error)
                    reject(error)
                });
                request.send();
            }
        });
    })
}

const deleteS3Object = async (path) => {

    const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: path,
    };

    await s3.deleteObject(deleteParams).promise();
};

module.exports = {
    upload: upload,
    uploadTos3: uploadTos3,
    deleteS3Object: deleteS3Object,
};