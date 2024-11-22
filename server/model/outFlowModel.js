import mongoose from "mongoose";

const outFlowSchema = mongoose.Schema({
  dateTime: { type: String, required: true },
  approver: { type: String, required: true },
  approverId: { type: String, required: true },
  category: { type: String, required: true },
  department: { type: String, required: true },
  totalAmount: { type: Number, required: true },
});

const outFlowModel = mongoose.model("Outflow", outFlowSchema);

export default outFlowModel;
