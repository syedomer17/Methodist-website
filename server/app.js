import express from "express";
import config from "config";
import cors from "cors";
import rateLimit from "express-rate-limit";
import publicStudentRoutes from "./controllers/public/studentRoutes.js";
import publicStaffRoutes from "./controllers/public/staffRoutes.js";
import authRoutes from "./controllers/public/authRoutes.js";
import authMiddleware from "./controllers/middleware/auth.js";

import "./utils/dbConnect.js";
import studentRouter from "./controllers/Student/index.js"
import staffRouter from "./controllers/Staff/index.js"

const app = express();
const PORT = config.get("PORT") || 8090;

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use(express.json());

//✅ Global Rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // Max 100 requests per IP
  message: "Too many requests, please try again later.",
  header: true,
});

app.use(globalLimiter);

// Public routes for publicStudent and Staff
app.use("/api/public/publicStudents", publicStudentRoutes);
app.use("/api/public/staff", publicStaffRoutes);
app.use("/api/public/auth", authRoutes);

// Middleware for authentication (protect future private routes)
app.use(authMiddleware);

// private routes 
app.use("/api/private/student",studentRouter);
app.use("api/private/staff",staffRouter)

// ✅ Home Route
app.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Server is up and Running" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

// ✅ Not Found Route
app.use((req, res) => {
  res.status(404).json({ message: "Not Found Router" });
});

// ✅ Server Listen
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
