import express from "express";
import multer from "multer";
import path from "path";

export const router = express.Router();

class FileMiddleware {
  filename = "";
  public readonly diskLoader = multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix =
          Date.now() + "-" + Math.round(Math.random() * 10000);
        this.filename = uniqueSuffix + "." + file.originalname.split(".").pop();
        cb(null, this.filename);
      },
    }),
    limits: {
      fileSize: 67108864, // 64 MByte
    },
  });
}

export const fileUpload = new FileMiddleware();

router.post("/", fileUpload.diskLoader.single("file"), (req, res) => {
  return res.json({ filename: "/uploads/" + fileUpload.filename });
});
