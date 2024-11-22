import express from "express";
import {
  deleteAccountRequest,
  create,
  getAll,
  updateAccountRequest,
} from "../controller/accountRequestController.js";

const accountRequestRouter = express.Router();

accountRequestRouter.get("/", getAll);
accountRequestRouter.post("/", create);
accountRequestRouter.put("/", updateAccountRequest);
accountRequestRouter.delete("/", deleteAccountRequest);
