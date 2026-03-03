import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

function toDecimal(value) {
  if (value === null || value === undefined || value === "") return null;
  return new Prisma.Decimal(value);
}

export const getInventoryStock = async (req, res) => {
  try {
    const rows = await prisma.inventoryStock.findMany({
      include: {
        warehouse: { select: { name: true } },
        product: { select: { sku: true, name: true } },
      },
      orderBy: { id: "desc" },
    });

    res.json(
      rows.map((row) => ({
        id: row.id,
        warehouseId: row.warehouseId,
        warehouseName: row.warehouse.name,
        productId: row.productId,
        productSku: row.product.sku,
        productName: row.product.name,
        quantityOnHand: row.quantityOnHand,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInventoryStock = async (req, res) => {
  try {
    const { warehouseId, productId, quantityOnHand } = req.body;

    if (warehouseId === undefined || productId === undefined) {
      return res
        .status(400)
        .json({ message: "warehouseId and productId are required" });
    }

    const created = await prisma.inventoryStock.create({
      data: {
        warehouseId: Number(warehouseId),
        productId: Number(productId),
        quantityOnHand:
          quantityOnHand === undefined ? undefined : toDecimal(quantityOnHand),
      },
      include: {
        warehouse: { select: { name: true } },
        product: { select: { sku: true, name: true } },
      },
    });

    res.status(201).json({
      id: created.id,
      warehouseId: created.warehouseId,
      warehouseName: created.warehouse.name,
      productId: created.productId,
      productSku: created.product.sku,
      productName: created.product.name,
      quantityOnHand: created.quantityOnHand,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Stock row already exists for this warehouse/product" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateInventoryStock = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { warehouseId, productId, quantityOnHand } = req.body;

    const updated = await prisma.inventoryStock.update({
      where: { id },
      data: {
        ...(warehouseId !== undefined ? { warehouseId: Number(warehouseId) } : {}),
        ...(productId !== undefined ? { productId: Number(productId) } : {}),
        ...(quantityOnHand !== undefined
          ? { quantityOnHand: toDecimal(quantityOnHand) }
          : {}),
      },
      include: {
        warehouse: { select: { name: true } },
        product: { select: { sku: true, name: true } },
      },
    });

    res.json({
      id: updated.id,
      warehouseId: updated.warehouseId,
      warehouseName: updated.warehouse.name,
      productId: updated.productId,
      productSku: updated.product.sku,
      productName: updated.product.name,
      quantityOnHand: updated.quantityOnHand,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Stock row not found" });
    }
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Stock row already exists for this warehouse/product" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteInventoryStock = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.inventoryStock.delete({ where: { id } });
    res.json({ message: "Stock row deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Stock row not found" });
    }
    res.status(500).json({ message: error.message });
  }
};
