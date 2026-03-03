import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

function toDecimal(value) {
  if (value === null || value === undefined || value === "") return null;
  return new Prisma.Decimal(value);
}

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { sku, name, price } = req.body;

    if (!sku || !name || price === undefined || price === null || price === "") {
      return res
        .status(400)
        .json({ message: "sku, name and price are required" });
    }

    const created = await prisma.product.create({
      data: {
        sku: String(sku).trim(),
        name: String(name).trim(),
        price: toDecimal(price),
      },
    });

    res.status(201).json(created);
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Product SKU already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { sku, name, price } = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(sku !== undefined ? { sku: String(sku).trim() } : {}),
        ...(name !== undefined ? { name: String(name).trim() } : {}),
        ...(price !== undefined ? { price: toDecimal(price) } : {}),
      },
    });

    res.json(updated);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Product SKU already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.product.delete({ where: { id } });
    res.json({ message: "Product deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ message: error.message });
  }
};
