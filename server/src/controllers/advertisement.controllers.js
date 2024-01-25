import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Advertisement from "../models/advertisement.model.js";
import { deleteOnS3, uploadOnS3 } from "../utils/s3.js";
import Analytics from "../models/analytics.model.js";

const createAdvertisement = asyncHandler(async (req, res) => {
  const { title, description, targetAudience, scheduling, duration } = req.body;

  if (!title || !description || !targetAudience || !duration || !scheduling) {
    throw new ApiError(400, "Missing required fields");
  }

  const mediaFile = req.file;
  console.log("media file", mediaFile);

  if (!mediaFile) {
    throw new ApiError(400, "Missing media");
  }

  try {
    await uploadOnS3(mediaFile);

    const sanitizedFileName = mediaFile.originalname.replace(/\s+/g, "_");

    const mediaUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${sanitizedFileName}`;
    console.log("mediaUrl", mediaUrl);

    const advertisement = await Advertisement.create({
      title,
      description,
      targetAudience,
      media: mediaUrl,
      duration,
      scheduling,
      advertiser: req.user._id,
    });

    res
      .status(201)
      .json(new ApiResponse(201, { advertisement }, "Advertisement created"));
  } catch (error) {
    console.error("Error creating advertisement:", error.message);
    throw new ApiError(500, "Cannot create advertisement");
  }
});

const getAdvertisement = asyncHandler(async (req, res) => {
  const { advertisementId } = req.params;

  const advertisement = await Advertisement.findById(advertisementId);

  if (!advertisement) {
    throw new ApiError(404, "Advertisement not found");
  }

  await incrementAnalytics(advertisementId, "views");

  res
    .status(200)
    .json(new ApiResponse(200, { advertisement }, "Advertisement fetched"));
});

const incrementAnalytics = async (advertisementId, field) => {
  try {
    let analyticsData = await Analytics.findOne({
      advertisement: advertisementId,
    });

    if (!analyticsData) {
      analyticsData = await Analytics.create({
        advertisement: advertisementId,
      });
    }

    analyticsData[field] += 1;
    await analyticsData.save();
  } catch (error) {
    console.error(`Error tracking ${field}:`, error.message);
  }
};

const updateAdvertisement = asyncHandler(async (req, res) => {
  const { advertisementId } = req.params;
  const { title, description, targetAudience, scheduling, duration } = req.body;

  if (!title || !description || !targetAudience || !duration || !scheduling) {
    throw new ApiError(400, "Missing required fields");
  }

  console.log("req.file", req.file);

  const mediaFile = req.file;

  try {
    await uploadOnS3(mediaFile);

    const sanitizedFileName = mediaFile.originalname.replace(/\s+/g, "_");

    const mediaUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${sanitizedFileName}`;

    const updatedAdvertisement = await Advertisement.findByIdAndUpdate(
      advertisementId,
      {
        title,
        description,
        targetAudience,
        scheduling,
        duration,
        media: mediaUrl,
      },
      { new: true }
    );

    if (!updatedAdvertisement) {
      throw new ApiError(404, "Advertisement not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { advertisement: updateAdvertisement },
          "Advertisement updated"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Cannot update advertisement");
  }
});

const deleteAdvertisement = asyncHandler(async (req, res) => {
  const { advertisementId } = req.params;

  const advertisement = await Advertisement.findById(advertisementId);

  if (advertisement.advertiser.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Forbidden");
  }

  try {
    const deletedAdvertisement = await Advertisement.findByIdAndDelete(
      advertisementId
    );

    if (!deletedAdvertisement) {
      throw new ApiError(404, "Advertisement not found");
    }

    // Extract the file name from the media URL or adjust based on your model structure
    const fileName = extractFileNameFromUrl(deletedAdvertisement.media);

    // Delete the file from S3
    await deleteOnS3(fileName);

    res.status(200).json(new ApiResponse(200, {}, "Advertisement deleted"));
  } catch (error) {
    throw new ApiError(500, "Cannot delete advertisement");
  }
});

// Add a helper function to extract the file name from the S3 URL
const extractFileNameFromUrl = (url) => {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 1];
};

const getAllAdvertisements = asyncHandler(async (req, res) => {
  const advertisements = await Advertisement.find({
    advertiser: req.user._id,
  }).select("-advertiser");

  res
    .status(200)
    .json(new ApiResponse(200, { advertisements }, "Advertisements fetched"));
});

export {
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getAllAdvertisements,
  getAdvertisement,
};
