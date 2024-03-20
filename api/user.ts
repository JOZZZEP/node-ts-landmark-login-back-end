import express from "express";
import fs from "fs/promises";
import { LANDMARK_JSON_PATH, USER_JSON_PATH } from "../constant/constant";
import { UserPostRequest } from "../model/user_post_request";
import {
  decodeBase64,
  encodeBase64,
  generateSalt,
  hashWithSalt,
  verifyWithSalt,
} from "../util/encrypt";
import { fileUpload } from "./upload";

export const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const user: UserPostRequest = req.body;
    const fileContent = await fs.readFile(USER_JSON_PATH, "utf-8");
    const fileData = JSON.parse(fileContent);

    const filteredData: any[] = fileData.filter(
      (userData: any) => userData.username === user.username
    );
    if (filteredData.length !== 0) {
      const queryUser = filteredData[0];
      if (
        verifyWithSalt(user.password!, queryUser.password, queryUser.userKey)
      ) {
        const responseUser = {
          uid: queryUser.uid,
          username: queryUser.username,
          country: queryUser.country,
          avatar: queryUser.avatar,
          role: queryUser.role,
        };

        const hash = hashWithSalt(queryUser.username, queryUser.userKey);
        const token = encodeBase64(
          JSON.stringify({ username: queryUser.username, userKey: hash })
        );
        return res
          .status(200)
          .json({ response: true, token: token, user: responseUser });
      } else {
        return res
          .status(200)
          .json({ response: false, error: "Password invalid" });
      }
    } else {
      return res
        .status(200)
        .json({ response: false, error: "Username invalid" });
    }
  } catch (error) {
    return res.status(200).json({ response: false, error: error });
  }
});

router.post("/getUser", async (req, res) => {
  try {
    const body = req.body;
    const fileContent = await fs.readFile(USER_JSON_PATH, "utf-8");
    const fileData = JSON.parse(fileContent);

    const decodeToken = JSON.parse(decodeBase64(body.token))

    const filteredData: any[] = fileData.filter(
      (userData: any) => userData.username === decodeToken.username
    );
    if (filteredData.length !== 0) {
      const queryUser = filteredData[0];
      if (
        verifyWithSalt(queryUser.username, decodeToken.userKey, queryUser.userKey)
      ) {
        const responseUser = {
          uid: queryUser.uid,
          username: queryUser.username,
          country: queryUser.country,
          avatar: queryUser.avatar,
          role: queryUser.role,
        };

        return res
          .status(200)
          .json({ response: true, user: responseUser });
      } else {
        return res
          .status(200)
          .json({ response: false, error: "Token invalid"});
      }
    } else {
      return res
        .status(200)
        .json({ response: false, error: "Username not found" });
    }
  } catch (error) {
    return res.status(200).json({ response: false, error: error});
  }
});

router.post(
  "/register",
  fileUpload.diskLoader.single("avatar"),
  async (req, res) => {
    try {
      const user: UserPostRequest = req.body;
      const avatarFile = req.file;
      const fileContent = await fs.readFile(USER_JSON_PATH, "utf-8");
      const fileData = JSON.parse(fileContent);

      const foundUser = fileData.find(
        (userData: any) => userData.username === user.username
      );
      if (foundUser) {
        return res
          .status(200)
          .json({ response: false, error: "Username Already Exit" });
      }
      const lastUser = fileData[fileData.length - 1];

      user.uid = lastUser.uid + 1;
      if (avatarFile) {
        user.avatar = "/uploads/" + fileUpload.filename;
      } else {
        user.avatar = "/uploads/profileDefault.png";
      }
      user.role = "user";
      user.userKey = generateSalt(32);

      const updatedData = [...fileData, user];

      await fs.writeFile(USER_JSON_PATH, JSON.stringify(updatedData, null, 2));
      return res.status(200).json({
        response: true,
        result: "Insert User Success",
      });
    } catch (error) {
      return res.status(200).json({ response: false, error: error });
    }
  }
);

router.post("/getLandmarkByCountry", async (req, res) => {
  try {
    const user: UserPostRequest = req.body;
    const fileContent = await fs.readFile(LANDMARK_JSON_PATH, "utf-8");
    const fileData = JSON.parse(fileContent);

    const filteredData: any[] = fileData.filter(
      (landmarkData: any) => landmarkData.country.trim() === user.country.trim()
    );

    if (filteredData.length !== 0) {
      return res.status(200).json({ response: true, landmark: filteredData });
    } else {
      return res.status(200).json({ response: false });
    }
  } catch (error) {
    return res.status(200).json({ response: false, error: error });
  }
});

router.get("/getCountry", async (req, res) => {
  try {
    const fileContent = await fs.readFile(LANDMARK_JSON_PATH, "utf-8");
    const fileData = JSON.parse(fileContent);

    const countries = new Set(fileData.map((item: any) => item.country.trim()));

    if (countries.size !== 0) {
      return res
        .status(200)
        .json({ response: true, countries: Array.from(countries) });
    } else {
      return res.status(200).json({ response: false });
    }
  } catch (error) {
    return res.status(200).json({ response: false, error: error });
  }
});
