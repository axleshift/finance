import mongoose from "mongoose";

const budgetRequestSchema = mongoose.Schema(
  {
    requestId: { type: String, required: true },
    department: { type: String, required: true },
    typeOfRequest: { type: String, required: true },
    category: { type: String, required: true },
    reason: { type: String, required: true },
    totalRequest: { type: Number, required: true },
    documents: { type: String, required: true },
    status: {
      type: String,
      enum: ["Approved", "Reject", "Pending", "Declined", "On Process"],
      default: "Pending",
    },
    comment: { type: String },
    isArichived: { type: Boolean, default: false },
  },

  { timestamps: true }
);

const budgetRequestModel = mongoose.model("budgetRequest", budgetRequestSchema);

export default budgetRequestModel;
