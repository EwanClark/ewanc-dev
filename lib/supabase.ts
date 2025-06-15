// This file exists for backwards compatibility
// It re-exports the new client utilities from the utils/supabase directory
import { createClient as createBrowserClient } from "@/utils/supabase/client"
import { createClient as createServerClient } from "@/utils/supabase/server"
import type { Database } from "@/types/supabase"

// Create a client for client-side components (browser)
export const createClient = () => {
  return createBrowserClient()
}

// Create a supabase client for server components
export const createServerComponentClient = async () => {
  return await createServerClient()
}
