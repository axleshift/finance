import express from "express";
import {
  createFreightAudit,
  deleteFreightAudit,
  getAllFreightAudits,
  getFreightAuditById,
  updateFreightAudit,
} from "../controller/freightAuditController.js";

const freigthAuditRouter = express.Router();

freigthAuditRouter.get("/", getAllFreightAudits);
freigthAuditRouter.post("/", createFreightAudit);
freigthAuditRouter.get("/:id", getFreightAuditById);
freigthAuditRouter.put("/:id", updateFreightAudit);
freigthAuditRouter.delete("/:id", deleteFreightAudit);

export default freigthAuditRouter;
