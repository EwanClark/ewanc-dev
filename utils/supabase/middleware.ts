import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'

export interface SessionResult {
  response: NextResponse
  user: User | null
}

export async function updateSession(request: NextRequest): Promise<SessionResult> {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Array.from(request.cookies.getAll()).map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll(cookies) {
          // Create a single new response to hold all cookies
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          
          cookies.forEach(cookie => {
            // Update the request cookies
            request.cookies.set({
              name: cookie.name,
              value: cookie.value,
              ...cookie.options,
            })
            
            // Update the response cookies (on the same response object)
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

  // This will refresh session if expired - required for Server Components
  // Return the user so callers don't need to make a duplicate auth call
  const { data: { user } } = await supabase.auth.getUser()

  return { response, user }
}
