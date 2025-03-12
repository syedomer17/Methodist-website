import express from "express";
import config from "config";
import jwt from "jsonwebtoken";
import studentModel from "../../models/Students/Students.js";
import staffModel from "../../models/Staff/Staff.js";
import sendEmail from "../../utils/senEmail.js";

const router = express.Router();
const JWT_SECRET = config.get("JWT_SECRET");
const URL = config.get("SERVER_URL");

// Email Verification for Students & Staff
router.get("/emailverify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, JWT_SECRET);
    const { email, role } = decoded; // Role: "student" or "staff"

    const Model = role === "student" ? studentModel : staffModel;
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token." });
    }

    user[`${role}Verified`].email = true;
    user[`${role}VerifiedToken`].email = null;
    await user.save();

    res.status(200).json({ message: `${role} email verified successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invalid or expired token." });
  }
});

// Password Reset for Students & Staff
router.post("/resetpassword", async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res
        .status(400)
        .json({ message: "Please provide email and role." });
    }

    const Model = role === "student" ? studentModel : staffModel;
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: `${role} not found.` });
    }

    if (!user[`${role}Verified`].email) {
      return res
        .status(400)
        .json({
          message: "Please verify your email before resetting your password.",
        });
    }

    const newPassword = String(
      user[role === "student" ? "rollNumber" : "staffID"]
    );

    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>Your new password is your ${
        role === "student" ? "Roll Number" : "Staff ID"
      }: <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <h2 style="color: #333; text-align: center;">🔑 Password Reset</h2>
                    <p style="color: #555; font-size: 16px;">Hello,</p>
                    <p style="color: #555; font-size: 16px;">You requested a password reset. Use the new password below to log in:</p>
                    <div style="text-align: center; padding: 15px; background-color: #007bff; color: #fff; font-size: 18px; font-weight: bold; border-radius: 5px;">
                        ${newPassword}
                    </div>
                    <p style="color: #555; font-size: 16px;">For security reasons, we recommend changing this password after logging in.</p>
                    <hr style="border: none; height: 1px; background-color: #ddd;">
                    <p style="color: #777; font-size: 14px; text-align: center;">If you didn’t request this, please ignore this email.</p>
                    <p style="color: #777; font-size: 14px; text-align: center;">© 2025 YourCompany. All rights reserved.</p>
                </div>`,
    });

    return res
      .status(200)
      .json({ message: "Password has been sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
