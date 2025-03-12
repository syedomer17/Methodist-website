import express from "express";
import staffModel from "../../models/Staff/Staff.js";

const router = express.Router();

// Get all staff
router.get("/getall", async (req, res) => {
  try {
    const staff = await staffModel.find();
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get staff by ID
router.get("/getbyid/:id", async (req, res) => {
  try {
    const staff = await staffModel.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all staff
router.delete("/deleteall", async (req, res) => {
  try {
    await staffModel.deleteMany();
    res.json({ message: "All staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete staff by ID
router.delete("/deletebyid/:id", async (req, res) => {
  try {
    const staff = await staffModel.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit staff by ID
router.put("/editbyid/:id", async (req, res) => {
  try {
    const updatedStaff = await staffModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStaff)
      return res.status(404).json({ message: "Staff not found" });
    res.json(updatedStaff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
