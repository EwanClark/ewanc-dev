-- Short URL System Database Setup
-- Run this in your Supabase SQL editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create short_urls table
CREATE TABLE short_urls (
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

-- Create short_url_analytics table
CREATE TABLE short_url_analytics (
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

-- Create indexes for better performance
CREATE INDEX idx_short_urls_user_id ON short_urls(user_id);
CREATE INDEX idx_short_urls_short_code ON short_urls(short_code);
CREATE INDEX idx_short_urls_created_at ON short_urls(created_at DESC);

CREATE INDEX idx_short_url_analytics_short_url_id ON short_url_analytics(short_url_id);
CREATE INDEX idx_short_url_analytics_timestamp ON short_url_analytics(timestamp DESC);
CREATE INDEX idx_short_url_analytics_ip_address ON short_url_analytics(ip_address);

-- Enable Row Level Security (RLS)
ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE short_url_analytics ENABLE ROW LEVEL SECURITY;

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

-- Create RLS policies for short_url_analytics
CREATE POLICY "Users can view analytics for their URLs" ON short_url_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM short_urls 
      WHERE short_urls.id = short_url_analytics.short_url_id 
      AND short_urls.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow inserting analytics for any URL" ON short_url_analytics
  FOR INSERT WITH CHECK (true);

-- No UPDATE policy = Only service role can update analytics
-- This prevents users from tampering with analytics data
-- System operations (password verification) use service role to bypass RLS

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
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

-- Create trigger to auto-update click counts
CREATE TRIGGER update_click_counts_trigger
  AFTER INSERT ON short_url_analytics
  FOR EACH ROW EXECUTE FUNCTION update_click_counts(); 