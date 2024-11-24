import depositModel from "./depositModel.js";
import inflowsTransactionModel from "./inflowsTransactionModel.js";
import outflowsTransactionModel from "./outflowsTransactionModel.js";
import withdrawModel from "./withdrawModel.js";

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

//TOTAL OUTFLOW MONEY
const totalOutflowsAmount = async () => {
  const outflows = await outflowsTransactionModel.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  //TOTAL DEPOSITS RECORD
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

  return outflows.length > 0 ? outflows[0].totalAmount : 0;
};

//TOTAL WITHDRAW RECORD
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

// Calculate total cash
const totalCompanyCash = async () => {
  const inflows = await totalInflowsAmount();
  const outflows = await totalOutflowsAmount();
  const deposit = await totalDepositAmount();
  const withdraw = await totalWithdrawAmount();

  const totalInflows = inflows + deposit;
  const totalOutflows = outflows + withdraw;

  return totalInflows - totalOutflows;
};

export { totalCompanyCash };
