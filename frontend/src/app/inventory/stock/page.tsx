"use client"

import { useEffect, useMemo, useState } from "react"
import { ModuleTable, type ModuleField } from "@/components/module-table"
import {
  createInventoryStock,
  deleteInventoryStock,
  getInventoryStock,
  getProducts,
  getWarehouses,
  updateInventoryStock,
} from "@/lib/api"

type StockRow = {
  id: string
  warehouseId: string
  warehouseName: string
  productId: string
  productSku: string
  productName: string
  quantityOnHand: string
}

export default function Page() {
  const [rows, setRows] = useState<StockRow[]>([])
  const [warehouseOptions, setWarehouseOptions] = useState<
    Array<{ label: string; value: string }>
  >([])
  const [productOptions, setProductOptions] = useState<
    Array<{ label: string; value: string }>
  >([])

  const fields = useMemo<ModuleField<StockRow>[]>(
    () => [
      {
        key: "warehouseId",
        label: "Warehouse",
        type: "select",
        options: warehouseOptions,
      },
      {
        key: "warehouseName",
        label: "Warehouse Name",
        type: "text",
        create: false,
        edit: false,
      },
      {
        key: "productId",
        label: "Product",
        type: "select",
        options: productOptions,
      },
      { key: "productSku", label: "SKU", type: "text", create: false, edit: false },
      { key: "productName", label: "Product Name", type: "text", create: false, edit: false },
      { key: "quantityOnHand", label: "Qty On Hand", type: "text" },
    ],
    [warehouseOptions, productOptions]
  )

  useEffect(() => {
    const load = async () => {
      const [warehouses, products, data] = await Promise.all([
        getWarehouses(),
        getProducts(),
        getInventoryStock(),
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
        data.map((r) => ({
          id: String(r.id),
          warehouseId: String(r.warehouseId),
          warehouseName: r.warehouseName,
          productId: String(r.productId),
          productSku: r.productSku,
          productName: r.productName,
          quantityOnHand: String(r.quantityOnHand),
        }))
      )
    }

    load().catch(() => setRows([]))
  }, [])

  const handlers = useMemo(
    () => ({
      onCreate: async (draft: StockRow) => {
        const created = await createInventoryStock({
          warehouseId: draft.warehouseId,
          productId: draft.productId,
          quantityOnHand: draft.quantityOnHand,
        })

        return {
          id: String(created.id),
          warehouseId: String(created.warehouseId),
          warehouseName: created.warehouseName,
          productId: String(created.productId),
          productSku: created.productSku,
          productName: created.productName,
          quantityOnHand: String(created.quantityOnHand),
        }
      },
      onUpdate: async (draft: StockRow) => {
        const updated = await updateInventoryStock(Number(draft.id), {
          warehouseId: draft.warehouseId,
          productId: draft.productId,
          quantityOnHand: draft.quantityOnHand,
        })

        return {
          id: String(updated.id),
          warehouseId: String(updated.warehouseId),
          warehouseName: updated.warehouseName,
          productId: String(updated.productId),
          productSku: updated.productSku,
          productName: updated.productName,
          quantityOnHand: String(updated.quantityOnHand),
        }
      },
      onDelete: async (row: StockRow) => {
        await deleteInventoryStock(Number(row.id))
      },
    }),
    []
  )

  return (
    <ModuleTable
      title="Inventory Stock"
      description="Track current on-hand quantities by warehouse and product."
      fields={fields}
      initialData={rows}
      searchKeys={["warehouseName", "productSku", "productName"]}
      onCreate={handlers.onCreate}
      onUpdate={handlers.onUpdate}
      onDelete={handlers.onDelete}
    />
  )
}
