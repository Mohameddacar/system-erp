import express from "express";
import { sendWelcomeCredentialsEmail } from "../services/emailService.js";

const router = express.Router();

// Development-only helper route to verify Nodemailer/Gmail configuration.
// POST /api/debug/test-email
// Body: { "email"?: string }
router.post("/test-email", async (req, res) => {
  try {
    const toEmail = String(req.body?.email || process.env.EMAIL_USER || "").trim();

    if (!toEmail) {
      return res.status(400).json({ message: "Target email is required" });
    }

    await sendWelcomeCredentialsEmail({
      email: toEmail,
      fullName: "Test User",
      username: "testuser",
      password: "Test1234",
      role: "ADMIN",
    });

    res.json({ message: "Test email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
