import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Advertisement from "../models/advertisement.model.js";

const createAdvertisement = asyncHandler(async (req, res) => {
  const { title, description, targetAudience, multimediaContent, scheduling } =
    req.body;

  if (
    !title ||
    !description ||
    !targetAudience ||
    !multimediaContent ||
    !scheduling
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  try {
    const advertisement = await Advertisement.create({
      title,
      description,
      targetAudience,
      multimediaContent,
      scheduling,
      advertiser: req.user._id,
    });

    res
      .status(201)
      .json(new ApiResponse(201, { advertisement }, "Advertisement created"));
  } catch (error) {
    throw new ApiError(500, "Cannot create advertisement");
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

export { createAdvertisement, getAllAdvertisements };
