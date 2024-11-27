import budgetRequestModel from "../model/budgetRequestModel.js";

// Create a new budget request
export const createBudgetRequest = async (req, res) => {
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
export const getAllBudgetRequests = async (req, res) => {
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
export const getBudgetRequestById = async (req, res) => {
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
export const updateBudgetRequest = async (req, res) => {
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
export const deleteBudgetRequest = async (req, res) => {
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
