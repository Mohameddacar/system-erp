import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

function toDecimal(value) {
  if (value === null || value === undefined || value === "") return null;
  return new Prisma.Decimal(value);
}

export const getSalesOrders = async (req, res) => {
  try {
    const rows = await prisma.salesOrder.findMany({
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
        quantity: row.quantity,
        totalAmount: row.totalAmount,
        createdAt: row.createdAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSalesOrder = async (req, res) => {
  try {
    const { productId, warehouseId, quantity, totalAmount } = req.body;

    if (
      productId === undefined ||
      warehouseId === undefined ||
      quantity === undefined ||
      quantity === null ||
      quantity === "" ||
      totalAmount === undefined ||
      totalAmount === null ||
      totalAmount === ""
    ) {
      return res.status(400).json({
        message: "productId, warehouseId, quantity and totalAmount are required",
      });
    }

    const created = await prisma.salesOrder.create({
      data: {
        productId: Number(productId),
        warehouseId: Number(warehouseId),
        quantity: toDecimal(quantity),
        totalAmount: toDecimal(totalAmount),
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
      quantity: created.quantity,
      totalAmount: created.totalAmount,
      createdAt: created.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSalesOrder = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { productId, warehouseId, quantity, totalAmount } = req.body;

    const updated = await prisma.salesOrder.update({
      where: { id },
      data: {
        ...(productId !== undefined ? { productId: Number(productId) } : {}),
        ...(warehouseId !== undefined ? { warehouseId: Number(warehouseId) } : {}),
        ...(quantity !== undefined ? { quantity: toDecimal(quantity) } : {}),
        ...(totalAmount !== undefined
          ? { totalAmount: toDecimal(totalAmount) }
          : {}),
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
      quantity: updated.quantity,
      totalAmount: updated.totalAmount,
      createdAt: updated.createdAt,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Sales order not found" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteSalesOrder = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.salesOrder.delete({ where: { id } });
    res.json({ message: "Sales order deleted" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Sales order not found" });
    }
    res.status(500).json({ message: error.message });
  }
};
