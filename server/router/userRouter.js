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

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/create", create);
userRouter.get("/account", authMiddleware, getSpecificId);
userRouter.delete("/delete/:userId", deleteUser);
userRouter.put("/update/:userId", updateUser);
userRouter.post("/login", loginUser);

export default userRouter;
