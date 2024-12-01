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

const budgetRequestRouter = express.Router();

budgetRequestRouter.get("/pendingBudget", getPendingBudget);
budgetRequestRouter.get("/proccessBudget", getProcessBudget);

budgetRequestRouter.post("/", createBudgetRequest); // Create
budgetRequestRouter.get("/", getAllBudgetRequests); // Read All
budgetRequestRouter.get("/:id", getBudgetRequestById); // Read by ID
budgetRequestRouter.put("/:id", updateBudgetRequest); // Update
budgetRequestRouter.delete("/:id", deleteBudgetRequest); // Delete
budgetRequestRouter.put("/updateStatus/:id", statusUpdate);

export default budgetRequestRouter;
