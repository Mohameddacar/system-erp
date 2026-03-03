"use client"

import * as React from "react"
import Image from "next/image"
import {
  IconDashboard,
  IconPackage,
  IconReceipt,
  IconTruck,
  IconUser,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  getRoleRedirectPath,
  getUserRole,
  getUsername,
  type UserRole,
  logout,
}
from "@/lib/auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NAV_ITEMS = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
    roles: ["ADMIN", "FINANCE", "OPERATION", "USER"] as UserRole[],
  },
  {
    title: "Users",
    url: "/users",
    icon: IconUser,
    roles: ["ADMIN"] as UserRole[],
  },
  {
    title: "Customers",
    url: "/customers",
    icon: IconUsers,
    roles: ["ADMIN", "FINANCE", "OPERATION"] as UserRole[],
  },
  {
    title: "Employees",
    url: "/employees",
    icon: IconUser,
    roles: ["ADMIN"] as UserRole[],
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: IconPackage,
    roles: ["ADMIN", "OPERATION"] as UserRole[],
    items: [
      { title: "Warehouses", url: "/inventory/warehouses" },
      { title: "Products", url: "/inventory/products" },
      { title: "Stock", url: "/inventory/stock" },
      { title: "Movements", url: "/inventory/movements" },
      { title: "Sales Orders", url: "/inventory/sales-orders" },
    ],
  },
  {
    title: "Finance",
    url: "/finance",
    icon: IconReceipt,
    roles: ["ADMIN", "FINANCE"] as UserRole[],
  },
  {
    title: "Operations",
    url: "/operations",
    icon: IconTruck,
    roles: ["ADMIN", "OPERATION"] as UserRole[],
  },
]

function getNavByRole(role: UserRole) {
  return NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => ({
    title: item.title,
    url: item.url,
    icon: item.icon,
    ...(item.items ? { items: item.items } : {}),
  }))
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = React.useState<UserRole>("USER")
  const [username, setUsername] = React.useState("User")

  React.useEffect(() => {
    const storedRole = getUserRole() ?? "USER"
    const storedUsername = getUsername() ?? "User"
    setRole(storedRole)
    setUsername(storedUsername)
  }, [])

  const navMain = React.useMemo(() => getNavByRole(role), [role])

  const user = React.useMemo(
    () => ({
      name: username,
      email: `${role.toLowerCase()}@brightmts.local`,
      avatar: "/avatars/shadcn.jpg",
    }),
    [role, username],
  )

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 group-data-[collapsible=icon]:size-11 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:bg-primary group-data-[collapsible=icon]:text-primary-foreground"
            >
              <a href="#">
                <Image
                  src="/logo.png"
                  alt="Bright MTS"
                  width={20}
                  height={20}
                  className="size-5"
                />
                <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">
                  Bright MTS
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={user}
          onLogout={() => {
            logout()
            window.location.href = "/signin"
          }}
          homePath={getRoleRedirectPath(role)}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
