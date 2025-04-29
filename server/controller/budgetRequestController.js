import expressAsyncHandler from "express-async-handler";
import budgetRequestModel from "../model/budgetRequestModel.js";
import {
  pendingRequest,
  processedRequestBudget,
} from "./budgetRequestAggregate.js";
import userModel from "../model/userModel.js";
import outflowsTransactionModel from "../model/outflowsTransactionModel.js";
import Counter from "../model/Counter.js";
import { getTotalCompanyCashReturn } from "../model/totalCashAggregation.js";

// Create a new budget request
const createBudgetRequest = async (req, res) => {
  try {
    const {
      department,
      typeOfRequest,
      category,
      reason,
      totalRequest,
      documents,
      status,
      comment,
    } = req.body;

    const counter = await Counter.findByIdAndUpdate(
      {
        _id: "budgetNumber",
      },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );

    const budgetNumber = counter.sequence_value.toString().padStart(3, "0");

    const reference = `BR-${budgetNumber}`;

    const newRequest = new budgetRequestModel({
      requestId: reference,
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

    const archivedRequest = await budgetRequestModel.findByIdAndUpdate(
      id,
      { isArichived: true },
      { new: true }
    );

    if (!archivedRequest) {
      return res.status(404).json({ message: "Budget request not found" });
    }

    res.status(200).json({
      message: "Budget request archived successfully",
      archivedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting budget request",
      error: error.message,
    });
  }
};
// const deleteBudgetRequest = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedRequest = await budgetRequestModel.findByIdAndDelete(id);

//     if (!deletedRequest) {
//       return res.status(404).json({ message: "Budget request not found" });
//     }

//     res.status(200).json({
//       message: "Budget request deleted successfully",
//       deletedRequest,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error deleting budget request",
//       error: error.message,
//     });
//   }
// };

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
  const { userId, department, status } = req.body;

  const existUser = await userModel.findById(userId);
  if (!existUser) {
    return res
      .status(404)
      .json({ success: false, message: "User Id not found!" });
  }

  console.log(existUser);

  const existing = await budgetRequestModel.findById(id);
  if (!existing) {
    return res
      .status(404)
      .json({ success: false, message: "Budget request not found!" });
  }
  // 🔹 Prevent updating if the status is already "Declined"
  if (existing.status === "Declined") {
    return res.status(400).json({
      success: false,
      message: "This request has already been declined and cannot be updated.",
    });
  }

  // 🔹 Prevent updating if the status is already "Approved"
  if (existing.status === "Approved") {
    return res
      .status(400)
      .json({ success: false, message: "Already approved!" });
  }

  // 🔹 Wait for the total company cash return before checking the condition
  const totalCash = await getTotalCompanyCashReturn();

  if (totalCash < existing?.totalRequest) {
    return res.status(400).json({
      success: false,
      message: "Not enough company cash to approve this request.",
    });
  }

  const updated = await budgetRequestModel.findByIdAndUpdate(
    id,
    { status: status },
    { new: true }
  );

  if (!updated) {
    return res
      .status(404)
      .json({ success: false, message: "Budget id not found!" });
  }

  if (status === "Approved") {
    const outflow = new outflowsTransactionModel({
      approver: existUser.fullName,
      approverId: existUser._id,
      totalAmount: existing.totalRequest,
      department: department,
    });

    await outflow.save();
  }

  res.status(200).json({
    success: true,
    message: "Update Status Successfully",
    data: updated,
  });
});

const onprocessUpdate = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, department, status } = req.body;

  const existUser = await userModel.findById(userId);
  if (!existUser) {
    return res
      .status(404)
      .json({ success: false, message: "User Id not found!" });
  }

  console.log(existUser);

  const existing = await budgetRequestModel.findById(id);

  if (existing?.status === "approved") {
    return res
      .status(404)
      .json({ success: false, message: "Already approved!" });
  }
  const updated = await budgetRequestModel.findByIdAndUpdate(
    id,
    { status: status },
    { new: true }
  );

  if (!updated) {
    return res
      .status(404)
      .json({ success: false, message: "Budget id not found!" });
  }

  // const outflow = new outflowsTransactionModel({
  //   approver: existUser?.fullName,
  //   approverId: existUser?._id,
  //   totalAmount: existing?.totalRequest,
  //   department: department,
  // });

  // if (!outflow) {
  //   return res
  //     .status(404)
  //     .json({ success: false, message: "Outflow not found!" });
  // }

  // await outflow.save();

  res.status(200).json({
    success: true,
    message: "Update Status Successfully",
    data: updated,
  });
});

const getProcessedBudgetRequest = expressAsyncHandler(async (req, res) => {
  try {
    const requestData = await budgetRequestModel.find({
      status: { $in: ["Approved", "Declined"] },
    });

    if (!requestData.length) {
      return res
        .status(404)
        .json({ message: "No processed budget requests found" });
    }

    res.status(200).json(requestData);
  } catch (error) {
    console.error("Error fetching processed budget requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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
  onprocessUpdate,
  getProcessedBudgetRequest,
};
