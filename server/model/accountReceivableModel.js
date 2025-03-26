import mongoose from "mongoose";

const accountReceivableSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: String,
    required: true,
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
    enum: ["Net 15", "Net 30", "Net 45", "Prepaid"],
    default: "Net 30",
  },
  dueDate: {
    type: Date,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Overdue", "Partially Paid", "Cancelled"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Bank Transfer", "Credit Card", "Check"],
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  paymentDate: {
    type: Date,
  },
  balanceDue: {
    type: Number,
    default: function () {
      return this.amountDue - this.amountPaid;
    },
  },
  taxDetails: {
    taxAmount: { type: Number, default: 0 },
    taxType: { type: String, enum: ["VAT", "GST", "None"], default: "None" },
  },
  lateFee: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
  },
  auditTrail: [
    {
      action: { type: String },
      performedBy: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdBy: {
    type: String,
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

const AccountReceivable = mongoose.model(
  "AccountReceivable",
  accountReceivableSchema
);

export default AccountReceivable;
