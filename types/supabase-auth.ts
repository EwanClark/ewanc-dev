import { User, UserIdentity } from '@supabase/supabase-js'

// No need to extend @supabase/auth-helpers-nextjs as we're not using it

// We don't need to extend the User type from Supabase JS
// because it already has the identities property with UserIdentity[] type
