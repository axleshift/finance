import mongoose from "mongoose";

const budgetSchema = mongoose.Schema(
  {
    fiscalYear: {
      type: String,
      required: true,
    },
    totalBudget: {
      type: Number,
      required: true,
    },
    usedBudget: {
      type: Number,
      default: 0, // Amount of the budget already used
    },
    remainingBudget: {
      type: Number,
      default: function () {
        return this.totalBudget - this.usedBudget;
      }, // Remaining budget calculated dynamically
    },
    transportationCosts: [
      {
        modeOfTransport: { type: String }, // E.g., 'Truck', 'Air', 'Sea'
        allocatedAmount: { type: Number }, // Amount allocated for each transport mode
        spentAmount: { type: Number, default: 0 }, // Amount spent on this transport mode
        date: { type: Date, default: Date.now }, // Date of allocation or spending
      },
    ],
    status: {
      type: String,
      enum: ["Approved", "Reject", "Pending"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const budgetModel = mongoose.model("Budget", budgetSchema);

export default budgetModel;
