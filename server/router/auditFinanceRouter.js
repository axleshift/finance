import express from "express";
import {
  deleteAuditFinance,
  getAllAuditFinance,
} from "../controller/auditFinanceController.js";

const auditFinanceRouter = express.Router();

auditFinanceRouter.get("/", getAllAuditFinance);
// auditFinanceRouter.post("/", createAuditFinance);
// auditFinanceRouter.update("/", updateAuditFinance);
auditFinanceRouter.delete("/", deleteAuditFinance);

export default auditFinanceRouter;
