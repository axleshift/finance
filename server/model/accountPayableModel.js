import mongoose from "mongoose";

const accountPayableSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  vendor: {
    type: String,
  },
  shipment: {
    type: String,
  },
  amountDue: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    default: "USD",
    enum: ["USD", "EUR", "GBP", "INR"],
  },
  paymentTerms: {
    type: String,
    required: true,
    enum: ["Net 30", "Net 45", "Net 60", "Prepaid"],
    default: "Net 30",
  },
  dueDate: {
    type: Date,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Approved", "Paid", "Overdue", "Rejected"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Bank Transfer", "Check", "Credit Card"],
    required: true,
  },
  paymentDate: {
    type: Date,
  },
  taxDetails: {
    taxAmount: { type: Number, default: 0 },
    taxType: { type: String, enum: ["VAT", "GST", "None"], default: "None" },
  },
  latePaymentFee: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
  },
  auditTrail: [
    {
      action: { type: String },
      performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const AccountPayable = mongoose.model("AccountPayable", accountPayableSchema);

export default AccountPayable;
