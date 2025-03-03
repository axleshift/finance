import mongoose from "mongoose";

const financialSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true },

    // ASSETS
    cash: { type: Number, required: true },
    accountsReceivable: { type: Number, required: true }, // Unpaid customer invoices
    fleetValue: { type: Number, required: true }, // Value of trucks & equipment
    totalAssets: { type: Number, required: true },

    // LIABILITIES
    accountsPayable: { type: Number, required: true }, // Unpaid supplier bills
    loansPayable: { type: Number, required: true }, // Business loans for trucks, equipment
    totalLiabilities: { type: Number, required: true },

    // EQUITY
    ownersEquity: { type: Number, required: true }, // Owner’s investment & retained earnings
    totalLiabilitiesAndEquity: { type: Number, required: true }, // Should equal total assets

    // REVENUE
    revenue: { type: Number, required: true }, // Total earnings from freight services

    // EXPENSES
    fuelCosts: { type: Number, required: true },
    driverSalaries: { type: Number, required: true },
    maintenanceCosts: { type: Number, required: true },
    insuranceCosts: { type: Number, required: true },
    officeAndAdmin: { type: Number, required: true }, // Office rent, utilities, admin salaries
    totalExpenses: { type: Number, required: true },

    // NET INCOME
    netIncome: { type: Number, required: true }, // Revenue - Expenses
  },
  { timestamps: true }
);

export default mongoose.model("FinancialReport", financialSchema);
