const mongoose = require("mongoose");

import mongoose from "mongoose";

const withdrawSchema = mongoose.Schema(
  {
    dateTime: { type: String, required: true },
    adminId: { type: String, required: true },
    admin: { type: String, required: true },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

const withdrawModel = mongoose.model("withdrawRecord", withdrawSchema);

export default withdrawModel;
