import express from "express";
import config from "config";
import studentModel from "../../models/Students/Students.js";
import sendEmail from "../../utils/senEmail.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = config.get("JWT_SECRET");
const URL = config.get("SERVER_URL");

// Student Signup
router.post("/signup", async (req, res) => {
  try {
    const { studentName, age, email, rollNumber } = req.body;

    if (!studentName || !age || !email || !rollNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingStudent = await studentModel.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(409).json({ message: "Roll number already exists" });
    }

    const existingEmail = await studentModel.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const password = String(rollNumber);

    const emailToken = jwt.sign({ email, role: "student" }, JWT_SECRET, {
      expiresIn: "1d",
    });

    const newStudent = new studentModel({
      studentName,
      age,
      email,
      rollNumber,
      password,
      studentVerified: { email: false },
      studentVerifiedToken: { email: emailToken },
    });

    await newStudent.save();

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click the link below to verify your email:</p>
      <a href="${URL}/api/auth/emailverify/${emailToken}">Verify Email</a>`,
    });

    res.status(201).json({ msg: "Student registered. Please verify email." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
