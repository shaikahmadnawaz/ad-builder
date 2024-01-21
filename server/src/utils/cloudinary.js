import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  console.log(localFilePath);
  console.log("uploading to cloudinary");
  console.log(process.env.CLOUDINARY_CLOUD_NAME);
  console.log(process.env.CLOUDINARY_API_KEY);
  console.log(process.env.CLOUDINARY_API_SECRET);
  try {
    if (!localFilePath) throw new Error("Local file path is missing");

    // Upload to cloudinary if localFilePath exists
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded to Cloudinary:", result.url);

    fs.unlinkSync(localFilePath); // Remove file from localFilePath after uploading to Cloudinary
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    fs.unlinkSync(localFilePath);
    throw error;
  }
};

const deleteOnCloudinary = async (public_id, resource_type = "image") => {
  try {
    if (!public_id) return null;

    //delete file from cloudinary
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: `${resource_type}`,
    });
  } catch (error) {
    return error;
    console.log("delete on cloudinary failed", error);
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
