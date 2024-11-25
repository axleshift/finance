import express from "express";
import {
  create,
  getUsers,
  getSpecificId,
  deleteUser,
  updateUser,
  loginUser,
} from "../controller/userController.js";
import { authMiddleware } from "../middleware/Auth.js";

import multer from "multer";
const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });
userRouter.get("/", getUsers);
userRouter.post("/create", upload.single("image"), create);
userRouter.get("/account", authMiddleware, getSpecificId);
userRouter.delete("/delete/:userId", deleteUser);
userRouter.put("/update/:userId", updateUser);
userRouter.post("/login", loginUser);
userRouter.get("/accountData", authMiddleware, getSpecificId);

export default userRouter;
