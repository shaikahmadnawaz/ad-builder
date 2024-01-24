import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { promisify } from "util";
import fs from "fs";

const storage = multer.memoryStorage({});

export const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 25,
  },
});

export const deleteFile = promisify(fs.unlink);
