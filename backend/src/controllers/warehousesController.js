import { prisma } from "../lib/prisma.js";

export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWarehouse = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const created = await prisma.warehouse.create({
      data: {
        name: String(name).trim(),
        location: location !== undefined ? (location ? String(location) : null) : null,
      },
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWarehouse = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, location } = req.body;

    const updated = await prisma.warehouse.update({
      where: { id },
      data: {
        ...(name !== undefined ? { name: String(name).trim() } : {}),
        ...(location !== undefined
          ? { location: location ? String(location) : null }
          : {}),
      },
    });

    res.json(updated);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteWarehouse = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.warehouse.delete({ where: { id } });
    res.json({ message: "Warehouse deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Warehouse not found" });
    }
    res.status(500).json({ message: error.message });
  }
};
