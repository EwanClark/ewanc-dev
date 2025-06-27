import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  // Skip middleware for short URL redirects to prevent redirect loops
  // Check if it's a short URL (single path segment, not starting with known routes)
  const pathname = req.nextUrl.pathname
  const isShortUrl = pathname.match(/^\/[a-zA-Z0-9]{6,8}$/) && 
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/auth') &&
    !pathname.startsWith('/projects') &&
    !pathname.startsWith('/about') &&
    !pathname.startsWith('/contact') &&
    !pathname.startsWith('/experience') &&
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/signup') &&
    !pathname.startsWith('/profile') &&
    !pathname.startsWith('/reset-password') &&
    !pathname.startsWith('/forgot-password') &&
    !pathname.startsWith('/password-required') &&
    !pathname.startsWith('/signup-success')

  if (isShortUrl) {
    return NextResponse.next()
  }

  // Updates the session if needed and returns the updated response
  const response = await updateSession(req)

  // Get the session from the request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Array.from(req.cookies.getAll()).map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll(cookies) {
          cookies.forEach(cookie => {
            response.cookies.set({
              name: cookie.name,
              value: cookie.value,
              ...cookie.options,
            })
          })
        }
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

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
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
