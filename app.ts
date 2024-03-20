import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { router as admin } from "./api/admin";
import { router as upload } from "./api/upload";
import { router as user } from "./api/user";

export const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use("/user", user);
app.use("/admin", admin);
app.use("/upload", upload);
app.use("/uploads", express.static("uploads"));
