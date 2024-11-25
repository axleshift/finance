import express from "express";
import { totalCompanyCash } from "../model/totalCashAggregation.js";

const totalCashRouter = express.Router();

totalCashRouter.get("/", totalCompanyCash);
export default totalCashRouter;
