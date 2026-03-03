import { prisma } from "../src/lib/prisma.js";

async function main() {
  const now = new Date();

  await prisma.warehouse.createMany({
    data: [
      {
        id: 1,
        name: "Magic Pearls Main Warehouse",
        location: "Mogadishu, Somalia",
        createdAt: now,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.product.createMany({
    data: [
      { id: 1, sku: "MP-G1", name: "Magic Pearls Grade 1", price: "8.00", createdAt: now },
      { id: 2, sku: "MP-G2", name: "Magic Pearls Grade 2", price: "8.50", createdAt: now },
      { id: 3, sku: "MP-G3", name: "Magic Pearls Grade 3", price: "9.00", createdAt: now },
      { id: 4, sku: "MP-G4", name: "Magic Pearls Grade 4", price: "9.50", createdAt: now },
      { id: 5, sku: "MP-G5", name: "Magic Pearls Grade 5", price: "10.00", createdAt: now },
      { id: 6, sku: "MP-G6", name: "Magic Pearls Grade 6", price: "10.50", createdAt: now },
      { id: 7, sku: "MP-G7", name: "Magic Pearls Grade 7", price: "11.00", createdAt: now },
      { id: 8, sku: "MP-G8", name: "Magic Pearls Grade 8", price: "11.50", createdAt: now },
    ],
    skipDuplicates: true,
  });

  await prisma.inventoryStock.createMany({
    data: [
      { id: 1, warehouseId: 1, productId: 1, quantityOnHand: "500" },
      { id: 2, warehouseId: 1, productId: 2, quantityOnHand: "450" },
      { id: 3, warehouseId: 1, productId: 3, quantityOnHand: "400" },
      { id: 4, warehouseId: 1, productId: 4, quantityOnHand: "350" },
      { id: 5, warehouseId: 1, productId: 5, quantityOnHand: "300" },
      { id: 6, warehouseId: 1, productId: 6, quantityOnHand: "250" },
      { id: 7, warehouseId: 1, productId: 7, quantityOnHand: "200" },
      { id: 8, warehouseId: 1, productId: 8, quantityOnHand: "150" },
    ],
    skipDuplicates: true,
  });

  await prisma.inventoryMovement.createMany({
    data: [
      {
        id: 1,
        productId: 1,
        warehouseId: 1,
        movementType: "PURCHASE",
        quantity: "500",
        unitPrice: "6.00",
        createdAt: now,
      },
      {
        id: 2,
        productId: 2,
        warehouseId: 1,
        movementType: "PURCHASE",
        quantity: "450",
        unitPrice: "6.50",
        createdAt: now,
      },
      {
        id: 3,
        productId: 3,
        warehouseId: 1,
        movementType: "PURCHASE",
        quantity: "400",
        unitPrice: "7.00",
        createdAt: now,
      },
      {
        id: 4,
        productId: 4,
        warehouseId: 1,
        movementType: "PURCHASE",
        quantity: "350",
        unitPrice: "7.50",
        createdAt: now,
      },
      {
        id: 5,
        productId: 5,
        warehouseId: 1,
        movementType: "PURCHASE",
        quantity: "300",
        unitPrice: "8.00",
        createdAt: now,
      },
      {
        id: 6,
        productId: 6,
        warehouseId: 1,
        movementType: "PURCHASE",
        quantity: "250",
        unitPrice: "8.50",
        createdAt: now,
      },
      {
        id: 7,
        productId: 7,
        warehouseId: 1,
        movementType: "PURCHASE",
        quantity: "200",
        unitPrice: "9.00",
        createdAt: now,
      },
      {
        id: 8,
        productId: 8,
        warehouseId: 1,
        movementType: "PURCHASE",
        quantity: "150",
        unitPrice: "9.50",
        createdAt: now,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.salesOrder.createMany({
    data: [
      {
        id: 1,
        productId: 1,
        warehouseId: 1,
        quantity: "50",
        totalAmount: "400.00",
        createdAt: now,
      },
      {
        id: 2,
        productId: 2,
        warehouseId: 1,
        quantity: "40",
        totalAmount: "340.00",
        createdAt: now,
      },
      {
        id: 3,
        productId: 3,
        warehouseId: 1,
        quantity: "30",
        totalAmount: "270.00",
        createdAt: now,
      },
      {
        id: 4,
        productId: 4,
        warehouseId: 1,
        quantity: "25",
        totalAmount: "237.50",
        createdAt: now,
      },
      {
        id: 5,
        productId: 5,
        warehouseId: 1,
        quantity: "20",
        totalAmount: "200.00",
        createdAt: now,
      },
      {
        id: 6,
        productId: 6,
        warehouseId: 1,
        quantity: "15",
        totalAmount: "157.50",
        createdAt: now,
      },
      {
        id: 7,
        productId: 7,
        warehouseId: 1,
        quantity: "10",
        totalAmount: "110.00",
        createdAt: now,
      },
      {
        id: 8,
        productId: 8,
        warehouseId: 1,
        quantity: "8",
        totalAmount: "92.00",
        createdAt: now,
      },
    ],
    skipDuplicates: true,
  });

  const setSequence = async (tableName, columnName) => {
    const q = `SELECT setval(pg_get_serial_sequence('"${tableName}"', '${columnName}'), (SELECT COALESCE(MAX(${columnName}), 1) FROM "${tableName}"), true);`;
    await prisma.$executeRawUnsafe(q);
  };

  await setSequence("Warehouse", "id");
  await setSequence("Product", "id");
  await setSequence("InventoryStock", "id");
  await setSequence("InventoryMovement", "id");
  await setSequence("SalesOrder", "id");

  return {
    seeded: true,
  };
}

main()
  .then(() => {
    console.log("Inventory seed completed.");
  })
  .catch((error) => {
    console.error("Inventory seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
