import mongoose from "mongoose";

const counterSchema = mongoose.Schema({
  _id: { type: String, required: true }, // e.g., "supplierCode"
  sequence_value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;