import mongoose from "mongoose";

const accountRequestSchema = mongoose.Schema(
  {
    accountNumber: { type: String },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

const accountRequestModel = mongoose.model(
  "accountRequest",
  accountRequestSchema
);

export default accountRequestModel;
