import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

import { sendResetEmail, sendSetPasswordEmail } from "../services/emailService.js";
import { generateRawToken, hashToken, minutesFromNow } from "../utils/tokens.js";

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}


// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const identifier =
      req.body.identifier ?? req.body.email ?? req.body.username ?? "";
    const password = req.body.password ?? "";

    const idValue = String(identifier).trim();
    if (!idValue || typeof password !== "string" || !password) {
      return res.status(400).json({ message: "Email/username and password are required" });
    }

    const isEmail = idValue.includes("@");
    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: normalizeEmail(idValue) }
        : {
            OR: [{ username: idValue }, { email: normalizeEmail(idValue) }],
          },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.passwordHash) {
      return res.status(403).json({
        message: "Account is not active. Verify email and set password first.",
      });
    }

    if (user.status !== "ACTIVE" || !user.emailVerified || user.locked) {
      return res.status(403).json({
        message: "Account is not active. Verify email and set password first.",
      });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= VERIFY EMAIL =================
export const verifyEmail = async (req, res) => {
  try {
    const rawToken = String(req.body.token || "").trim();
    if (!rawToken) {
      return res.status(400).json({ message: "Token is required" });
    }

    const tokenHash = hashToken(rawToken);
    const tokenRow = await prisma.userToken.findFirst({
      where: {
        tokenHash,
        tokenType: "VERIFY_EMAIL",
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!tokenRow || !tokenRow.user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRow.userId },
        data: { emailVerified: true },
      }),
      prisma.userToken.update({
        where: { id: tokenRow.id },
        data: { usedAt: new Date() },
      }),
    ]);

    const setPasswordRaw = generateRawToken();
    await prisma.userToken.create({
      data: {
        userId: tokenRow.userId,
        tokenHash: hashToken(setPasswordRaw),
        tokenType: "SET_PASSWORD",
        expiresAt: minutesFromNow(60),
      },
    });

    await sendSetPasswordEmail(tokenRow.user.email, setPasswordRaw);

    res.json({ message: "Email verified. Please set your password." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= SET PASSWORD =================
export const setPassword = async (req, res) => {
  try {
    const rawToken = String(req.body.token || "").trim();
    const newPassword = String(req.body.newPassword || "");

    if (!rawToken || !newPassword) {
      return res.status(400).json({ message: "Token and newPassword are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const tokenHash = hashToken(rawToken);
    const tokenRow = await prisma.userToken.findFirst({
      where: {
        tokenHash,
        tokenType: "SET_PASSWORD",
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokenRow) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: tokenRow.userId },
        data: {
          passwordHash,
          status: "ACTIVE",
          locked: false,
        },
      }),
      prisma.userToken.update({
        where: { id: tokenRow.id },
        data: { usedAt: new Date() },
      }),
    ]);

    res.json({ message: "Password set. You can now sign in." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const identifier =
      req.body.identifier ?? req.body.email ?? req.body.username ?? "";
    const idValue = String(identifier).trim();

    if (!idValue) {
      return res.status(400).json({ message: "Email/username is required" });
    }

    const isEmail = idValue.includes("@");
    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: normalizeEmail(idValue) }
        : {
            OR: [{ username: idValue }, { email: normalizeEmail(idValue) }],
          },
    });

    if (!user) {
      return res.json({ message: "If the account exists, reset link will be sent" });
    }

    const rawToken = generateRawToken();
    await prisma.userToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawToken),
        tokenType: "SET_PASSWORD",
        expiresAt: minutesFromNow(30),
      },
    });

    await sendResetEmail(user.email, rawToken);

    res.json({ message: "Password reset link sent" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
