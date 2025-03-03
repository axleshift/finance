import cron from "node-cron";
import financialReportModel from "../model/financialReportModel.js";
import expressAsyncHandler from "express-async-handler";

// Function to generate financial report
const generateFinancialReport = async () => {
  try {
    const today = new Date();
    const reportDate = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`;

    // Fetch data from other collections (e.g., payments, expenses, etc.)
    const revenue = Math.floor(Math.random() * 5000000); // Placeholder revenue
    const fuelCosts = Math.floor(Math.random() * 50000);
    const driverSalaries = Math.floor(Math.random() * 100000);
    const maintenanceCosts = Math.floor(Math.random() * 30000);
    const insuranceCosts = Math.floor(Math.random() * 20000);
    // const tollsAndPermits = Math.floor(Math.random() * 10000);
    const officeAndAdmin = Math.floor(Math.random() * 50000);

    const totalExpenses =
      fuelCosts +
      driverSalaries +
      maintenanceCosts +
      insuranceCosts +
      // tollsAndPermits +
      officeAndAdmin;
    const netIncome = revenue - totalExpenses;

    // Liabilities and Equity (For Simplicity, using random values)
    const accountsReceivable = Math.floor(Math.random() * 200000);
    const fleetValue = Math.floor(Math.random() * 10000000);
    const cash = Math.floor(Math.random() * 1000000);
    const totalAssets = cash + accountsReceivable + fleetValue;

    const accountsPayable = Math.floor(Math.random() * 100000);
    const loansPayable = Math.floor(Math.random() * 500000);
    const totalLiabilities = accountsPayable + loansPayable;

    const ownersEquity = totalAssets - totalLiabilities;
    const totalLiabilitiesAndEquity = totalLiabilities + ownersEquity;

    // Create financial report
    const report = new financialReportModel({
      date: reportDate,
      cash,
      accountsReceivable,
      fleetValue,
      totalAssets,
      accountsPayable,
      loansPayable,
      totalLiabilities,
      ownersEquity,
      totalLiabilitiesAndEquity,
      revenue,
      fuelCosts,
      driverSalaries,
      maintenanceCosts,
      insuranceCosts,
      tollsAndPermits,
      officeAndAdmin,
      totalExpenses,
      netIncome,
    });

    await report.save();
    console.log(`Financial report for ${reportDate} saved successfully.`);
  } catch (error) {
    console.error("Error generating financial report:", error);
  }
};

cron.schedule(
  "0 0 1 * *",
  () => {
    console.log("Running scheduled financial report generation...");
    generateFinancialReport();
  },
  {
    timezone: "Asia/Manila",
  }
);

export const getAllFinancialReports = expressAsyncHandler(async (req, res) => {
  const data = await financialReportModel.find({});

  if (!data) {
    re.status(404).json({ success: false, message: "NO data found!" });
  }

  res.status(200).json(data);
});

export default generateFinancialReport;
