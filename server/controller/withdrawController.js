import withdrawModel from "../model/withdrawModel.js";
import asyncHandler from "express-async-handler";
import userModel from "../model/userModel.js";
import bcrypt from "bcryptjs";

//GET TIME
function getCurrentDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString("en-US");
  const time = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return `${date} ${time}`;
}
const create = asyncHandler(async (req, res) => {
  const { email, password, totalAmount } = req.body;

  const existing = await userModel.findOne({ email });

  if (!existing) {
    return res.status(404).json({ success: false, message: "User not found!" });
  }

  const isMatch = await bcrypt.compare(password, existing.password);

  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Credentials" });
  }

  const created = new withdrawModel({
    dateTime: getCurrentDateTime(),
    adminId: existing._id,
    totalAmount: totalAmount,
  });

  await created.save();

  res
    .status(201)
    .json({ success: true, message: "Created Successfully!", data: created });
});

const getAllWithdraw = asyncHandler(async (req, res) => {
  const getAll = await withdrawModel.find({});

  if (!getAll) {
    return res
      .status(404)
      .json({ success: false, message: "Deposit not found!" });
  }

  res.status(200).json(getAll);
});

const withdrawAggregate = asyncHandler(async (req, res) => {
  const total = await withdrawModel.aggregate([
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  return res
    .status(200)
    .json({ data: total.length > 0 ? total[0].totalAmount : 0 });
});

export { create, getAllWithdraw, withdrawAggregate };
