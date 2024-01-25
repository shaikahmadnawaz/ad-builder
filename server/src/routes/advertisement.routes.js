import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/auth.middleware.js";
import {
  createAdvertisement,
  deleteAdvertisement,
  getAdvertisement,
  getAllAdvertisements,
  updateAdvertisement,
} from "../controllers/advertisement.controllers.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();
router
  .route("/")
  .post(
    verifyJWT,
    checkRole("advertiser"),
    upload.single("media"),
    createAdvertisement
  )
  .get(verifyJWT, checkRole("advertiser"), getAllAdvertisements);

router
  .route("/:advertisementId")
  .get(getAdvertisement)
  .patch(
    verifyJWT,
    checkRole("advertiser"),
    upload.single("media"),
    updateAdvertisement
  )
  .delete(verifyJWT, checkRole("advertiser"), deleteAdvertisement);

export default router;
