import { create, depositAggregate, getAllDeposit } from "../controller/depositController.js";
import express from "express";

const depositRouter = express.Router();

depositRouter.get("/", getAllDeposit);
depositRouter.post("/create", create);
depositRouter.get("/depositAggregate", depositAggregate);

export default depositRouter;
