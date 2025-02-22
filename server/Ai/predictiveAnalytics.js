import express from "express";
import * as tf from "@tensorflow/tfjs"; // Use @tensorflow/tfjs-node for server environments
import { getMonthlySalesAndRevenue } from "../controller/salesAndRevenueAggregate.js";
const predictiveAnalytics = express.Router();

console.log(getMonthlySalesAndRevenue);

const historicalData = [
  { month: 1, sales: 0 },
  { month: 2, sales: 900000 },
  { month: 3, sales: 0 },
  { month: 4, sales: 0 },
  { month: 5, sales: 0 },
  { month: 6, sales: 0 },
  { month: 7, sales: 0 },
  { month: 8, sales: 0 },
  { month: 9, sales: 0 },
  { month: 10, sales: 0 },
  { month: 11, sales: 0 },
  { month: 12, sales: 0 },
];

async function predictNextMonthSales(data) {
  try {
    const months = data.map((d) => d.month);
    const sales = data.map((d) => d.sales);

    // Normalize sales data
    const maxSales = Math.max(...sales) || 1; // Avoid division by zero
    const normalizedSales = sales.map((s) => s / maxSales);

    // Convert data to tensors
    const xs = tf.tensor2d(months, [months.length, 1]);
    const ys = tf.tensor2d(normalizedSales, [normalizedSales.length, 1]);

    // Define and compile the model
    const model = tf.sequential();
    model.add(
      tf.layers.dense({ units: 50, inputShape: [1], activation: "relu" })
    );
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({ optimizer: "adam", loss: "meanSquaredError" });

    // Train the model
    await model.fit(xs, ys, { epochs: 200 });

    // Get the current month and predict the next month
    const currentMonth = new Date().getMonth() + 1; // Month is 0-based, so add 1
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

    // Predict for the next month
    const nextMonthTensor = tf.tensor2d([nextMonth], [1, 1]);
    const prediction = model.predict(nextMonthTensor);
    const predictedSales = prediction.dataSync()[0] * maxSales;

    return {
      predictedSales: predictedSales.toFixed(2),
      nextMonth,
    };
  } catch (error) {
    throw new Error("Prediction failed: " + error.message);
  }
}

// Prediction endpoint
predictiveAnalytics.get("/predict-next-month-sales", async (req, res) => {
  try {
    const { predictedSales, nextMonth } = await predictNextMonthSales(
      historicalData
    );
    res.json({ nextMonth, predictedSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default predictiveAnalytics;
