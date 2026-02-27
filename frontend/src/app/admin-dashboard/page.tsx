"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { getRouteGuardRedirect } from "@/lib/auth"

export default function AdminDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const redirectTo = getRouteGuardRedirect(["ADMIN"])
    if (redirectTo) {
      router.replace(redirectTo)
    }
  }, [router])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        This page is restricted to ADMIN users.
      </p>
    </div>
  )
}
