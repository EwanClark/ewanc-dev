import { User } from '@supabase/auth-helpers-nextjs'

// Extend the User type from Supabase to include identities
declare module '@supabase/auth-helpers-nextjs' {
  interface User {
    identities?: {
      id: string;
      provider: string;
      identity_data?: Record<string, any>;
      user_id: string;
    }[];
  }
}

// Extend the User type from Supabase JS as well
declare module '@supabase/supabase-js' {
  interface User {
    identities?: {
      id: string;
      provider: string;
      identity_data?: Record<string, any>;
      user_id: string;
    }[];
  }
}
