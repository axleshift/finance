import expressAsyncHandler from "express-async-handler";
import inflowsTransactionModel from "../model/inflowsTransactionModel.js";

const getAllInflow = expressAsyncHandler(async (req, res) => {
  const getAll = await inflowsTransactionModel.find({});

  if (!getAll) {
    return res
      .status(400)
      .json({ success: false, message: "Inflow not found!" });
  }

  res.status(200).json(getAll);
});

export { getAllInflow };
