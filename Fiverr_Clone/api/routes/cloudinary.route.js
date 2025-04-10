import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/generate-signature", async (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = req.body.folder || "fiverr";

  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign)
    .digest("hex");

  res.status(200).json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
  });
});

export default router;
