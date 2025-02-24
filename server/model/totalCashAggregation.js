import expressAsyncHandler from "express-async-handler";
import depositModel from "./depositModel.js";
import inflowsTransactionModel from "./inflowsTransactionModel.js";
import outflowsTransactionModel from "./outflowsTransactionModel.js";
import withdrawModel from "./withdrawModel.js";

// Function to calculate total inflows amount
const totalInflowsAmount = async () => {
  const inflows = await inflowsTransactionModel.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  return inflows.length > 0 ? inflows[0].totalAmount : 0;
};

// Function to calculate total outflows amount
const totalOutflowsAmount = async () => {
  const outflows = await outflowsTransactionModel.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  return outflows.length > 0 ? outflows[0].totalAmount : 0;
};

// Function to calculate total deposit amount
const totalDepositAmount = async () => {
  const depositAmount = await depositModel.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  return depositAmount.length > 0 ? depositAmount[0].totalAmount : 0;
};

// Function to calculate total withdraw amount
const totalWithdrawAmount = async () => {
  const withdrawAmount = await withdrawModel.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  return withdrawAmount.length > 0 ? withdrawAmount[0].totalAmount : 0;
};

// Calculate total cash of the company
const totalCompanyCash = expressAsyncHandler(async (req, res) => {
  const inflows = await totalInflowsAmount();
  const outflows = await totalOutflowsAmount();
  const deposit = await totalDepositAmount();
  const withdraw = await totalWithdrawAmount();

  const totalInflows = inflows + deposit;
  const totalOutflows = outflows + withdraw;

  res.status(200).json(totalInflows - totalOutflows);
});

// Calculate total cash of the company
const getTotalCompanyCashReturn = expressAsyncHandler(async (req, res) => {
  const inflows = await totalInflowsAmount();
  const outflows = await totalOutflowsAmount();
  const deposit = await totalDepositAmount();
  const withdraw = await totalWithdrawAmount();

  const totalInflows = inflows + deposit;
  const totalOutflows = outflows + withdraw;

  // res.status(200).json(totalInflows - totalOutflows);

  return totalInflows - totalOutflows;
});

export { totalCompanyCash, getTotalCompanyCashReturn };
