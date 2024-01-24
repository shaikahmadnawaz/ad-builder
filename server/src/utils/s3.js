import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_ACCOUNT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCOUNT_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCOUNT_SECRET_ACCESS_KEY,
  },
});

const uploadOnS3 = async (file) => {
  try {
    if (!file) throw new Error("File is missing");

    // Replace spaces in the file name with underscores
    const sanitizedFileName = file.originalname.replace(/\s+/g, "_");

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: sanitizedFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Failed to upload file to S3:", error.message);
    throw new Error("Failed to upload file to S3");
  }
};

export { uploadOnS3 };
