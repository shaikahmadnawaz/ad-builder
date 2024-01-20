import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("token", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    console.log("decodedToken", decodedToken);

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    console.log("jwt user", user);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
});

const checkRole = (role) => (req, _, next) => {
  const userRole = req.user.role;
  console.log("userRole", userRole);
  if (userRole !== role) {
    throw new ApiError(403, "Forbidden");
  }
  next();
};

export { verifyJWT, checkRole };
