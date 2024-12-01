import expressAsyncHandler from "express-async-handler";
import accountRequestModel from "../model/accountRequestModel.js";
import Counter from "../model/Counter.js";

const create = expressAsyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  const counter = await Counter.findByIdAndUpdate(
    {
      _id: "accountNumber",
    },
    {
      $inc: { sequence_value: 1 },
    },
    { new: true, upsert: true }
  );

  const accountNumber = counter.sequence_value.toString().padStart(3, "0");

  const reference = `ACCREQ-${accountNumber}`;

  const created = new accountRequestModel({
    accountNumber: reference,
    fullName,
    email,
  });

  if (!created) {
    return res
      .status(404)
      .json({ success: false, message: "Account Request Not found" });
  }

  created.save();

  res.status(201).json({ success: true, message: "Created Account Request" });
});

const getAll = expressAsyncHandler(async (req, res) => {
  const retrieve = await accountRequestModel.find({});
  if (!retrieve) {
    return res
      .status(404)
      .json({ success: false, message: "Account Request Not found!" });
  }
  res.status(200).json(retrieve);
});

const deleteAccountRequest = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await accountRequestModel.findByIdAndDelete(id);

  res.status(200).json({ success: true, message: "Deleted Successfully" });
});

const getSpecificId = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const getData = await accountRequestModel.findById(id);

  res
    .status(200)
    .json({ success: true, message: "Get Successfully", data: getData });
});

const updateAccountRequest = expressAsyncHandler(async (req, res) => {
  const { userName, password, email, fullName, role } = req.body;
  const { id } = req.params;

  const updated = await accountRequestModel.findByIdAndUpdate(
    id,
    { userName, password, email, fullName, role },
    { new: true }
  );

  if (!updated) {
    return res
      .status(404)
      .json({ success: false, message: "Account not found!" });
  }

  res.status(200).json({ success: true, message: "Updated Successfully!" });
});

export {
  create,
  getAll,
  deleteAccountRequest,
  getSpecificId,
  updateAccountRequest,
};
