import express from "express";
import {
  createBudgetRequest,
  getAllBudgetRequests,
  getBudgetRequestById,
  updateBudgetRequest,
  deleteBudgetRequest,
} from "../controller/budgetRequestController.js";

const budgetRequestRouter = express.Router();

budgetRequestRouter.post("/", createBudgetRequest); // Create
budgetRequestRouter.get("/", getAllBudgetRequests); // Read All
budgetRequestRouter.get("/:id", getBudgetRequestById); // Read by ID
budgetRequestRouter.put("/:id", updateBudgetRequest); // Update
budgetRequestRouter.delete("/:id", deleteBudgetRequest); // Delete

export default budgetRequestRouter;
