"use client"

import { useEffect, useMemo, useState } from "react"
import { ModuleTable, type ModuleField } from "@/components/module-table"
import {
  createWarehouse,
  deleteWarehouse,
  getWarehouses,
  updateWarehouse,
} from "@/lib/api"

type WarehouseRow = {
  id: string
  name: string
  location: string
  createdAt: string
}

const fields: ModuleField<WarehouseRow>[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "createdAt", label: "Created At", type: "date", create: false, edit: false },
]

export default function Page() {
  const [rows, setRows] = useState<WarehouseRow[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await getWarehouses()
      setRows(
        data.map((w) => ({
          id: String(w.id),
          name: w.name,
          location: w.location ?? "",
          createdAt: w.createdAt.slice(0, 10),
        }))
      )
    }

    load().catch(() => setRows([]))
  }, [])

  const handlers = useMemo(
    () => ({
      onCreate: async (draft: WarehouseRow) => {
        const created = await createWarehouse({
          name: draft.name,
          location: draft.location || undefined,
        })

        return {
          id: String(created.id),
          name: created.name,
          location: created.location ?? "",
          createdAt: created.createdAt.slice(0, 10),
        }
      },
      onUpdate: async (draft: WarehouseRow) => {
        const updated = await updateWarehouse(Number(draft.id), {
          name: draft.name,
          location: draft.location,
        })

        return {
          id: String(updated.id),
          name: updated.name,
          location: updated.location ?? "",
          createdAt: updated.createdAt.slice(0, 10),
        }
      },
      onDelete: async (row: WarehouseRow) => {
        await deleteWarehouse(Number(row.id))
      },
    }),
    []
  )

  return (
    <ModuleTable
      title="Warehouses"
      description="Manage warehouse locations and storage points."
      fields={fields}
      initialData={rows}
      searchKeys={["name", "location"]}
      onCreate={handlers.onCreate}
      onUpdate={handlers.onUpdate}
      onDelete={handlers.onDelete}
    />
  )
}
