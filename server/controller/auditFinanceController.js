import { userAccount } from "../middleware/Auth.js";
import auditFinanceModel from "../model/auditFinanceModel.js";
import expressAsyncHandler from "express-async-handler";
// GET
const getAllAuditFinance = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;

  const user = userAccount(userId);

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "User id not found!" });
  }

  const data = await auditFinanceModel.find({});

  if (!data) {
    return res
      .status(404)
      .json({ success: false, message: "Audit finance not found" });
  }

  res.status(200).json(data);
});

// CREATE
const createAuditFinance = expressAsyncHandler(async (req, res) => {
  const { entityTypes, eventTypes, entityId, changes, performeBy, role } =
    req.body;

  const newAuditLog = new AuditLog({
    eventTypes: "Create",
    entityType: "PurchaseOrder",
    entityId: savePO?._id,
    changes: {
      oldValue: null,
      newValue: savePO,
    },
    performeBy: userExist,
    role: userExist.role,
  });
});

// UPDATE

// DELETE
const deleteAuditFinance = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  const user = await userAccount(userId);

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "User id not found!" });
  }

  const deleted = await auditFinanceModel.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: "Audit not found" });
  }

  res.status(200).json({ success: true, message: "Deleted Successfully!" });
});

export { getAllAuditFinance, deleteAuditFinance };
