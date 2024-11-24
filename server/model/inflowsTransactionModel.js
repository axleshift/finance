import mongoose from "mongoose";

const inflowsTransactionSchema = mongoose.Schema({
  dateTime: { type: String, required: true },
  auditor: { type: String, required: true },
  auditorId: { type: String, required: true },
  invoiceId: { type: String, required: true },
  customerName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
});

const inflowsTransactionModel = mongoose.model(
  "inflowsTransaction",
  inflowsTransactionSchema
);

export default inflowsTransactionModel;
