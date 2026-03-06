import { Suspense } from "react"
import { SetPasswordForm } from "./SetPasswordForm"

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-svh items-center justify-center">Loading...</div>}>
      <SetPasswordForm />
    </Suspense>
  )
}
