-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Set up Row Level Security (RLS) for avatars bucket
CREATE POLICY "Anyone can upload an avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Anyone can view avatars." ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can update their own avatar." ON storage.objects FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'avatars');
CREATE POLICY "Users can delete their own avatar." ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'avatars');
