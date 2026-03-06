"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { Card, CardContent } from "@/components/ui/card"
import { verifyEmail } from "@/lib/api"

export default function Page() {
  const searchParams = useSearchParams()
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams])

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    token ? "loading" : "error"
  )
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setMessage("Missing token")
      setStatus("error")
      return
    }

    let cancelled = false
    verifyEmail(token)
      .then((res) => {
        if (cancelled) return
        setMessage(res.message || "Email verified. Check your email to set your password.")
        setStatus("success")
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setMessage(e instanceof Error ? e.message : "Verification failed")
        setStatus("error")
      })

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <div className="bg-muted/30 flex min-h-svh items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl overflow-hidden rounded-3xl py-0 shadow-xl">
        <CardContent className="p-8">
          <div className="space-y-2">
            <div className="text-2xl font-semibold tracking-tight">Verify email</div>
            <div className="text-muted-foreground text-sm">
              {status === "loading"
                ? "Verifying your email..."
                : status === "success"
                  ? "Verification complete."
                  : "Verification failed."}
            </div>
          </div>

          <div className="mt-6 rounded-xl border p-4 text-sm">
            {message || ""}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
