"use client"

import { useMemo, useState } from "react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { getUserRole, type UserRole } from "@/lib/auth"

import data from "./data.json"

export default function Page() {
  const [role] = useState<UserRole>(() => {
    if (typeof window === "undefined") {
      return "USER"
    }

    return getUserRole() ?? "USER"
  })

  const message = useMemo(() => {
    if (role === "ADMIN") {
      return "You can view all modules and system-level summaries."
    }

    if (role === "FINANCE") {
      return "You can view finance and customer-related information."
    }

    if (role === "OPERATION") {
      return "You can view operations, inventory, and customer workflows."
    }

    return "You can view your user dashboard overview."
  }, [role])

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <p className="text-muted-foreground text-sm">Role: {role}</p>
          <p className="text-sm">{message}</p>
        </div>

        {role === "ADMIN" ? <SectionCards /> : null}

        {role === "ADMIN" || role === "OPERATION" ? (
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
        ) : null}

        {role === "ADMIN" || role === "FINANCE" ? (
          <DataTable data={data} />
        ) : null}

        {role === "USER" ? (
          <div className="px-4 lg:px-6">
            <div className="rounded-lg border p-4 text-sm">
              Welcome to your dashboard. Contact your administrator if you need access to more modules.
            </div>
          </div>
        ) : null}

        {role === "OPERATION" ? (
          <div className="px-4 lg:px-6">
            <div className="rounded-lg border p-4 text-sm">
              Operation highlights are available in Operations and Inventory sections.
            </div>
          </div>
        ) : null}

        {role === "FINANCE" ? (
          <div className="px-4 lg:px-6">
            <div className="rounded-lg border p-4 text-sm">
              Finance summaries and transaction tools are available in the Finance section.
            </div>
          </div>
        ) : null}

        {role === "ADMIN" ? (
          <div className="px-4 lg:px-6">
            <div className="rounded-lg border p-4 text-sm">
              Full administrative visibility is enabled for this account.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
