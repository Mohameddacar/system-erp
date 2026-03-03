"use client"

import { useEffect, useMemo, useState } from "react"
import { ModuleTable, type ModuleField } from "@/components/module-table"
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/lib/api"

type ProductRow = {
  id: string
  sku: string
  name: string
  price: string
  createdAt: string
}

const fields: ModuleField<ProductRow>[] = [
  { key: "sku", label: "SKU", type: "text" },
  { key: "name", label: "Name", type: "text" },
  { key: "price", label: "Price", type: "text" },
  { key: "createdAt", label: "Created At", type: "date", create: false, edit: false },
]

export default function Page() {
  const [rows, setRows] = useState<ProductRow[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await getProducts()
      setRows(
        data.map((p) => ({
          id: String(p.id),
          sku: p.sku,
          name: p.name,
          price: String(p.price),
          createdAt: p.createdAt.slice(0, 10),
        }))
      )
    }

    load().catch(() => setRows([]))
  }, [])

  const handlers = useMemo(
    () => ({
      onCreate: async (draft: ProductRow) => {
        const created = await createProduct({
          sku: draft.sku,
          name: draft.name,
          price: draft.price,
        })

        return {
          id: String(created.id),
          sku: created.sku,
          name: created.name,
          price: String(created.price),
          createdAt: created.createdAt.slice(0, 10),
        }
      },
      onUpdate: async (draft: ProductRow) => {
        const updated = await updateProduct(Number(draft.id), {
          sku: draft.sku,
          name: draft.name,
          price: draft.price,
        })

        return {
          id: String(updated.id),
          sku: updated.sku,
          name: updated.name,
          price: String(updated.price),
          createdAt: updated.createdAt.slice(0, 10),
        }
      },
      onDelete: async (row: ProductRow) => {
        await deleteProduct(Number(row.id))
      },
    }),
    []
  )

  return (
    <ModuleTable
      title="Products"
      description="Manage product SKUs and pricing."
      fields={fields}
      initialData={rows}
      searchKeys={["sku", "name"]}
      onCreate={handlers.onCreate}
      onUpdate={handlers.onUpdate}
      onDelete={handlers.onDelete}
    />
  )
}
