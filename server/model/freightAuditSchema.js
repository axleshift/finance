import mongoose from "mongoose";

const FreightAuditSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: false, unique: true },
  carrierName: { type: String, required: false },
  shipmentDate: { type: Date, required: false },
  totalCharge: { type: Number, required: false, min: 0 },
  expectedCharge: { type: Number, required: false, min: 0 },
  discrepancyAmount: {
    type: Number,
    default: function () {
      return this.totalCharge - this.expectedCharge;
    },
  },
  status: {
    type: String,
    enum: ["Pending", "Reviewed", "Disputed", "Resolved", "Paid"],
    default: "Pending",
  },
  department: {
    type: String,
    enum: ["Logistics", "Freight Rate Management", "Finance"],
    required: false,
  },
  financialImpact: {
    type: String,
    enum: ["Increase", "Decrease", "Neutral"],
    default: "Neutral",
  },
  paymentStatus: {
    type: String,
    enum: ["Unpaid", "Paid", "Partially Paid"],
    default: "Unpaid",
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const FreightAudit = mongoose.model("FreightAudit", FreightAuditSchema);

export default FreightAudit;
