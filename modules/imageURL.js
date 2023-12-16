const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, Update} = require('@aws-sdk/client-s3');

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;


const s3 = new S3Client({
    credentials:{
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    region: bucketRegion
})

module.exports =  {
    getURL: async function(productImage) {
        const getObjectParams = {
            Bucket: bucketName,
            Key: productImage,
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return url;
    },
    saveImage: async function(buffer,mimetype, key){
        const params = {
            Body: buffer,
            Bucket: bucketName,
            ContentType: mimetype,
            Key: key
        }
        const command = new PutObjectCommand(params);
        const rs = await s3.send(command);
    }
}