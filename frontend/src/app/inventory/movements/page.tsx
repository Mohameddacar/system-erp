"use client"

import { useEffect, useMemo, useState } from "react"
import { ModuleTable, type ModuleField } from "@/components/module-table"
import {
  createInventoryMovement,
  deleteInventoryMovement,
  getInventoryMovements,
  getProducts,
  getWarehouses,
  updateInventoryMovement,
} from "@/lib/api"

type MovementRow = {
  id: string
  productId: string
  productSku: string
  productName: string
  warehouseId: string
  warehouseName: string
  movementType: string
  quantity: string
  unitPrice: string
  createdAt: string
}

export default function Page() {
  const [rows, setRows] = useState<MovementRow[]>([])
  const [warehouseOptions, setWarehouseOptions] = useState<
    Array<{ label: string; value: string }>
  >([])
  const [productOptions, setProductOptions] = useState<
    Array<{ label: string; value: string }>
  >([])

  const fields = useMemo<ModuleField<MovementRow>[]>(
    () => [
      { key: "productId", label: "Product", type: "select", options: productOptions },
      { key: "productSku", label: "SKU", type: "text", create: false, edit: false },
      { key: "productName", label: "Product", type: "text", create: false, edit: false },
      {
        key: "warehouseId",
        label: "Warehouse",
        type: "select",
        options: warehouseOptions,
      },
      { key: "warehouseName", label: "Warehouse", type: "text", create: false, edit: false },
      { key: "movementType", label: "Type", type: "text" },
      { key: "quantity", label: "Qty", type: "text" },
      { key: "unitPrice", label: "Unit Price", type: "text" },
      { key: "createdAt", label: "Created At", type: "date", create: false, edit: false },
    ],
    [productOptions, warehouseOptions]
  )

  useEffect(() => {
    const load = async () => {
      const [warehouses, products, data] = await Promise.all([
        getWarehouses(),
        getProducts(),
        getInventoryMovements(),
      ])

      setWarehouseOptions(
        warehouses.map((w) => ({ label: w.name, value: String(w.id) }))
      )
      setProductOptions(
        products.map((p) => ({
          label: `${p.sku} - ${p.name}`,
          value: String(p.id),
        }))
      )

      setRows(
        data.map((m) => ({
          id: String(m.id),
          productId: String(m.productId),
          productSku: m.productSku,
          productName: m.productName,
          warehouseId: String(m.warehouseId),
          warehouseName: m.warehouseName,
          movementType: m.movementType,
          quantity: String(m.quantity),
          unitPrice: m.unitPrice ? String(m.unitPrice) : "",
          createdAt: m.createdAt.slice(0, 10),
        }))
      )
    }

    load().catch(() => setRows([]))
  }, [])

  const handlers = useMemo(
    () => ({
      onCreate: async (draft: MovementRow) => {
        const created = await createInventoryMovement({
          productId: draft.productId,
          warehouseId: draft.warehouseId,
          movementType: draft.movementType,
          quantity: draft.quantity,
          unitPrice: draft.unitPrice || undefined,
        })

        return {
          id: String(created.id),
          productId: String(created.productId),
          productSku: created.productSku,
          productName: created.productName,
          warehouseId: String(created.warehouseId),
          warehouseName: created.warehouseName,
          movementType: created.movementType,
          quantity: String(created.quantity),
          unitPrice: created.unitPrice ? String(created.unitPrice) : "",
          createdAt: created.createdAt.slice(0, 10),
        }
      },
      onUpdate: async (draft: MovementRow) => {
        const updated = await updateInventoryMovement(Number(draft.id), {
          productId: draft.productId,
          warehouseId: draft.warehouseId,
          movementType: draft.movementType,
          quantity: draft.quantity,
          unitPrice: draft.unitPrice,
        })

        return {
          id: String(updated.id),
          productId: String(updated.productId),
          productSku: updated.productSku,
          productName: updated.productName,
          warehouseId: String(updated.warehouseId),
          warehouseName: updated.warehouseName,
          movementType: updated.movementType,
          quantity: String(updated.quantity),
          unitPrice: updated.unitPrice ? String(updated.unitPrice) : "",
          createdAt: updated.createdAt.slice(0, 10),
        }
      },
      onDelete: async (row: MovementRow) => {
        await deleteInventoryMovement(Number(row.id))
      },
    }),
    []
  )

  return (
    <ModuleTable
      title="Inventory Movements"
      description="Maintain a stock ledger of purchases, sales, and adjustments."
      fields={fields}
      initialData={rows}
      searchKeys={["movementType", "warehouseName", "productSku", "productName"]}
      onCreate={handlers.onCreate}
      onUpdate={handlers.onUpdate}
      onDelete={handlers.onDelete}
    />
  )
}
