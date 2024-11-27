import mongoose from "mongoose";

const PayrollSchema = mongoose.Schema(
  {
    employeeId: { type: String },
    employeeName: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    department: { type: String },
    overtimeHours: {
      type: Number,
    },
    payrollNumbers: {
      type: String,
    },
    overtimePay: {
      type: Number,
      default: 0,
    },
    bonuses: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    netPay: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    generatedDate: { type: Date },
  },
  { timestamps: true }
);

const payrollModel = mongoose.model("Payroll", PayrollSchema);

export default payrollModel;
