import express from "express";
import studentModel from "../../models/Students/Students.js";

const router = express.Router();

// Get all students
router.get("/getall", async (req, res) => {
  try {
    const students = await studentModel.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get student by ID
router.get("/getbyid/:id", async (req, res) => {
  try {
    const student = await studentModel.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all students
router.delete("/deleteall", async (req, res) => {
  try {
    await studentModel.deleteMany();
    res.json({ message: "All students deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete student by ID
router.delete("/deletebyid/:id", async (req, res) => {
  try {
    const student = await studentModel.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit student by ID
router.put("/editbyid/:id", async (req, res) => {
  try {
    const updatedStudent = await studentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStudent)
      return res.status(404).json({ message: "Student not found" });
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
