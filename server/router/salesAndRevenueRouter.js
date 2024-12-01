import express from "express";
import {
  getMonthlySalesAndRevenue,
  getYearlySalesAndRevenue,
} from "../controller/salesAndRevenueAggregate.js";

const salesAndRevenueRouter = express.Router();

salesAndRevenueRouter.get("/monthly-sales-revenue", async (req, res) => {
  try {
    const monthlyData = await getMonthlySalesAndRevenue();
    res.status(200).json(monthlyData);
  } catch (error) {
    console.error("Error fetching monthly sales and revenue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

salesAndRevenueRouter.get("/yearly-sales-revenue", async (req, res) => {
  try {
    const yearlyData = await getYearlySalesAndRevenue();
    res.status(200).json(yearlyData);
  } catch (error) {
    console.error("Error fetching yearly sales and revenue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default salesAndRevenueRouter;
