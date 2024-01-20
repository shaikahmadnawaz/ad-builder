import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/auth.middleware.js";
import {
  createAdvertisement,
  getAllAdvertisements,
} from "../controllers/advertisement.controllers.js";

const router = Router();

router.route("/").post(verifyJWT, checkRole("advertiser"), createAdvertisement);
router.route("/").get(verifyJWT, checkRole("advertiser"), getAllAdvertisements);

export default router;
