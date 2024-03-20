import express from "express";
import fs from "fs/promises";
import { LANDMARK_JSON_PATH, USER_JSON_PATH } from "../constant/constant";
export const router = express.Router();

router.get("/getAllUser", async (req, res) => {
  try {
    const fileContent = await fs.readFile(USER_JSON_PATH, "utf-8");
    const fileData = JSON.parse(fileContent);

    if (fileData.length !== 0) {
      const allUser = fileData.map((user: any) => ({
        uid: user.uid,
        username: user.username,
        country: user.country,
        avatar: user.avatar,
        role: user.role,
      }));
      return res.status(200).json({ response: true, allUser: allUser });
    } else {
      return res.status(200).json({ response: false });
    }
  } catch (error) {
    return res.status(200).json({ response: false, error: error });
  }
});

router.get("/getAllLandmark", async (req, res) => {
  try {
    const fileContent = await fs.readFile(LANDMARK_JSON_PATH, "utf-8");
    const fileData = JSON.parse(fileContent);

    return res.status(200).json({ response: true, allLandmark: fileData });
  } catch (error) {
    return res.status(200).json({ response: false, error: error });
  }
});
