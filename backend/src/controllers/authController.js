import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../lib/prisma.js";

import { sendResetEmail } from "../services/emailService.js";

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );


// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { username },
      data: {
        resetToken: token,
        resetExpiry: new Date(Date.now() + 15 * 60 * 1000)
      }
    });

    await sendResetEmail(username, token);

    res.json({ message: "Password reset link sent" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
