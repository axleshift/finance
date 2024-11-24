import mongoose from "mongoose";

const depositSchema = mongoose.Schema(
  {
    dateTime: { type: String, required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    admin: { type: String },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

const depositModel = mongoose.model("depositRecord", depositSchema);

export default depositModel;
