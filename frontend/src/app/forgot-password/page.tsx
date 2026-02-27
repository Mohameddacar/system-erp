"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Page() {
  return (
    <div className="bg-muted/30 flex min-h-svh items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl overflow-hidden rounded-3xl py-0 shadow-xl">
        <CardContent className="p-6 md:p-10">
          <div className="space-y-2">
            <div className="text-2xl font-semibold tracking-tight">
              Reset password
            </div>
            <div className="text-muted-foreground text-sm">
              Enter your account email and we&apos;ll send reset instructions.
            </div>
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Send reset link
            </Button>

            <div className="text-muted-foreground text-center text-sm">
              <Link href="/signin" className="text-foreground hover:underline">
                Back to sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
