import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { sendWelcomeCredentialsEmail } from "../services/emailService.js";

const USER_SELECT = {
  id: true,
  email: true,
  username: true,
  fullName: true,
  role: true,
  status: true,
  emailVerified: true,
  locked: true,
  createdAt: true,
  updatedAt: true,
};

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function baseUsernameFromEmail(email) {
  const local = String(email || "").split("@")[0] || "user";
  return local.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20) || "user";
}

function validateEmailOrThrow(email) {
  const value = normalizeEmail(email);
  if (!value) {
    throw new Error("Email is required");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new Error("Email is not valid");
  }
  return value;
}

function validateFullNameOrThrow(fullName) {
  const value = String(fullName || "").trim();
  if (!value) {
    throw new Error("Full name is required");
  }
  if (value.length < 3 || value.length > 60) {
    throw new Error("Full name must be between 3 and 60 characters");
  }
  const nameRegex = /^[A-Za-z ]+$/;
  if (!nameRegex.test(value)) {
    throw new Error("Full name can only contain letters and spaces");
  }
  return value;
}

function validateUsernameOrThrow(username) {
  const value = String(username || "").trim();
  if (!value) {
    throw new Error("Username is required");
  }
  const usernameRegex = /^[A-Za-z]{3,20}$/;
  if (!usernameRegex.test(value)) {
    throw new Error("Username must be 3-20 letters only (no numbers or symbols)");
  }
  return value;
}

export const getAdminUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: USER_SELECT,
      orderBy: { createdAt: "desc" },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdminUser = async (req, res) => {
  try {
    const email = validateEmailOrThrow(req.body.email);
    const role = String(req.body.role || "").trim() || "USER";
    const fullName = validateFullNameOrThrow(req.body.fullName);
    const requestedUsername = validateUsernameOrThrow(req.body.username);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    let username = requestedUsername;

    // Ensure username uniqueness
    const existingUserByUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUserByUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Generate a random initial password
    const rawPassword = Math.random().toString(36).slice(-8) + "A1";
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        fullName,
        role,
        status: "ACTIVE",
        emailVerified: true,
        locked: false,
        passwordHash,
      },
      select: USER_SELECT,
    });

    await sendWelcomeCredentialsEmail({
      email,
      fullName,
      username,
      password: rawPassword,
      role,
    });

    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error &&
        ["Email is required","Email is not valid","Full name is required","Full name must be between 3 and 60 characters","Full name can only contain letters and spaces","Username is required","Username must be 3-20 letters only (no numbers or symbols)"].includes(error.message)) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email or username already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminUser = async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const data = {};
    if (typeof req.body.role === "string" && req.body.role.trim()) {
      data.role = req.body.role.trim();
    }
    if (typeof req.body.status === "string" && req.body.status.trim()) {
      data.status = req.body.status.trim();
    }
    if (typeof req.body.locked === "boolean") {
      data.locked = req.body.locked;
    }
    if (typeof req.body.fullName === "string") {
      data.fullName = validateFullNameOrThrow(req.body.fullName);
    }
    if (typeof req.body.username === "string" && req.body.username.trim()) {
      data.username = validateUsernameOrThrow(req.body.username);
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    });

    res.json(user);
  } catch (error) {
    if (error instanceof Error &&
        ["Email is required","Email is not valid","Full name is required","Full name must be between 3 and 60 characters","Full name can only contain letters and spaces","Username is required","Username must be 3-20 letters only (no numbers or symbols)"].includes(error.message)) {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email or username already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdminUser = async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: error.message });
  }
};
