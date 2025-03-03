import express from "express";
import { authMiddleware } from "../middleware/Auth.js";
import { getPredictiveAnalytics } from "../controller/predictiveAnalyticsController.js";

const predictiveAnalyticsRouter = express.Router();

predictiveAnalyticsRouter.get("/", authMiddleware, getPredictiveAnalytics);

export default predictiveAnalyticsRouter;
