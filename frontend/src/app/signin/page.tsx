"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getRoleRedirectPath,
  ROLE_OPTIONS,
  getToken,
  getUserRole,
  loginUser,
  logout,
  type UserRole,
} from "@/lib/auth"

export default function Page() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("USER")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const token = getToken()
    const role = getUserRole()

    if (token && role) {
      router.replace(getRoleRedirectPath(role))
    }
  }, [router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await loginUser({ username, password })

      if (response.user.role !== selectedRole) {
        logout()
        setError("Role does not match this account. Please choose the correct role.")
        return
      }

      router.replace(getRoleRedirectPath(response.user.role))
    } catch (submitError) {
      if (submitError instanceof Error) {
        setError(submitError.message)
      } else {
        setError("Login failed. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-muted/30 flex min-h-svh items-center justify-center px-4 py-10">
      <Card className="w-full max-w-[980px] overflow-hidden rounded-3xl py-0 shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-[420px_1fr]">
          <div className="bg-primary text-primary-foreground relative hidden md:flex">
            <div className="absolute left-0 top-0 h-14 w-14 rounded-br-3xl bg-white/10" />
            <div className="absolute bottom-0 right-0 h-14 w-14 rounded-tl-3xl bg-white/10" />

            <div className="flex w-full flex-col justify-between p-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/15 ring-white/15 flex size-10 items-center justify-center rounded-2xl ring-1">
                  <Image src="/logo.png" alt="Bright MTS" width={18} height={18} />
                </div>
                <div className="text-sm font-semibold tracking-tight">
                  Bright MTS
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-2xl font-semibold">Welcome back</div>
                <div className="text-white/80 text-sm">
                  Sign in to continue to your Bright MTS dashboard.
                </div>
              </div>

              <div className="text-white/70 text-xs">
                Secure access powered by Bright Multiservices & Tech Solutions.
              </div>
            </div>
          </div>

          <div className="flex items-center p-6 md:p-10">
            <div className="w-full max-w-md">
              <div className="space-y-2">
                <div className="text-3xl font-semibold tracking-tight">
                  Sign in
                </div>
                <div className="text-muted-foreground text-sm">
                  Enter your username and password.
                </div>
              </div>

              <form
                className="mt-6 space-y-4"
                onSubmit={handleSubmit}
              >
                <div className="space-y-2">
                  <Label htmlFor="username">User name</Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="admin"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    name="role"
                    value={selectedRole}
                    onChange={(event) => setSelectedRole(event.target.value as UserRole)}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    required
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {error ? (
                  <p className="text-sm text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>

                <div className="text-muted-foreground text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-foreground hover:underline"
                  >
                    Register now
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
