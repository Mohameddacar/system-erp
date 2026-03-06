"use client"

import { FormEvent, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setPassword } from "@/lib/api"

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams])

  const [password, setPasswordValue] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!token) {
      setError("Missing token")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await setPassword(token, password)
      setMessage(res.message || "Password set successfully. Redirecting to sign in...")
      setTimeout(() => router.replace("/signin"), 1200)
    } catch (e2: unknown) {
      setError(e2 instanceof Error ? e2.message : "Unable to set password")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-muted/30 flex min-h-svh items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl overflow-hidden rounded-3xl py-0 shadow-xl">
        <CardContent className="p-8">
          <div className="space-y-2">
            <div className="text-2xl font-semibold tracking-tight">Set password</div>
            <div className="text-muted-foreground text-sm">
              Create your password to activate your account.
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPasswordValue(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-green-700">{message}</p> : null}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Set password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
