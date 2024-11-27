import express from "express";
import {
  createPayroll,
  getAllPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
} from "../controller/payrollController.js";

const payrollRouter = express.Router();

// Create Payroll
payrollRouter.post("/", createPayroll);

// Get All Payrolls
payrollRouter.get("/", getAllPayrolls);

// Get Payroll by ID
payrollRouter.get("/:id", getPayrollById);

// Update Payroll
payrollRouter.put("/:id", updatePayroll);

// Delete Payroll
payrollRouter.delete("/:id", deletePayroll);

export default payrollRouter;
