import express from "express";
import cors from "cors";
import "dotenv/config";
import { ConnectDB } from "./config/db.js";
import jwt from "jsonwebtoken";
import userRouter from "./router/userRouter.js";

const port = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

ConnectDB();

app.get("/", (req,res) => {
  res.send("Hello world");
});

app.use("/api/user",userRouter)
// app.use("/api/user", userRouter)

app.listen(port, () => {
  console.log(`Server Starter on http://localhost:${port}`);
});
