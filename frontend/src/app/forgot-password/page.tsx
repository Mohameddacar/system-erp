"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPassword } from "@/lib/api"

export default function Page() {
  const [identifier, setIdentifier] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!identifier.trim()) {
      setError("Email is required")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await forgotPassword(identifier.trim())
      setMessage(res.message || "If the account exists, reset link will be sent")
    } catch (e2: unknown) {
      setError(e2 instanceof Error ? e2.message : "Unable to send reset link")
    } finally {
      setIsSubmitting(false)
    }
  }

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
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-green-700">{message}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send reset link"}
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
