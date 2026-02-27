"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getRouteGuardRedirect } from "@/lib/auth"

export default function OperationDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const redirectTo = getRouteGuardRedirect(["OPERATION"])
    if (redirectTo) {
      router.replace(redirectTo)
    }
  }, [router])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Operation Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Operation users can access Dashboard, Operations, Inventory, and Customers.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Open Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">22</p>
            <p className="text-muted-foreground text-sm">Active operational tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Dispatches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">7</p>
            <p className="text-muted-foreground text-sm">Awaiting shipment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5</p>
            <p className="text-muted-foreground text-sm">Items below threshold</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Operations Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>- Track daily operation tasks and status</p>
            <p>- Monitor dispatches and workflow progress</p>
            <p>- Coordinate execution with field teams</p>
            <Button asChild className="mt-3">
              <Link href="/operations">Open Operations Module</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory & Customers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>- Track stock movement and restocking needs</p>
            <p>- View customer requests tied to operations</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild variant="outline">
                <Link href="/inventory">Open Inventory</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/customers">Open Customers</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
