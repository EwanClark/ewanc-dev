import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  
  if (code) {
    const cookieStore = await cookies()
    const response = NextResponse.redirect(requestUrl.origin)
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return Array.from(cookieStore.getAll()).map(cookie => ({
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
    
    await supabase.auth.exchangeCodeForSession(code)
    
    return response
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
