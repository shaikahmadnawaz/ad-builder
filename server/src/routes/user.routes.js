import { Router } from "express";
import {
  getAllUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserRole,
} from "../controllers/user.controllers.js";
import { checkRole, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(verifyJWT, refreshAccessToken);

// admin
router.route("/").get(verifyJWT, checkRole("admin"), getAllUsers);
router
  .route("/update-role")
  .patch(verifyJWT, checkRole("admin"), updateUserRole);

export default router;
