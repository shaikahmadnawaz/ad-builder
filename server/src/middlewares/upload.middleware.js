import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { promisify } from "util";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uuidv4()}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
});

export const deleteFile = promisify(fs.unlink);
