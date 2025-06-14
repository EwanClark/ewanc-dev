import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient as createBrowserClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import type { SupabaseClient } from "@supabase/supabase-js"

// Singleton for Supabase client
let supabaseClient: SupabaseClient<Database> | null = null

// Create a single supabase client for the entire client-side application
export const createClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient<Database>()
  }
  return supabaseClient
}

// For direct client use without Next.js context
export const createBrowserSupabaseClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
