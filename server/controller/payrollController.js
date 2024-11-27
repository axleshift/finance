import Counter from "../model/Counter.js";
import payrollModel from "../model/payrollModel.js";
import asyncHandler from "express-async-handler";

// Generate Payroll
const createPayroll = asyncHandler(async (req, res) => {
  const {
    employeeId,
    department,
    salary,
    employeeName,
    overtimeHours,
    overtimeRate,
    overtimePay,
    bonuses,
    deductions,
  } = req.body;

  console.log(overtimeHours);
  console.log(overtimeRate);
  console.log(overtimePay);
  console.log(salary);

  // Validate required fields
  if (!employeeId || !department || !salary || salary <= 0) {
    return res.status(400).json({
      success: false,
      message: "Required fields (employeeId, department, salary) must be valid",
    });
  }

  try {
    // Calculate payroll details
    const overtimePay = overtimeHours * overtimeRate;
    const grossPay = salary + overtimePay + bonuses;
    const netPay = grossPay - deductions;

    // Create payroll object
    const payroll = {
      employeeId,
      department,
      employeeName,
      salary,
      overtimeHours,
      overtimeRate,
      overtimePay,
      bonuses,
      grossPay,
      deductions,
      netPay,
      generatedDate: new Date().toISOString(),
    };

    // Save to the database
    const savedPayroll = await payrollModel.create(payroll);

    // Respond with the generated payroll
    res.status(201).json({
      success: true,
      message: "Payroll generated successfully",
      data: savedPayroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate payroll",
      error: error.message,
    });
  }
});

// Get All Payrolls
const getAllPayrolls = asyncHandler(async (req, res) => {
  try {
    const payrolls = await payrollModel.find();
    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payrolls",
      error: error.message,
    });
  }
});

// Get Payroll by ID
const getPayrollById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const payroll = await payrollModel.findById(id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    res.status(200).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payroll",
      error: error.message,
    });
  }
});

// Update Payroll
const updatePayroll = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedPayroll = await payrollModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPayroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payroll updated successfully",
      data: updatedPayroll,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update payroll",
      error: error.message,
    });
  }
});

// Delete Payroll
const deletePayroll = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const payroll = await payrollModel.findByIdAndDelete(id);

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payroll deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete payroll",
      error: error.message,
    });
  }
});

export {
  createPayroll,
  getAllPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
};
