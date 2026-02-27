import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

const USER_SELECT = {
  id: true,
  username: true,
  role: true,
  createdAt: true,
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: USER_SELECT,
      orderBy: { id: "desc" },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: role || "USER",
      },
      select: USER_SELECT,
    });

    res.status(201).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { username, password, role } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const data = {};

    if (typeof username === "string" && username.trim()) {
      data.username = username;
    }

    if (typeof role === "string" && role.trim()) {
      data.role = role;
    }

    if (typeof password === "string" && password.trim()) {
      data.password = await bcrypt.hash(password, 10);
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
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
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
