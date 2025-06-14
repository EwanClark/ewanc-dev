# Authentication Setup Guide

This project uses Supabase for authentication. Follow these steps to set up authentication in your project:

## 1. Create a Supabase Account and Project

1. Go to [Supabase](https://supabase.com/) and sign up for an account if you don't already have one
2. Create a new project in Supabase
3. Note your project URL and anon key from the API settings

## 2. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Fill in your Supabase project URL and anon key in the `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

## 3. Set Up Database Tables

1. Go to the SQL editor in your Supabase dashboard
2. Execute the SQL from `scripts/setup-auth-tables.sql` to create necessary tables and set up row-level security

## 4. Configure OAuth Providers

### GitHub Authentication
1. Go to GitHub Developer Settings: https://github.com/settings/developers
2. Create a new OAuth App
3. Set the authorization callback URL to: `https://your-supabase-project-ref.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret
5. In Supabase Authentication settings, enable GitHub provider and paste your Client ID and Client Secret

### Google Authentication
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or use an existing one
3. Go to "APIs & Services" > "Credentials"
4. Create an OAuth 2.0 Client ID
5. Set the authorized redirect URI to: `https://your-supabase-project-ref.supabase.co/auth/v1/callback`
6. Copy the Client ID and Client Secret
7. In Supabase Authentication settings, enable Google provider and paste your Client ID and Client Secret

## 5. Enable Email Auth in Supabase

1. Go to Authentication > Providers in your Supabase dashboard
2. Ensure Email provider is enabled
3. Configure settings as needed (confirm emails, etc.)

## 6. Test Your Authentication

Once everything is set up, test your authentication by:
1. Creating a new account with email/password
2. Signing in with GitHub
3. Signing in with Google
4. Testing protected routes

## Additional Information

- Supabase automatically handles JWT tokens for authentication
- The auth flow is managed through the NextJS middleware and auth helpers
- User profiles are stored in the `profiles` table
- For more information, refer to the [Supabase Auth documentation](https://supabase.com/docs/guides/auth)
