import mongoose from "mongoose";

const withdrawSchema = mongoose.Schema(
  {
    dateTime: { type: String, required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    admin: { type: String },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

const withdrawModel = mongoose.model("withdrawRecord", withdrawSchema);

export default withdrawModel;
