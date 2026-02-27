"use client"

import { useEffect, useMemo, useState } from "react"
import { ModuleTable, type ModuleField } from "@/components/module-table"
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "@/lib/api"

type Employee = {
  id: string
  fullName: string
  gender: string
  email: string
  phone: string
  salary: number
  hireDate: string
  jobTitle: string
  employmentType: string
  status: string
  departmentName: string
}

const fields: ModuleField<Employee>[] = [
  { key: "fullName", label: "Full Name", type: "text" },
  {
    key: "gender",
    label: "Gender",
    type: "status",
    options: [
      { label: "MALE", value: "MALE" },
      { label: "FEMALE", value: "FEMALE" },
    ],
  },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone", type: "text" },
  { key: "salary", label: "Salary", type: "number" },
  { key: "hireDate", label: "Hire Date", type: "date" },
  { key: "jobTitle", label: "Job Title", type: "text" },
  {
    key: "employmentType",
    label: "Employment Type",
    type: "status",
    options: [
      { label: "FULL_TIME", value: "FULL_TIME" },
      { label: "PART_TIME", value: "PART_TIME" },
      { label: "CONTRACT", value: "CONTRACT" },
    ],
  },
  {
    key: "departmentName",
    label: "Department",
    type: "text",
  },
  {
    key: "status",
    label: "Status",
    type: "status",
    options: [
      { label: "ACTIVE", value: "ACTIVE" },
      { label: "INACTIVE", value: "INACTIVE" },
      { label: "TERMINATED", value: "TERMINATED" },
    ],
  },
]

export default function Page() {
  const [rows, setRows] = useState<Employee[]>([])

  useEffect(() => {
    const load = async () => {
      const employees = await getEmployees()
      setRows(
        employees.map((employee) => ({
          id: employee.id,
          fullName: employee.fullName,
          gender: employee.gender,
          email: employee.email ?? "",
          phone: employee.phone ?? "",
          salary: employee.salary ?? 0,
          hireDate: employee.hireDate.slice(0, 10),
          jobTitle: employee.jobTitle,
          employmentType: employee.employmentType,
          status: employee.status,
          departmentName: employee.departmentName,
        }))
      )
    }

    load().catch(() => {
      setRows([])
    })
  }, [])

  const handlers = useMemo(
    () => ({
      onCreate: async (draft: Employee) => {
        const created = await createEmployee({
          fullName: draft.fullName,
          gender: draft.gender,
          email: draft.email,
          phone: draft.phone,
          salary: draft.salary,
          hireDate: draft.hireDate,
          jobTitle: draft.jobTitle,
          employmentType: draft.employmentType,
          status: draft.status || "ACTIVE",
          departmentName: draft.departmentName,
        })

        return {
          id: created.id,
          fullName: created.fullName,
          gender: created.gender,
          email: created.email ?? "",
          phone: created.phone ?? "",
          salary: created.salary ?? 0,
          hireDate: created.hireDate.slice(0, 10),
          jobTitle: created.jobTitle,
          employmentType: created.employmentType,
          status: created.status,
          departmentName: created.departmentName,
        }
      },
      onUpdate: async (draft: Employee) => {
        const updated = await updateEmployee(draft.id, {
          fullName: draft.fullName,
          gender: draft.gender,
          email: draft.email,
          phone: draft.phone,
          salary: draft.salary,
          hireDate: draft.hireDate,
          jobTitle: draft.jobTitle,
          employmentType: draft.employmentType,
          status: draft.status,
          departmentName: draft.departmentName,
        })

        return {
          id: updated.id,
          fullName: updated.fullName,
          gender: updated.gender,
          email: updated.email ?? "",
          phone: updated.phone ?? "",
          salary: updated.salary ?? 0,
          hireDate: updated.hireDate.slice(0, 10),
          jobTitle: updated.jobTitle,
          employmentType: updated.employmentType,
          status: updated.status,
          departmentName: updated.departmentName,
        }
      },
      onDelete: async (row: Employee) => {
        await deleteEmployee(row.id)
      },
    }),
    []
  )

  return (
    <ModuleTable
      title="Employees"
      description="Manage employees from the live PostgreSQL database."
      fields={fields}
      initialData={rows}
      searchKeys={["fullName", "jobTitle", "departmentName"]}
      onCreate={handlers.onCreate}
      onUpdate={handlers.onUpdate}
      onDelete={handlers.onDelete}
    />
  )
}
