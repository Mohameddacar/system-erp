"use client"

import { useEffect, useMemo, useState } from "react"
import { ModuleTable, type ModuleField } from "@/components/module-table"
import { createUser, deleteUser, getUsers, updateUser } from "@/lib/api"

type UserRow = {
  id: string
  fullName: string
  username: string
  email: string
  role: string
  status: string
  emailVerified: string
  locked: string
  createdAt: string
  updatedAt: string
}

const fields: ModuleField<UserRow>[] = [
  { key: "fullName", label: "Full Name", type: "text" },
  { key: "username", label: "Username", type: "text" },
  { key: "email", label: "Email", type: "email", edit: false },
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
  {
    key: "status",
    label: "Status",
    type: "status",
    options: [
      { label: "PENDING_VERIFICATION", value: "PENDING_VERIFICATION" },
      { label: "ACTIVE", value: "ACTIVE" },
      { label: "DISABLED", value: "DISABLED" },
    ],
    create: false,
  },
  {
    key: "emailVerified",
    label: "Email Verified",
    type: "select",
    options: [
      { label: "Verified", value: "true" },
      { label: "Not verified", value: "false" },
    ],
    create: false,
    edit: false,
  },
  {
    key: "locked",
    label: "Locked",
    type: "select",
    options: [
      { label: "Locked", value: "true" },
      { label: "Unlocked", value: "false" },
    ],
    create: false,
  },
  {
    key: "createdAt",
    label: "Created At",
    type: "date",
    create: false,
    edit: false,
  },
  {
    key: "updatedAt",
    label: "Updated At",
    type: "date",
    create: false,
    edit: false,
  },
]

export default function Page() {
  const [rows, setRows] = useState<UserRow[]>([])

  const validateUserDraft = (draft: UserRow) => {
    const fullName = draft.fullName.trim()
    const username = draft.username.trim()
    const email = draft.email.trim()

    if (!fullName) throw new Error("Full name is required")
    if (fullName.length < 3 || fullName.length > 60)
      throw new Error("Full name must be between 3 and 60 characters")
    if (!/^[A-Za-z ]+$/.test(fullName))
      throw new Error("Full name can only contain letters and spaces")

    if (!username) throw new Error("Username is required")
    if (!/^[A-Za-z]{3,20}$/.test(username))
      throw new Error("Username must be 3-20 letters only (no numbers or symbols)")

    if (!email) throw new Error("Email is required")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new Error("Email is not valid")
  }

  useEffect(() => {
    const load = async () => {
      const users = await getUsers()
      setRows(
        users.map((user) => ({
          id: String(user.id),
          fullName: user.fullName ?? "",
          username: user.username ?? "",
          email: user.email,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified ? "true" : "false",
          locked: user.locked ? "true" : "false",
          createdAt: user.createdAt.slice(0, 10),
          updatedAt: user.updatedAt.slice(0, 10),
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
        validateUserDraft(draft)
        const created = await createUser({
          email: draft.email,
          role: draft.role,
          fullName: draft.fullName,
          username: draft.username,
        })

        return {
          id: String(created.id),
          fullName: created.fullName ?? "",
          username: created.username ?? "",
          email: created.email,
          role: created.role,
          status: created.status,
          emailVerified: created.emailVerified ? "true" : "false",
          locked: created.locked ? "true" : "false",
          createdAt: created.createdAt.slice(0, 10),
          updatedAt: created.updatedAt.slice(0, 10),
        }
      },
      onUpdate: async (draft: UserRow) => {
        validateUserDraft(draft)
        const updated = await updateUser(draft.id, {
          role: draft.role,
          status: draft.status,
          locked: draft.locked === "true",
          fullName: draft.fullName,
          username: draft.username,
        })

        return {
          id: String(updated.id),
          fullName: updated.fullName ?? "",
          username: updated.username ?? "",
          email: updated.email,
          role: updated.role,
          status: updated.status,
          emailVerified: updated.emailVerified ? "true" : "false",
          locked: updated.locked ? "true" : "false",
          createdAt: updated.createdAt.slice(0, 10),
          updatedAt: updated.updatedAt.slice(0, 10),
        }
      },
      onDelete: async (row: UserRow) => {
        await deleteUser(row.id)
      },
    }),
    []
  )

  return (
    <ModuleTable
      title="Users"
      description="Provision users (email + role). Users must verify email and set a password before they can sign in."
      fields={fields}
      initialData={rows}
      searchKeys={["email", "role", "status"]}
      onCreate={handlers.onCreate}
      onUpdate={handlers.onUpdate}
      onDelete={handlers.onDelete}
    />
  )
}
