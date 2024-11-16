import express from "express";
import {
  create,
  getUsers,
  getSpecificId,
  deleteUser,
  updateUser,
} from "../controller/userController.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/create", create);
userRouter.get("/:userId", getSpecificId);
userRouter.delete("/delete/:userId", deleteUser);
userRouter.put("/update/:userId", updateUser);

export default userRouter;
