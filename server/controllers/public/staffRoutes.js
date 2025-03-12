import express from "express";
import config from "config";
import staffModel from "../../models/Staff/Staff.js";
import sendEmail from "../../utils/senEmail.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = config.get("JWT_SECRET");
const URL = config.get("SERVER_URL");

// Staff Signup
router.post("/signup", async (req, res) => {
  try {
    const { staffName, age, email, staffID } = req.body;

    if (!staffName || !age || !email || !staffID) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingStaff = await staffModel.findOne({ staffID });
    if (existingStaff) {
      return res.status(409).json({ message: "Staff ID already exists" });
    }

    const existingEmail = await staffModel.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const password = String(staffID);

    const emailToken = jwt.sign({ email, role: "staff" }, JWT_SECRET, {
      expiresIn: "1d",
    });

    const newStaff = new staffModel({
      staffName,
      age,
      email,
      staffID,
      password,
      staffVerified: { email: false },
      staffVerifiedToken: { email: emailToken },
    });

    await newStaff.save();

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Email Verification</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
    "
  >
    <table
      role="presentation"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      border="0"
      style="max-width: 600px; margin: auto; background-color: #ffffff"
    >
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #1e3a8a">
          <h2 style="color: #ffffff; margin: 0">Verify Your Email</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; text-align: center">
          <p style="font-size: 16px; color: #374151">
            Click the button below to verify your email address and activate
            your account.
          </p>
          <a
            href="${URL}/api/public/emailverify/${emailToken}"
            style="
              display: inline-block;
              padding: 12px 24px;
              margin-top: 12px;
              background-color: #1e3a8a;
              color: #ffffff;
              text-decoration: none;
              font-size: 16px;
              border-radius: 6px;
            "
          >
            Verify Email
          </a>
          <p style="margin-top: 20px; font-size: 14px; color: #6b7280">
            If the button doesn't work, copy and paste this URL:
          </p>
          <p
            style="
              font-size: 14px;
              color: #1e3a8a;
              word-break: break-all;
              text-align: center;
            "
          >
            ${URL}/api/public/emailverify/${emailToken}
          </p>
        </td>
      </tr>
      <tr>
        <td
          style="padding: 20px; text-align: center; background-color: #f3f4f6"
        >
          <p style="font-size: 12px; color: #6b7280">
            If you didn't request this email, you can safely ignore it.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    });

    res.status(201).json({ msg: "Staff registered. Please verify email." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
