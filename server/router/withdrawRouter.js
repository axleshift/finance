import {
  create,
  withdrawAggregate,
  getAllWithdraw,
} from "../controller/withdrawController.js";
import express from "express";

const withdrawRouter = express.Router();

withdrawRouter.get("/", getAllWithdraw);
withdrawRouter.post("/create", create);
withdrawRouter.get("/withdrawAggregate", withdrawAggregate);

export default withdrawRouter;
