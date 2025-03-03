import express from "express";
import {
  getAllFinancialReports,
  getFinancialReportById,
} from "../controller/financialReportController.js";

const financialReportRouter = express.Router();

financialReportRouter.get("/getAll", getAllFinancialReports);
financialReportRouter.get("/get/:id", getFinancialReportById);

export default financialReportRouter;
