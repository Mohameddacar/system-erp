"use client"

import { useEffect, useMemo, useState } from "react"
import { ModuleTable, type ModuleField } from "@/components/module-table"
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "@/lib/api"

type UserRow = {
  id: string
  username: string
  password?: string
  role: string
  createdAt: string
}

const fields: ModuleField<UserRow>[] = [
  { key: "username", label: "Username", type: "text" },
  { key: "password", label: "Password", type: "text", table: false },
  {
    key: "role",
    label: "Role",
    type: "status",
    options: [
      { label: "ADMIN", value: "ADMIN" },
      { label: "FINANCE", value: "FINANCE" },
      { label: "OPERATION", value: "OPERATION" },
      { label: "USER", value: "USER" },
    ],
  },
  { key: "createdAt", label: "Created At", type: "date", create: false, edit: false },
]

export default function Page() {
  const [rows, setRows] = useState<UserRow[]>([])

  useEffect(() => {
    const load = async () => {
      const users = await getUsers()
      setRows(
        users.map((user) => ({
          id: String(user.id),
          username: user.username,
          role: user.role,
          createdAt: user.createdAt.slice(0, 10),
        }))
      )
    }

    load().catch(() => {
      setRows([])
    })
  }, [])

  const handlers = useMemo(
    () => ({
      onCreate: async (draft: UserRow) => {
        const created = await createUser({
          username: draft.username,
          password: draft.password || "User@123",
          role: draft.role,
        })

        return {
          id: String(created.id),
          username: created.username,
          role: created.role,
          createdAt: created.createdAt.slice(0, 10),
        }
      },
      onUpdate: async (draft: UserRow) => {
        const updated = await updateUser(Number(draft.id), {
          username: draft.username,
          role: draft.role,
          ...(draft.password ? { password: draft.password } : {}),
        })

        return {
          id: String(updated.id),
          username: updated.username,
          role: updated.role,
          createdAt: updated.createdAt.slice(0, 10),
        }
      },
      onDelete: async (row: UserRow) => {
        await deleteUser(Number(row.id))
      },
    }),
    []
  )

  return (
    <ModuleTable
      title="Users"
      description="Manage system users, roles, and access status."
      fields={fields}
      initialData={rows}
      searchKeys={["username", "role"]}
      onCreate={handlers.onCreate}
      onUpdate={handlers.onUpdate}
      onDelete={handlers.onDelete}
    />
  )
}
