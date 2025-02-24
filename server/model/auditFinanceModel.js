import mongoose from "mongoose";

const auditFinanceSchema = mongoose.Schema(
  {
    eventTypes: {
      type: String,
      enum: ["Create", "Update", "Delete", "Approved", "Rejected", "Dispatch"],
      required: true,
    },
    entityType: {
      type: String,
      enum: [
        "PurchaseOrder",
        "Invoice",
        "RawmaterialRequest",
        "Tracking Order",
        "Material",
        "Supplier",
      ],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "entityType",
      required: true,
    },
    changes: {
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed,
    },
    performeBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: [
        "admin",
        "superAdmin",
        "Supplier",
        "Logistic",
        "logistic",
        "Quality Control",
        "Finance",
      ],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const auditFinanceModel = mongoose.model("auditFinance", auditFinanceSchema);

export default auditFinanceModel;
