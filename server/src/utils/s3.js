import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

    // Logging additional information
    console.log("File buffer:", file.buffer);
    console.log("File name:", file.originalname);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("Failed to upload file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};

export { uploadOnS3 };
