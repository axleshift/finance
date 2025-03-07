import express from "express";
import { authMiddleware } from "../middleware/Auth.js";
import { getPredictiveAnalytics } from "../controller/predictiveAnalyticsController.js";

const predictiveAnalyticsRouter = express.Router();

predictiveAnalyticsRouter.post("/", authMiddleware, getPredictiveAnalytics);

export default predictiveAnalyticsRouter;
