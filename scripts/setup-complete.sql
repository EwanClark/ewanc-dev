-- Complete System Setup Script
-- Run this in your Supabase SQL editor to set up the entire system
-- This script is idempotent - safe to run multiple times

-- =============================================================================
-- 1. USER PROFILES SETUP
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  avatar_source TEXT DEFAULT 'upload',
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;

-- Create policy for public profile access
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles 
  FOR SELECT 
  USING (true);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update their own profile." 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile." 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Trigger to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger to ensure it's current
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- =============================================================================
-- 2. SHORT URL SYSTEM SETUP
-- =============================================================================

-- Create short_urls table if it doesn't exist
CREATE TABLE IF NOT EXISTS short_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  short_code VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  total_clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0
);

-- Create short_url_analytics table if it doesn't exist
CREATE TABLE IF NOT EXISTS short_url_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_url_id UUID REFERENCES short_urls(id) ON DELETE CASCADE,
  ip_address INET NOT NULL,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Geolocation data
  country VARCHAR(100),
  region VARCHAR(100), 
  city VARCHAR(100),
  isp VARCHAR(200),
  
  -- Parsed user agent data
  device VARCHAR(50),
  browser VARCHAR(50),
  os VARCHAR(50),
  
  -- Authorization for password-protected URLs
  authorized BOOLEAN NULL
);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_short_urls_user_id ON short_urls(user_id);
CREATE INDEX IF NOT EXISTS idx_short_urls_short_code ON short_urls(short_code);
CREATE INDEX IF NOT EXISTS idx_short_urls_created_at ON short_urls(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_short_url_analytics_short_url_id ON short_url_analytics(short_url_id);
CREATE INDEX IF NOT EXISTS idx_short_url_analytics_timestamp ON short_url_analytics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_short_url_analytics_ip_address ON short_url_analytics(ip_address);

-- Enable Row Level Security (RLS)
ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE short_url_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public access to active short URLs for redirection" ON short_urls;
DROP POLICY IF EXISTS "Users can view their own short URLs" ON short_urls;
DROP POLICY IF EXISTS "Users can insert their own short URLs" ON short_urls;
DROP POLICY IF EXISTS "Users can update their own short URLs" ON short_urls;
DROP POLICY IF EXISTS "Users can delete their own short URLs" ON short_urls;

-- Create RLS policies for short_urls
-- Allow public access to active short URLs for redirection
CREATE POLICY "Public access to active short URLs for redirection" ON short_urls
  FOR SELECT USING (is_active = true);

-- Allow users to manage their own short URLs
CREATE POLICY "Users can view their own short URLs" ON short_urls
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own short URLs" ON short_urls
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own short URLs" ON short_urls
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own short URLs" ON short_urls
  FOR DELETE USING (auth.uid() = user_id);

-- Drop existing analytics policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view analytics for their URLs" ON short_url_analytics;
DROP POLICY IF EXISTS "Allow inserting analytics for any URL" ON short_url_analytics;
DROP POLICY IF EXISTS "Allow public analytics insertion" ON short_url_analytics;
DROP POLICY IF EXISTS "Allow service role analytics updates" ON short_url_analytics;

-- Create RLS policies for short_url_analytics
CREATE POLICY "Users can view analytics for their URLs" ON short_url_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM short_urls 
      WHERE short_urls.id = short_url_analytics.short_url_id 
      AND short_urls.user_id = auth.uid()
    )
  );

-- Allow public (anonymous) and authenticated users to insert analytics for click tracking
CREATE POLICY "Allow public analytics insertion" ON short_url_analytics
  FOR INSERT WITH CHECK (true);

-- Allow service role to update analytics data (for authorization updates)
CREATE POLICY "Allow service role analytics updates" ON short_url_analytics
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate trigger to ensure it's current
DROP TRIGGER IF EXISTS update_short_urls_updated_at ON short_urls;
CREATE TRIGGER update_short_urls_updated_at 
  BEFORE UPDATE ON short_urls 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to update click counts
CREATE OR REPLACE FUNCTION update_click_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total clicks
    UPDATE short_urls 
    SET total_clicks = total_clicks + 1
    WHERE id = NEW.short_url_id;
    
    -- Update unique clicks (if this IP hasn't clicked before)
    IF NOT EXISTS (
        SELECT 1 FROM short_url_analytics 
        WHERE short_url_id = NEW.short_url_id 
        AND ip_address = NEW.ip_address 
        AND id != NEW.id
    ) THEN
        UPDATE short_urls 
        SET unique_clicks = unique_clicks + 1
        WHERE id = NEW.short_url_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate trigger to ensure it's current
DROP TRIGGER IF EXISTS update_click_counts_trigger ON short_url_analytics;
CREATE TRIGGER update_click_counts_trigger
  AFTER INSERT ON short_url_analytics
  FOR EACH ROW EXECUTE FUNCTION update_click_counts(); 

-- Enable realtime for real-time dashboard and analytics updates
-- Note: These commands are safe to run multiple times
DO $$
BEGIN
    -- Add short_urls to realtime publication if not already added
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'short_urls'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE short_urls;
    END IF;
    
    -- Add short_url_analytics to realtime publication if not already added
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'short_url_analytics'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE short_url_analytics;
    END IF;
END $$;

-- Set replica identity for realtime (required for updates/deletes)
ALTER TABLE short_urls REPLICA IDENTITY FULL;
ALTER TABLE short_url_analytics REPLICA IDENTITY FULL;

-- =============================================================================
-- 3. AVATAR STORAGE SETUP
-- =============================================================================

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can upload an avatar." ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar." ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar." ON storage.objects;

-- Set up Row Level Security (RLS) policies for avatars bucket
CREATE POLICY "Anyone can upload an avatar." 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can view avatars." 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar." 
  ON storage.objects 
  FOR UPDATE 
  USING (auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'avatars');

CREATE POLICY "Users can delete their own avatar." 
  ON storage.objects 
  FOR DELETE 
  USING (auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'avatars');

-- =============================================================================
-- 4. COMPLETE SYSTEM VERIFICATION & STATUS
-- =============================================================================

-- MASTER VERIFICATION QUERY - Shows everything in one comprehensive result
WITH system_checks AS (
    SELECT 
        -- Core tables
        (SELECT COUNT(*) FROM information_schema.tables 
         WHERE table_name IN ('profiles', 'short_urls', 'short_url_analytics')) as table_count,
        
        -- Realtime setup
        (SELECT COUNT(*) FROM pg_publication_tables 
         WHERE pubname = 'supabase_realtime' 
           AND tablename IN ('short_urls', 'short_url_analytics')) as realtime_count,
        
        -- Triggers
        (SELECT COUNT(*) FROM pg_trigger 
         WHERE tgname IN ('update_click_counts_trigger', 'set_updated_at')) as trigger_count,
        
        -- Storage
        (SELECT EXISTS(SELECT 1 FROM storage.buckets WHERE id = 'avatars')) as bucket_exists,
        
        -- RLS policies by table
        (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles') as profiles_policies,
        (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'short_urls') as short_urls_policies,
        (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'short_url_analytics') as analytics_policies,
        (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'objects') as storage_policies,
        
        -- Individual table checks
        (SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public')) as profiles_exists,
        (SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'short_urls')) as short_urls_exists,
        (SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'short_url_analytics')) as analytics_exists
),
overall_status AS (
    SELECT 
        *,
        (table_count = 3 AND realtime_count = 2 AND trigger_count = 2 AND bucket_exists 
         AND profiles_policies >= 3 AND short_urls_policies >= 5 AND analytics_policies >= 3 AND storage_policies >= 4) as all_systems_go
    FROM system_checks
)
SELECT 
    -- HEADER
    '🎯 COMPLETE SYSTEM STATUS REPORT' as "SETUP_VERIFICATION_REPORT",
    
    -- OVERALL STATUS
    CASE 
        WHEN all_systems_go THEN '🎉 ALL SYSTEMS GO! SETUP COMPLETE!'
        ELSE '⚠️ ISSUES DETECTED - CHECK DETAILS BELOW'
    END as "OVERALL_STATUS",
    
    -- DETAILED COMPONENT STATUS
    CASE WHEN profiles_exists THEN '✅ Profiles table' ELSE '❌ Profiles missing' END as "1_PROFILES_TABLE",
    CASE WHEN short_urls_exists THEN '✅ Short URLs table' ELSE '❌ URLs missing' END as "2_SHORT_URLS_TABLE", 
    CASE WHEN analytics_exists THEN '✅ Analytics table' ELSE '❌ Analytics missing' END as "3_ANALYTICS_TABLE",
    
    CASE WHEN realtime_count = 2 THEN '✅ Realtime enabled (2/2)' ELSE '❌ Realtime issues (' || realtime_count || '/2)' END as "4_REALTIME_STATUS",
    
    CASE WHEN trigger_count = 2 THEN '✅ All triggers (2/2)' ELSE '❌ Missing triggers (' || trigger_count || '/2)' END as "5_TRIGGERS_STATUS",
    
    CASE WHEN bucket_exists THEN '✅ Storage configured' ELSE '❌ Storage missing' END as "6_STORAGE_STATUS",
    
    -- RLS SECURITY STATUS  
    CASE WHEN profiles_policies >= 3 THEN '✅ Profile security (' || profiles_policies || ' policies)' ELSE '⚠️ Profile security (' || profiles_policies || ' policies)' END as "7_PROFILE_SECURITY",
    CASE WHEN short_urls_policies >= 5 THEN '✅ URL security (' || short_urls_policies || ' policies)' ELSE '⚠️ URL security (' || short_urls_policies || ' policies)' END as "8_URL_SECURITY",
    CASE WHEN analytics_policies >= 3 THEN '✅ Analytics security (' || analytics_policies || ' policies)' ELSE '⚠️ Analytics security (' || analytics_policies || ' policies)' END as "9_ANALYTICS_SECURITY",
    CASE WHEN storage_policies >= 4 THEN '✅ Storage security (' || storage_policies || ' policies)' ELSE '⚠️ Storage security (' || storage_policies || ' policies)' END as "10_STORAGE_SECURITY",
    
         -- FEATURES ENABLED
     CASE WHEN all_systems_go THEN '✅ User authentication & profiles' ELSE '⚠️ May have issues' END as "FEATURE_AUTHENTICATION",
     CASE WHEN all_systems_go THEN '✅ Short URL creation & management' ELSE '⚠️ May have issues' END as "FEATURE_URL_MANAGEMENT",
     CASE WHEN all_systems_go THEN '✅ Real-time click tracking' ELSE '⚠️ May have issues' END as "FEATURE_REALTIME_TRACKING",
     CASE WHEN all_systems_go THEN '✅ Live analytics dashboard' ELSE '⚠️ May have issues' END as "FEATURE_LIVE_ANALYTICS",
     CASE WHEN all_systems_go THEN '✅ Profile picture uploads' ELSE '⚠️ May have issues' END as "FEATURE_AVATAR_UPLOADS",
     CASE WHEN all_systems_go THEN '✅ Row-level security' ELSE '⚠️ May have issues' END as "FEATURE_SECURITY",
     
     -- TECHNICAL SUMMARY
     table_count || '/3 tables created' as "TECH_TABLES",
     realtime_count || '/2 realtime tables' as "TECH_REALTIME",
     trigger_count || '/2 triggers active' as "TECH_TRIGGERS",
     CASE WHEN bucket_exists THEN '1/1 storage bucket' ELSE '0/1 storage bucket' END as "TECH_STORAGE",
     (profiles_policies + short_urls_policies + analytics_policies + storage_policies) || ' total RLS policies' as "TECH_SECURITY"

FROM overall_status; 