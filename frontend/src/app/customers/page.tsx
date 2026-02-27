"use client"

import { useEffect, useMemo, useState } from "react"
import { ModuleTable, type ModuleField } from "@/components/module-table"
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "@/lib/api"

type Customer = {
  id: string
  name: string
  phone: string
  email: string
  type: string
  contactPerson: string
  city: string
  status: string
  createdAt: string
}

const fields: ModuleField<Customer>[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "email", label: "Email", type: "email" },
  {
    key: "type",
    label: "Type",
    type: "status",
    options: [
      { label: "XANAANO", value: "XANAANO" },
      { label: "SCHOOL", value: "SCHOOL" },
      { label: "INDIVIDUAL", value: "INDIVIDUAL" },
    ],
  },
  { key: "contactPerson", label: "Contact Person", type: "text" },
  { key: "city", label: "City", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "status",
    options: [
      { label: "ACTIVE", value: "ACTIVE" },
      { label: "INACTIVE", value: "INACTIVE" },
      { label: "SUSPENDED", value: "SUSPENDED" },
    ],
  },
  { key: "createdAt", label: "Created At", type: "date", create: false, edit: false },
]

export default function Page() {
  const [rows, setRows] = useState<Customer[]>([])

  useEffect(() => {
    const load = async () => {
      const customers = await getCustomers()
      setRows(
        customers.map((customer) => ({
          id: customer.id,
          name: customer.name,
          phone: customer.phone ?? "",
          email: customer.email ?? "",
          type: customer.type,
          contactPerson: customer.contactPerson ?? "",
          city: customer.city ?? "",
          status: customer.status,
          createdAt: customer.createdAt.slice(0, 10),
        }))
      )
    }

    load().catch(() => {
      setRows([])
    })
  }, [])

  const handlers = useMemo(
    () => ({
      onCreate: async (draft: Customer) => {
        const created = await createCustomer({
          name: draft.name,
          phone: draft.phone,
          email: draft.email,
          type: draft.type,
          contactPerson: draft.contactPerson,
          city: draft.city,
          status: draft.status || "ACTIVE",
        })

        return {
          id: created.id,
          name: created.name,
          phone: created.phone ?? "",
          email: created.email ?? "",
          type: created.type,
          contactPerson: created.contactPerson ?? "",
          city: created.city ?? "",
          status: created.status,
          createdAt: created.createdAt.slice(0, 10),
        }
      },
      onUpdate: async (draft: Customer) => {
        const updated = await updateCustomer(draft.id, {
          name: draft.name,
          phone: draft.phone,
          email: draft.email,
          type: draft.type,
          contactPerson: draft.contactPerson,
          city: draft.city,
          status: draft.status,
        })

        return {
          id: updated.id,
          name: updated.name,
          phone: updated.phone ?? "",
          email: updated.email ?? "",
          type: updated.type,
          contactPerson: updated.contactPerson ?? "",
          city: updated.city ?? "",
          status: updated.status,
          createdAt: updated.createdAt.slice(0, 10),
        }
      },
      onDelete: async (row: Customer) => {
        await deleteCustomer(row.id)
      },
    }),
    []
  )

  return (
    <ModuleTable
      title="Customers"
      description="Manage customer records from the live PostgreSQL database."
      fields={fields}
      initialData={rows}
      searchKeys={["name", "email"]}
      onCreate={handlers.onCreate}
      onUpdate={handlers.onUpdate}
      onDelete={handlers.onDelete}
    />
  )
}
