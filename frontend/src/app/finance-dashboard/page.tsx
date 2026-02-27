"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { getRouteGuardRedirect } from "@/lib/auth"

export default function FinanceDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const redirectTo = getRouteGuardRedirect(["FINANCE"])
    if (redirectTo) {
      router.replace(redirectTo)
    }
  }, [router])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Finance Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Finance users can access Dashboard, Finance, and Customers only.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">128</p>
            <p className="text-muted-foreground text-sm">Across current period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">14</p>
            <p className="text-muted-foreground text-sm">Need follow-up</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$24,500</p>
            <p className="text-muted-foreground text-sm">Current month snapshot</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Finance Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>- Review invoices and expenses</p>
            <p>- Track paid, pending, and overdue records</p>
            <p>- Monitor cash collection trends</p>
            <Button asChild className="mt-3">
              <Link href="/finance">Open Finance Module</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>- View customer profiles and contact details</p>
            <p>- Check customer payment-related context</p>
            <p>- Follow up on overdue accounts</p>
            <Button asChild variant="outline" className="mt-3">
              <Link href="/customers">Open Customers Module</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
