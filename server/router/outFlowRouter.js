import express from "express";
import { getAllOutFlow } from "../controller/outFlowController.js";

const outFlowRouter = express.Router();

outFlowRouter.get("/", getAllOutFlow);

export default outFlowRouter;
