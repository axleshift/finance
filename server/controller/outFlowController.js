import expressAsyncHandler from "express-async-handler";
import outFlowModel from "../model/outFlowModel.js";

const getAllOutFlow = expressAsyncHandler(async (req, res) => {
  const getAll = await outFlowModel.find({});

  if (!getAll) {
    return res
      .status(404)
      .json({ success: false, message: "OutFlow not found!" });
  }

  res.status(200).json(getAll);
});

export { getAllOutFlow };
