import budgetModel from "../model/budgetModel.js";
import expressAsyncHandler from "express-async-handler";

import outFlowModel from "../model/outFlowModel.js";
// Get all budgets
export const getAll = async (req, res) => {
  try {
    const budgets = await budgetModel.find(); // Retrieve all budget documents
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching budgets", error });
  }
};

// Create a new budget
export const create = async (req, res) => {
  const { fiscalYear, totalBudget, transportationCosts, status } = req.body;

  try {
    const newBudget = new budgetModel({
      fiscalYear,
      totalBudget,
      transportationCosts,
      status,
    });

    const savedBudget = await newBudget.save();
    res.status(201).json(savedBudget); // Respond with the created budget
  } catch (error) {
    res.status(500).json({ message: "Error creating budget", error });
  }
};

// Update a budget by ID
export const update = async (req, res) => {
  const { id } = req.params;
  const { fiscalYear, totalBudget, transportationCosts } = req.body;

  try {
    const updatedBudget = await budgetModel.findByIdAndUpdate(
      id,
      { fiscalYear, totalBudget, transportationCosts },
      { new: true } // Return the updated document
    );

    if (!updatedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: "Error updating budget", error });
  }
};

// Delete a budget by ID
export const deleteBudget = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBudget = await budgetModel.findByIdAndDelete(id);

    if (!deletedBudget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting budget", error });
  }
};

// Get a specific budget by ID
export const getSpecificId = async (req, res) => {
  const { id } = req.params;

  try {
    const budget = await budgetModel.findById(id);

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Error fetching budget", error });
  }
};

export const statusUpdate = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, approver, approverId, category, department, totalAmount } =
    req.body;
  const updated = await budgetModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updated) {
    return res
      .status(404)
      .json({ success: false, message: "Budget id not found!" });
  }

  function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString("en-US");
    const time = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return `${date} ${time}`;
  }

  // const outFlowCustomize = {
  //   dateTime: getCurrentDateTime(),
  //   approver,
  //   approverId,
  //   category,
  //   department,
  //   totalAmount,
  // };
  // const outFlow = new outFlowModel(outFlowCustomize);

  // if (!outFlow) {
  //   return res
  //     .status(404)
  //     .json({ success: false, message: "Outflow not found!" });
  // }

  // outFlow.save();

  res.status(200).json({
    success: true,
    message: "Update Status Successfully",
    data: updated,
  });
});
