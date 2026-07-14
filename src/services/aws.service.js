import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

const s3Config = {
  region: process.env.AWS_REGION,
};

// Conditionally add credentials for local testing
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

const s3Client = new S3Client(s3Config);

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;
const CLOUDFRONT_KEY_PAIR_ID = process.env.CLOUDFRONT_KEY_PAIR_ID;

// Read the private key from the keys directory
let privateKey = '';
try {
  privateKey = fs.readFileSync(path.join(process.cwd(), 'keys', 'private_key.pem'), 'utf8');
} catch (error) {
  console.warn('Could not read CloudFront private key from keys/private_key.pem:', error.message);
}

/**
 * Uploads a file buffer to S3 and returns the relative path.
 * @param {Buffer} fileBuffer
 * @param {string} originalName
 * @param {string} mimetype
 * @returns {Promise<string>} The relative path (key) in S3
 */
export const uploadFileToS3 = async (fileBuffer, originalName, mimetype) => {
  const fileExtension = path.extname(originalName);
  const randomName = crypto.randomBytes(16).toString('hex');
  const key = `attachments/${randomName}${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype,
  });

  await s3Client.send(command);
  return key;
};

/**
 * Generates a CloudFront Signed URL for viewing a file.
 * @param {string} key The relative path (key) in S3
 * @returns {string} The signed URL
 */
export const generateSignedUrl = (key) => {
  if (!key) return null;
  if (!CLOUDFRONT_DOMAIN || !CLOUDFRONT_KEY_PAIR_ID || !privateKey) {
    console.warn('CloudFront configuration missing. Returning unsigned URL (which might not work if S3 is private).');
    return `https://${CLOUDFRONT_DOMAIN}/${key}`;
  }

  const url = `https://${CLOUDFRONT_DOMAIN}/${key}`;
  
  // URL expires in 1 hour
  const dateLessThan = new Date(Date.now() + 1000 * 60 * 60).toISOString();

  return getSignedUrl({
    url,
    keyPairId: CLOUDFRONT_KEY_PAIR_ID,
    privateKey: privateKey,
    dateLessThan,
  });
};
