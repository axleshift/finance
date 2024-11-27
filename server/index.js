import express from "express";
import cors from "cors";
import "dotenv/config";
import { ConnectDB } from "./config/db.js";
import jwt from "jsonwebtoken";
import userRouter from "./router/userRouter.js";
import invoiceRouter from "./router/invoiceRouter.js";
import budgetRouter from "./router/budgetRouter.js";
import outFlowRouter from "./router/outFlowRouter.js";
import accountRequestRouter from "./router/accountRequest.js";
import depositRouter from "./router/depositRouter.js";
import withdrawRouter from "./router/withdrawRouter.js";
import totalCashRouter from "./router/totalCashRouter.js";
import payrollRouter from "./router/payrollRouter.js";
import budgetRequestRouter from "./router/budgetRequestRouter.js";

const port = process.env.PORT || 5054;

const app = express();

app.use(cors());
app.use(express.json());

ConnectDB();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/api/verifyToken", (req, res) => {
  const { token } = req.body;

  if (!token) {
    // If no token is provided, return an error response
    return res.status(400).json({ valid: false, message: "Token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // If token verification fails, return a 401 Unauthorized error
      return res.status(401).json({ valid: false, message: "Invalid Token" });
    }
    // If token is valid, return decoded data
    res.json({ valid: true, decoded });
  });
});

app.use("/api/user", userRouter);
app.use("/api/invoice", invoiceRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/accountRequest", accountRequestRouter);
app.use("/api/outFlow", outFlowRouter);
app.use("/api/deposit", depositRouter);
app.use("/api/withdraw", withdrawRouter);
app.use("/api/totalCash", totalCashRouter);
app.use("/api/payroll", payrollRouter);
app.use("/api/budgetRequest", budgetRequestRouter);
app.listen(port, () => {
  console.log(`Server Starter on http://localhost:${port}`);
});
