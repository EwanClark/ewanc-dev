-- Setup storage bucket and policies for avatar uploads
-- This is a permanent, secure solution

-- Create the avatars storage bucket (public for easy image access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Clean up any existing policies
DROP POLICY IF EXISTS "Avatar uploads for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Avatar updates for own files" ON storage.objects;
DROP POLICY IF EXISTS "Avatar deletes for own files" ON storage.objects;
DROP POLICY IF EXISTS "Public avatar access" ON storage.objects;

-- Policy 1: Allow authenticated users to upload avatars to their own folder
CREATE POLICY "Avatar uploads for authenticated users" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'avatars' 
  AND (regexp_split_to_array(name, '/'))[1] = auth.uid()::text
);

-- Policy 2: Allow users to update/replace their own avatar files
CREATE POLICY "Avatar updates for own files" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'avatars' 
  AND (regexp_split_to_array(name, '/'))[1] = auth.uid()::text
) 
WITH CHECK (
  bucket_id = 'avatars' 
  AND (regexp_split_to_array(name, '/'))[1] = auth.uid()::text
);

-- Policy 3: Allow users to delete their own avatar files
CREATE POLICY "Avatar deletes for own files" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'avatars' 
  AND (regexp_split_to_array(name, '/'))[1] = auth.uid()::text
);

-- Policy 4: Allow public read access to all avatar images
CREATE POLICY "Public avatar access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

-- Optional: Create a function to clean up old avatars when new ones are uploaded
CREATE OR REPLACE FUNCTION delete_old_avatar()
RETURNS trigger AS $$
BEGIN
  DELETE FROM storage.objects 
  WHERE bucket_id = 'avatars' 
    AND (regexp_split_to_array(name, '/'))[1] = auth.uid()::text
    AND name != NEW.name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically clean up old avatars (optional)
DROP TRIGGER IF EXISTS on_avatar_upload ON storage.objects;
CREATE TRIGGER on_avatar_upload
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'avatars')
  EXECUTE FUNCTION delete_old_avatar();
