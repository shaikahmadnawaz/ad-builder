import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Advertisement from "../models/advertisement.model.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const createAdvertisement = asyncHandler(async (req, res) => {
  const { title, description, targetAudience, scheduling, duration } = req.body;

  if (!title || !description || !targetAudience || !duration || !scheduling) {
    throw new ApiError(400, "Missing required fields");
  }

  const mediaContent = req.file?.path;
  console.log("mediaContent", mediaContent);

  try {
    const mediaUrl = await uploadOnCloudinary(mediaContent);
    console.log("mediaUrl", mediaUrl);

    if (!mediaUrl) {
      throw new ApiError(500, "Cannot upload media");
    }

    console.log(mediaUrl.url);

    const advertisement = await Advertisement.create({
      title,
      description,
      targetAudience,
      media: mediaUrl.url, // Use 'secure_url' instead of 'url'
      duration,
      scheduling,
      advertiser: req.user._id,
    });

    res
      .status(201)
      .json(new ApiResponse(201, { advertisement }, "Advertisement created"));
  } catch (error) {
    console.error("Error creating advertisement:", error);
    throw new ApiError(500, "Cannot create advertisement");
  }
});

const updateAdvertisement = asyncHandler(async (req, res) => {
  const { advertisementId } = req.params;
  const { title, description, targetAudience, scheduling, duration } = req.body;

  if (!title || !description || !targetAudience || !duration || !scheduling) {
    throw new ApiError(400, "Missing required fields");
  }

  console.log("req.file", req.file);

  const mediaContent = req.file?.path;

  const mediaUrl = await uploadOnCloudinary(mediaContent);

  try {
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

    await deleteOnCloudinary(deletedAdvertisement.media.public_id);

    res.status(200).json(new ApiResponse(200, {}, "Advertisement deleted"));
  } catch (error) {
    throw new ApiError(500, "Cannot delete advertisement");
  }
});

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
};
