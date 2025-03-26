import FreightAudit from "../model/freightAuditSchema.js";

// ✅ Create a new Freight Audit entry
export const createFreightAudit = async (req, res) => {
  try {
    const newAudit = new FreightAudit(req.body);
    const savedAudit = await newAudit.save();
    res.status(201).json(savedAudit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all Freight Audits
export const getAllFreightAudits = async (req, res) => {
  try {
    const audits = await FreightAudit.find();
    res.status(200).json(audits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a single Freight Audit by ID
export const getFreightAuditById = async (req, res) => {
  try {
    const audit = await FreightAudit.findById(req.params.id);
    if (!audit)
      return res.status(404).json({ message: "Freight Audit not found" });
    res.status(200).json(audit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a Freight Audit by ID
export const updateFreightAudit = async (req, res) => {
  try {
    const updatedAudit = await FreightAudit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAudit)
      return res.status(404).json({ message: "Freight Audit not found" });
    res.status(200).json(updatedAudit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete a Freight Audit by ID
export const deleteFreightAudit = async (req, res) => {
  try {
    const deletedAudit = await FreightAudit.findByIdAndDelete(req.params.id);
    if (!deletedAudit)
      return res.status(404).json({ message: "Freight Audit not found" });
    res.status(200).json({ message: "Freight Audit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
