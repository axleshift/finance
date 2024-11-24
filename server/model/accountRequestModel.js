import mongoose from "mongoose";

const accountRequestSchema = mongoose.Schema(
  {
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
