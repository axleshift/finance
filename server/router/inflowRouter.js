import express from "express";
import { getAllInflow } from "../controller/inflowController.js";

const inflowRouter = express.Router();

inflowRouter.get("/getAll", getAllInflow);

export default inflowRouter;
