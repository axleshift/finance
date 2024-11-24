import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema(
  {
    invoiceNumber: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    products: [
      {
        name: { type: String },
        quantity: { type: Number },
        price: { type: Number },
        total: { type: Number },
      },
    ],
    selectedCurrency: { type: String },
    status: { type: String, enum: ["Paid", "UnPaid"], default: "UnPaid" },
    email: { type: String },
    phone: { type: String },
    totalAmount: { type: Number },
    paymentMethod: { type: String },
  },
  {
    timestamps: true,
  }
);

const invoiceModel = mongoose.model("Invoice", invoiceSchema);

export default invoiceModel;
