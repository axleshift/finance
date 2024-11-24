import mongoose from "mongoose";

const depositSchema = mongoose.Schema(
  {
    dateTime: { type: String, required: true },
    adminId: { type: String, required: true },
    admin: { type: String, required: true },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

const depositModel = mongoose.model("depositRecord", depositSchema);

export default depositModel;
