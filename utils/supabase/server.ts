import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient<Database>(
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
        setAll(newCookies) {
          try {
            newCookies.forEach(cookie => {
              cookieStore.set(cookie)
            })
          } catch (error) {
            // Ignore as this is likely a Server Component context
            // Middleware will handle refreshing
          }
        }
      },
    }
  )
}
