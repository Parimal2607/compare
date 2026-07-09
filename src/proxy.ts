import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith("/admin")) return NextResponse.next()

  const authHeader = request.headers.get("authorization")
  const pw = process.env.ADMIN_PASSWORD || "admin"

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ")
    if (scheme === "Basic") {
      const decoded = atob(encoded)
      const [user, pass] = decoded.split(":")
      if (user === "admin" && pass === pw) return NextResponse.next()
    }
  }

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="CompareHub Admin"' },
  })
}

export const config = { matcher: "/admin/:path*" }
