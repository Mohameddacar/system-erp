"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { canAccessPath, getToken, getUserRole } from "@/lib/auth"

const AUTH_PREFIXES = ["/signin", "/signup", "/forgot-password"]
const PUBLIC_PREFIXES = ["/unauthorized", "/login", "/verify-email", "/set-password"]

export function ShellGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = React.useState(false)

  const isAuthRoute = React.useMemo(() => {
    if (!pathname) return false
    return AUTH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  }, [pathname])

  const isPublicRoute = React.useMemo(() => {
    if (!pathname) return false
    return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  }, [pathname])

  React.useEffect(() => {
    if (!pathname) return

    if (isAuthRoute || isPublicRoute) {
      setReady(true)
      return
    }

    const token = getToken()
    if (!token) {
      router.replace("/login")
      return
    }

    const role = getUserRole()
    if (!role || !canAccessPath(role, pathname)) {
      router.replace("/unauthorized")
      return
    }

    setReady(true)
  }, [isAuthRoute, isPublicRoute, pathname, router])

  if (isAuthRoute) return <>{children}</>

  if (isPublicRoute) return <>{children}</>

  if (!ready) return null

  return <AppShell>{children}</AppShell>
}
