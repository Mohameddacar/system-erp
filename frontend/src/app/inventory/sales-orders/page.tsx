"use client"

import { useEffect, useMemo, useState } from "react"
import { ModuleTable, type ModuleField } from "@/components/module-table"
import {
  createSalesOrder,
  deleteSalesOrder,
  getProducts,
  getSalesOrders,
  getWarehouses,
  updateSalesOrder,
} from "@/lib/api"

type SalesOrderRow = {
  id: string
  productId: string
  productSku: string
  productName: string
  warehouseId: string
  warehouseName: string
  quantity: string
  totalAmount: string
  createdAt: string
}

export default function Page() {
  const [rows, setRows] = useState<SalesOrderRow[]>([])
  const [warehouseOptions, setWarehouseOptions] = useState<
    Array<{ label: string; value: string }>
  >([])
  const [productOptions, setProductOptions] = useState<
    Array<{ label: string; value: string }>
  >([])

  const fields = useMemo<ModuleField<SalesOrderRow>[]>(
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
      { key: "quantity", label: "Qty", type: "text" },
      { key: "totalAmount", label: "Total Amount", type: "text" },
      { key: "createdAt", label: "Created At", type: "date", create: false, edit: false },
    ],
    [productOptions, warehouseOptions]
  )

  useEffect(() => {
    const load = async () => {
      const [warehouses, products, data] = await Promise.all([
        getWarehouses(),
        getProducts(),
        getSalesOrders(),
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
        data.map((o) => ({
          id: String(o.id),
          productId: String(o.productId),
          productSku: o.productSku,
          productName: o.productName,
          warehouseId: String(o.warehouseId),
          warehouseName: o.warehouseName,
          quantity: String(o.quantity),
          totalAmount: String(o.totalAmount),
          createdAt: o.createdAt.slice(0, 10),
        }))
      )
    }

    load().catch(() => setRows([]))
  }, [])

  const handlers = useMemo(
    () => ({
      onCreate: async (draft: SalesOrderRow) => {
        const created = await createSalesOrder({
          productId: draft.productId,
          warehouseId: draft.warehouseId,
          quantity: draft.quantity,
          totalAmount: draft.totalAmount,
        })

        return {
          id: String(created.id),
          productId: String(created.productId),
          productSku: created.productSku,
          productName: created.productName,
          warehouseId: String(created.warehouseId),
          warehouseName: created.warehouseName,
          quantity: String(created.quantity),
          totalAmount: String(created.totalAmount),
          createdAt: created.createdAt.slice(0, 10),
        }
      },
      onUpdate: async (draft: SalesOrderRow) => {
        const updated = await updateSalesOrder(Number(draft.id), {
          productId: draft.productId,
          warehouseId: draft.warehouseId,
          quantity: draft.quantity,
          totalAmount: draft.totalAmount,
        })

        return {
          id: String(updated.id),
          productId: String(updated.productId),
          productSku: updated.productSku,
          productName: updated.productName,
          warehouseId: String(updated.warehouseId),
          warehouseName: updated.warehouseName,
          quantity: String(updated.quantity),
          totalAmount: String(updated.totalAmount),
          createdAt: updated.createdAt.slice(0, 10),
        }
      },
      onDelete: async (row: SalesOrderRow) => {
        await deleteSalesOrder(Number(row.id))
      },
    }),
    []
  )

  return (
    <ModuleTable
      title="Sales Orders"
      description="Record sales by warehouse and product."
      fields={fields}
      initialData={rows}
      searchKeys={["warehouseName", "productSku", "productName"]}
      onCreate={handlers.onCreate}
      onUpdate={handlers.onUpdate}
      onDelete={handlers.onDelete}
    />
  )
}
