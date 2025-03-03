import express from "express";
import { getAllFinancialReports } from "../controller/financialReportController.js";

const financialReportRouter = express.Router();

financialReportRouter.get("/getAll", getAllFinancialReports);

export default financialReportRouter;
