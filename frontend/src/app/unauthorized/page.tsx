import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">Unauthorized</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          You do not have permission to access this page.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/signin">Back to sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
