import express from "express";
import multer from "multer";
import {
  deleteAccountRequest,
  create,
  getAll,
  updateAccountRequest,
} from "../controller/accountRequestController.js";
const accountRequestRouter = express.Router();
const upload = multer();

accountRequestRouter.get("/", getAll);
accountRequestRouter.post("/", upload.none(), create);
accountRequestRouter.put("/", updateAccountRequest);
accountRequestRouter.delete("/:id", deleteAccountRequest);

export default accountRequestRouter;
