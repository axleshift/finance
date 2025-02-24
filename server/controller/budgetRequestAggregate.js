import expressAsyncHandler from "express-async-handler";
import budgetModel from "../model/budgetModel.js";
import budgetRequestModel from "../model/budgetRequestModel.js";

// Pending requests aggregation
const pendingRequest = expressAsyncHandler(async (req, res) => {
  try {
    const pendingBudgetRequestsData = await budgetRequestModel.aggregate([
      {
        $match: { status: { $in: ["Pending", "On process"] } },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalPendingAmount =
      pendingBudgetRequestsData.length > 0
        ? pendingBudgetRequestsData[0].totalAmount
        : 0;

    const pendingRequestBudget = await budgetRequestModel.find({
      status: "Pending",
    });

    const onProcessRequestBudget = await budgetRequestModel.find({
      status: "On process",
    });

    res.status(200).json({
      totalPendingAmount,
      pendingRequestBudget,
      onProcessRequestBudget,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending requests", error });
  }
});

// Processed requests aggregation
const processedRequestBudget = expressAsyncHandler(async (req, res) => {
  try {
    const result = await budgetRequestModel.find({
      status: { $in: ["Approved", "Declined"] },
    });

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching processed requests", error });
  }
});

export { pendingRequest, processedRequestBudget };
