import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"
import { startsWithReservedRoute } from "@/lib/route-utils"

export async function middleware(req: NextRequest) {
  // Skip middleware for short URL redirects to prevent redirect loops
  // Check if it's a short URL (single path segment, not starting with known routes)
  const pathname = req.nextUrl.pathname
  const isShortUrl = pathname.match(/^\/[a-zA-Z0-9]{6,8}$/) && 
    !startsWithReservedRoute(pathname)

  if (isShortUrl) {
    return NextResponse.next()
  }

  // Updates the session if needed and returns the updated response + user
  // This avoids a duplicate getUser() call - single auth round-trip
  const { response, user } = await updateSession(req)

  // If the user is not signed in and the route is protected, redirect to login
  const protectedRoutes = ["/dashboard", "/profile"]
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  if (!user && isProtectedRoute) {
    const redirectUrl = new URL("/login", req.url)
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
