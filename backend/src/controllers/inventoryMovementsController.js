import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

function toDecimal(value) {
  if (value === null || value === undefined || value === "") return null;
  return new Prisma.Decimal(value);
}

export const getInventoryMovements = async (req, res) => {
  try {
    const rows = await prisma.inventoryMovement.findMany({
      include: {
        warehouse: { select: { name: true } },
        product: { select: { sku: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(
      rows.map((row) => ({
        id: row.id,
        productId: row.productId,
        productSku: row.product.sku,
        productName: row.product.name,
        warehouseId: row.warehouseId,
        warehouseName: row.warehouse.name,
        movementType: row.movementType,
        quantity: row.quantity,
        unitPrice: row.unitPrice,
        createdAt: row.createdAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInventoryMovement = async (req, res) => {
  try {
    const { productId, warehouseId, movementType, quantity, unitPrice } = req.body;

    if (
      productId === undefined ||
      warehouseId === undefined ||
      !movementType ||
      quantity === undefined ||
      quantity === null ||
      quantity === ""
    ) {
      return res.status(400).json({
        message: "productId, warehouseId, movementType and quantity are required",
      });
    }

    const created = await prisma.inventoryMovement.create({
      data: {
        productId: Number(productId),
        warehouseId: Number(warehouseId),
        movementType: String(movementType).trim(),
        quantity: toDecimal(quantity),
        unitPrice: unitPrice === undefined ? null : toDecimal(unitPrice),
      },
      include: {
        warehouse: { select: { name: true } },
        product: { select: { sku: true, name: true } },
      },
    });

    res.status(201).json({
      id: created.id,
      productId: created.productId,
      productSku: created.product.sku,
      productName: created.product.name,
      warehouseId: created.warehouseId,
      warehouseName: created.warehouse.name,
      movementType: created.movementType,
      quantity: created.quantity,
      unitPrice: created.unitPrice,
      createdAt: created.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInventoryMovement = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { productId, warehouseId, movementType, quantity, unitPrice } = req.body;

    const updated = await prisma.inventoryMovement.update({
      where: { id },
      data: {
        ...(productId !== undefined ? { productId: Number(productId) } : {}),
        ...(warehouseId !== undefined ? { warehouseId: Number(warehouseId) } : {}),
        ...(movementType !== undefined
          ? { movementType: String(movementType).trim() }
          : {}),
        ...(quantity !== undefined ? { quantity: toDecimal(quantity) } : {}),
        ...(unitPrice !== undefined ? { unitPrice: toDecimal(unitPrice) } : {}),
      },
      include: {
        warehouse: { select: { name: true } },
        product: { select: { sku: true, name: true } },
      },
    });

    res.json({
      id: updated.id,
      productId: updated.productId,
      productSku: updated.product.sku,
      productName: updated.product.name,
      warehouseId: updated.warehouseId,
      warehouseName: updated.warehouse.name,
      movementType: updated.movementType,
      quantity: updated.quantity,
      unitPrice: updated.unitPrice,
      createdAt: updated.createdAt,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Movement not found" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteInventoryMovement = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.inventoryMovement.delete({ where: { id } });
    res.json({ message: "Movement deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Movement not found" });
    }
    res.status(500).json({ message: error.message });
  }
};
