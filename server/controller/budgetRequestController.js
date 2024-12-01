import expressAsyncHandler from "express-async-handler";
import budgetRequestModel from "../model/budgetRequestModel.js";
import {
  pendingRequest,
  processedRequestBudget,
} from "./budgetRequestAggregate.js";

// Create a new budget request
const createBudgetRequest = async (req, res) => {
  try {
    const {
      requestId,
      department,
      typeOfRequest,
      category,
      reason,
      totalRequest,
      documents,
      status,
      comment,
    } = req.body;

    const newRequest = new budgetRequestModel({
      requestId,
      department,
      typeOfRequest,
      category,
      reason,
      totalRequest,
      documents,
      status,
      comment,
    });

    await newRequest.save();

    res.status(201).json({
      message: "Budget request created successfully",
      newRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating budget request",
      error: error.message,
    });
  }
};

// Get all budget requests
const getAllBudgetRequests = async (req, res) => {
  try {
    const budgetRequests = await budgetRequestModel.find();
    res.status(200).json(budgetRequests);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching budget requests",
      error: error.message,
    });
  }
};

// Get a single budget request by ID
const getBudgetRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const budgetRequest = await budgetRequestModel.findById(id);

    if (!budgetRequest) {
      return res.status(404).json({ message: "Budget request not found" });
    }

    res.status(200).json(budgetRequest);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching budget request",
      error: error.message,
    });
  }
};

// Update a budget request by ID
const updateBudgetRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      requestId,
      department,
      typeOfRequest,
      category,
      reason,
      totalRequest,
      documents,
      status,
      comment,
    } = req.body;

    const updatedRequest = await budgetRequestModel.findByIdAndUpdate(
      id,
      {
        requestId,
        department,
        typeOfRequest,
        category,
        reason,
        totalRequest,
        documents,
        status,
        comment,
      },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Budget request not found" });
    }

    res.status(200).json({
      message: "Budget request updated successfully",
      updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating budget request",
      error: error.message,
    });
  }
};

// Delete a budget request by ID
const deleteBudgetRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRequest = await budgetRequestModel.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({ message: "Budget request not found" });
    }

    res.status(200).json({
      message: "Budget request deleted successfully",
      deletedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting budget request",
      error: error.message,
    });
  }
};

// Get pending budgets
const getPendingBudget = expressAsyncHandler(async (req, res) => {
  try {
    await pendingRequest(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching pending budget data",
      error: error.message,
    });
  }
});

// Get processed budgets
const getProcessBudget = expressAsyncHandler(async (req, res) => {
  try {
    await processedRequestBudget(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching processed budget data",
      error: error.message,
    });
  }
});

const statusUpdate = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await budgetRequestModel.findById(id);

  if (existing?.status === "approved") {
    return res
      .status(404)
      .json({ success: false, message: "Already approved!" });
  }
  const updated = await budgetRequestModel.findByIdAndUpdate(
    id,
    { status: "Approved" },
    { new: true }
  );

  if (!updated) {
    return res
      .status(404)
      .json({ success: false, message: "Budget id not found!" });
  }

  res.status(200).json({
    success: true,
    message: "Update Status Successfully",
    data: updated,
  });
});

export {
  createBudgetRequest,
  getAllBudgetRequests,
  getBudgetRequestById,
  updateBudgetRequest,
  deleteBudgetRequest,
  getPendingBudget,
  getProcessBudget,
  statusUpdate,
};
