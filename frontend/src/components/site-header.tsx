"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  BellIcon,
  LogOutIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getRoleRedirectPath, getUserRole, getUsername, logout, type UserRole } from "@/lib/auth"

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [role, setRole] = React.useState<UserRole>("USER")
  const [username, setUsername] = React.useState("User")

  React.useEffect(() => {
    setMounted(true)
    setRole(getUserRole() ?? "USER")
    setUsername(getUsername() ?? "User")
  }, [])

  const title =
    pathname === "/dashboard"
      ? "Dashboard"
      : pathname.startsWith("/admin-dashboard")
        ? "Admin Dashboard"
        : pathname.startsWith("/finance-dashboard")
          ? "Finance Dashboard"
          : pathname.startsWith("/operation-dashboard")
            ? "Operation Dashboard"
          : pathname.startsWith("/users")
            ? "Users"
      : pathname.startsWith("/customers")
        ? "Customers"
        : pathname.startsWith("/employees")
          ? "Employees"
          : pathname.startsWith("/inventory")
            ? "Inventory"
            : pathname.startsWith("/finance")
              ? "Finance"
              : pathname.startsWith("/operations")
                ? "Operations"
                : "Dashboard"

  const homePath = getRoleRedirectPath(role)

  const breadcrumbs = [
    { label: "Home", href: homePath },
    { label: title, href: pathname === "/" ? homePath : pathname },
  ]

  return (
    <header className="bg-background/70 supports-[backdrop-filter]:bg-background/50 sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b/60 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-3 lg:gap-3 lg:px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-1 hidden data-[orientation=vertical]:h-5 sm:block"
        />

        <div className="hidden min-w-0 flex-col sm:flex">
          <div className="text-foreground text-base font-semibold leading-none">
            {title}
          </div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={breadcrumbs[0].href}>{breadcrumbs[0].label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumbs[1].label}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="relative mx-2 hidden flex-1 items-center md:flex">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute left-3 size-4" />
          <Input
            placeholder="Search here..."
            className="bg-secondary/40 hover:bg-secondary/60 focus-visible:bg-background h-9 max-w-[420px] rounded-full pl-9 pr-3"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
            type="button"
          >
            <BellIcon />
            <span className="bg-red-500 text-white absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums">
              3
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            type="button"
            onClick={() => {
              const next = theme === "dark" ? "light" : "dark"
              setTheme(next)
            }}
          >
            {mounted && theme === "dark" ? <MoonIcon /> : <SunIcon />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Account"
                type="button"
              >
                <UserIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="space-y-0.5">
                <div className="text-sm font-semibold">{username}</div>
                <div className="text-muted-foreground text-xs">
                  {role}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout()
                  router.push("/signin")
                }}
              >
                <LogOutIcon />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
