import express from "express";
import {
  create,
  deleteBudget,
  getAll,
  getSpecificId,
  statusUpdate,
  update,
} from "../controller/budgetController.js";

const budgetRouter = express.Router();

budgetRouter.get("/", getAll);
budgetRouter.post("/", create);
budgetRouter.put("/:id", update);
budgetRouter.delete("/:id", deleteBudget);
budgetRouter.get("/getSpeficId/:id", getSpecificId);
budgetRouter.put("/updateStatus/:id",statusUpdate)

export default budgetRouter;
