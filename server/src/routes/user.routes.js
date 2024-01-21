import { Router } from "express";
import {
  getAllUsers,
  loginUser,
  registerUser,
  updateUserRole,
} from "../controllers/user.controllers.js";
import { checkRole, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes

// admin
router.route("/").get(verifyJWT, checkRole("admin"), getAllUsers);
router
  .route("/update-role")
  .patch(verifyJWT, checkRole("admin"), updateUserRole);

export default router;
