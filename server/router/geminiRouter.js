import express from "express";
import invoiceModel from "../model/invoiceModel.js";
import { run } from "../geminiApi/geminiApi.js";

const geminiRouter = express.Router();

// Function to get monthly sales and revenue
const getMonthlySalesAndRevenue = async () => {
  try {
    // MongoDB Aggregation to get data grouped by month
    const monthlyData = await invoiceModel.aggregate([
      {
        $match: { status: "Paid" },
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalAmount" },
          totalSales: {
            $sum: {
              $multiply: ["$products.quantity", "$products.price"],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort by date
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalRevenue: 1,
          totalSales: 1,
        },
      },
    ]);

    return monthlyData;
  } catch (error) {
    console.error("Error fetching monthly sales and revenue:", error);
    return [];
  }
};
const predictFutureSalesAndRevenue = async () => {
  try {
    const monthlyStats = await getMonthlySalesAndRevenue();

    if (monthlyStats.length === 0) {
      return "No historical data available for prediction.";
    }

    const thisMonth = monthlyStats[monthlyStats.length - 1];

    const prompt = `
      Given the revenue and sales data for this month, estimate next month’s revenue and sales.

      Historical Data:
      - This Month: Revenue = ${thisMonth.totalRevenue} pesos, Sales = ${thisMonth.totalSales}

      Predict the next month’s revenue and sales using reasonable market growth trends.
      
      Assume a typical monthly revenue growth of **5-15%** based on industry trends, unless the trend suggests otherwise.

      IMPORTANT: Return your response in this exact format:
      Revenue: <value>
      Sales: <value>

      Format your response as: Revenue: <value> Sales: <value> I need only fixed answer base on this Revenue: <value> Sales: <value> IMPORTANT: Return numbers **without commas**. 
    `;

    // Send request to Gemini AI
    const prediction = await run(prompt);
    return prediction;
  } catch (error) {
    console.error("Error predicting future sales and revenue:", error);
    return "Unable to generate prediction.";
  }
};

// API Route
const getSalesForecast = async (req, res) => {
  try {
    const monthlyStats = await getMonthlySalesAndRevenue();
    const prediction = await predictFutureSalesAndRevenue();

    res.status(200).json({
      monthlyStats,
      futurePrediction: prediction,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sales data." });
  }
};

geminiRouter.get("/sales-forecast", getSalesForecast);

export default geminiRouter;
