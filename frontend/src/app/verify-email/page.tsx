import { Suspense } from "react"
import { VerifyEmailClient } from "./VerifyEmailClient"

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-svh items-center justify-center">Loading...</div>}>
      <VerifyEmailClient />
    </Suspense>
  )
}
