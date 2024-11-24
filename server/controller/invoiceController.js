import asyncHandler from "express-async-handler";
import invoiceModel from "../model/invoiceModel.js";
import Counter from "../model/Counter.js";

// Create a new invoice
const createInvoice = asyncHandler(async (req, res) => {
  const {
    invoiceNumber,
    firstName,
    lastName,
    address,
    products,
    selectedCurrency,
    status,
    email,
    phone,
    totalAmount,
    paymentMethod,
  } = req.body;

  const counter = await Counter.findByIdAndUpdate(
    {
      _id: "invoiceNumber",
    },
    {
      $inc: { sequence_value: 1 },
    },
    { new: true }
  );

  const invoiceNumbers = counter.sequence_value.toString().padStart(3, "0");

  const reference = `INV-${invoiceNumbers}`;
  const newInvoice = new invoiceModel({
    invoiceNumber: reference,
    firstName,
    lastName,
    address,
    products,
    selectedCurrency,
    status,
    email,
    phone,
    totalAmount,
    paymentMethod,
  });

  const savedInvoice = await newInvoice.save();
  res.status(201).json({
    success: true,
    message: "Invoice created successfully!",
    data: savedInvoice,
  });
});

// Get all invoices
const getInvoices = asyncHandler(async (req, res) => {
  try {
    const invoices = await invoiceModel.find();
    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error!" });
  }
});

// Get a single invoice by ID
const getInvoiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await invoiceModel.findById(id);

    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found!" });
    }

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error!" });
  }
});

// Update an invoice
const updateInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedInvoice = await invoiceModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedInvoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found!" });
    }

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully!",
      data: updatedInvoice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error!" });
  }
});

// Delete an invoice
const deleteInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const deletedInvoice = await invoiceModel.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found!" });
    }

    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error!" });
  }
});

const statusUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await invoiceModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updated) {
    return res
      .status(404)
      .json({ success: false, message: "Invoice not found!" });
  }

  res.status(200).json({ success: true, message: "Updated Successfully" });
});

export {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  statusUpdate,
};
