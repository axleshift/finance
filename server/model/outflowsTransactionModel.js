import mongoose from "mongoose";

const outflowsTransactionSchema = mongoose.Schema({
  dateTime: { type: String, required: true },
  approver: { type: String, required: true },
  approverId: { type: String, required: true },
  payableId: { type: String, required: true },
  category: { type: String, required: true },
  department: { type: String, required: true },
  totalAmount: { type: Number, required: true },
});

const outflowsTransactionModel = mongoose.model(
  "outflowsTransaction",
  outflowsTransactionSchema
);

export default outflowsTransactionModel;
