import mongoose from "mongoose";

const outflowsTransactionSchema = mongoose.Schema({
  dateTime: { type: Date, default: Date.now },
  approver: { type: String, required: true },
  approverId: { type: String, required: true },
  payableId: { type: String, required: false },
  category: { type: String, required: false },
  department: { type: String, required: true },
  totalAmount: { type: Number, required: true },
});

const outflowsTransactionModel = mongoose.model(
  "outflowsTransaction",
  outflowsTransactionSchema
);

export default outflowsTransactionModel;
