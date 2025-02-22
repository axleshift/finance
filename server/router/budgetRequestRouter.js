import express from "express";
import {
  createBudgetRequest,
  getAllBudgetRequests,
  getBudgetRequestById,
  updateBudgetRequest,
  deleteBudgetRequest,
  getPendingBudget,
  getProcessBudget,
  statusUpdate,
} from "../controller/budgetRequestController.js";
import { authMiddleware } from "../middleware/Auth.js";

const budgetRequestRouter = express.Router();

budgetRequestRouter.get("/pendingBudget", getPendingBudget);
budgetRequestRouter.get("/proccessBudget", getProcessBudget);

budgetRequestRouter.get("/", getAllBudgetRequests); // Read All
budgetRequestRouter.post("/", createBudgetRequest); // Create
budgetRequestRouter.get("/:id", getBudgetRequestById); // Read by ID
budgetRequestRouter.put("/:id", updateBudgetRequest); // Update
budgetRequestRouter.delete("/:id", deleteBudgetRequest); // Delete
budgetRequestRouter.post("/updateStatus/:id", authMiddleware, statusUpdate);

export default budgetRequestRouter;
