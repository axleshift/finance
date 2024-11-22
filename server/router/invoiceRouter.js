import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  statusUpdate
} from "../controller/invoiceController.js";
import { authMiddleware } from "../middleware/Auth.js";

const invoiceRouter = express.Router();

// Route for creating a new invoice
invoiceRouter.post("/create", createInvoice);

// Route for fetching all invoices
invoiceRouter.get("/getAll", getInvoices);

// Route for fetching a specific invoice by ID
invoiceRouter.get("/getSpecificId/:id", getInvoiceById);

// Route for updating an invoice
invoiceRouter.put("/update/:id", updateInvoice);

// Route for deleting an invoice
invoiceRouter.delete("/delete/:id", deleteInvoice);
invoiceRouter.put("/status/:id", statusUpdate);

export default invoiceRouter;
