import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "Missing required fields");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "Username or email already existed");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Cannot create user");
  }

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: createdUser,
      },
      "User created"
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if (!email && !password && !username) {
    throw new ApiError(400, "Missing required fields");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  console.log("User", user);

  const accessToken = user.generateAccessToken();

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, { user, accessToken }, "User logged in"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Forbidden");
  }
  const users = await User.find({}).select("-password");

  res.status(200).json(new ApiResponse(200, { users }, "Users fetched"));
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { userId, newRole } = req.body;

  if (!userId || !newRole) {
    throw new ApiError(400, "Missing required fields");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Forbidden");
  }

  const userToUpdate = await User.findById(userId);

  if (!userToUpdate) {
    throw new ApiError(404, "User not found");
  }

  userToUpdate.role = newRole;
  await userToUpdate.save();

  const updatedUser = await User.findById(userToUpdate._id).select("-password");

  res.json(
    new ApiResponse(
      200,
      {
        user: updatedUser,
      },
      "User role updated"
    )
  );
});

export { registerUser, loginUser, getAllUsers, updateUserRole };
