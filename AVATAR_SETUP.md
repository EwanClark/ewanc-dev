# Supabase Storage Setup

To enable avatar upload functionality, you need to create a storage bucket in your Supabase project.

## Steps:

1. Go to your Supabase dashboard
2. Navigate to Storage in the left sidebar
3. Click "Create new bucket"
4. Set the bucket name to `avatars`
5. Make it public
6. Click "Create bucket"

## Alternative: Run SQL Script

You can also run the SQL script in `scripts/setup-storage.sql` in your Supabase SQL editor:

```sql
-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Set up Row Level Security (RLS) for avatars bucket
CREATE POLICY "Anyone can upload an avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Anyone can view avatars." ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can update their own avatar." ON storage.objects FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'avatars');
CREATE POLICY "Users can delete their own avatar." ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'avatars');
```

## Features

The avatar upload system includes:

- **File Upload**: Click the "Upload" button to select an image file
- **Image Cropping**: After selecting an image, you can:
  - Crop to a circular area
  - Zoom in/out (0.5x to 3x)
  - Rotate the image (-180° to +180°)
  - Move the crop area around the image
- **Automatic Storage**: Cropped images are automatically uploaded to Supabase storage
- **Profile Update**: Your profile is automatically updated with the new avatar URL
- **Provider Avatar**: If you signed in with Google or GitHub, you can also use your provider's avatar

## File Restrictions

- Maximum file size: 5MB
- Supported formats: All image formats (jpg, png, gif, webp, etc.)
- Output format: JPEG (optimized for web)
