"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Page() {
  const router = useRouter()

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
                <div className="text-2xl font-semibold">Create your account</div>
                <div className="text-white/80 text-sm">
                  Join the Bright MTS dashboard experience.
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
                  Create account
                </div>
                <div className="text-muted-foreground text-sm">
                  Accounts are provisioned by an administrator.
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <p className="text-muted-foreground text-sm">
                  Please contact your system administrator to create your account.
                  You will receive a verification email and then a password setup link.
                </p>

                <Button className="w-full" onClick={() => router.push("/signin")}>
                  Go to sign in
                </Button>

                <div className="text-muted-foreground text-center text-sm">
                  Need help? Contact your admin.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
