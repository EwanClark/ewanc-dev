# Supabase Avatar Storage Setup Guide

Since direct SQL manipulation of the storage.objects table requires superuser privileges (which you don't have in the Supabase interface), here's how to set up your avatar storage using the Supabase web interface:

## 1. Create Storage Bucket

1. Go to the **Storage** section in your Supabase dashboard
2. Click **New Bucket**
3. Name it `avatars`
4. Check ✅ **Public bucket** option
5. Click **Create bucket**

## 2. Set Up Storage Policies

For each policy below, go to your bucket's **Policies** tab and create a new policy:

### Policy 1: Allow uploads for authenticated users

1. Click **New Policy**
2. In the modal that appears:
   - Select "Create a policy from scratch"
   - Name: `Avatar uploads for authenticated users`
   - For operation: **INSERT**
   - Target roles: **authenticated**
   - Policy definition: 
   ```sql
   (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
   ```
3. Click **Save Policy**

### Policy 2: Allow users to update/replace their own files

1. Click **New Policy**
2. In the modal that appears:
   - Select "Create a policy from scratch"
   - Name: `Avatar updates for own files`
   - For operation: **UPDATE**
   - Target roles: **authenticated**
   - Policy definition: 
   ```sql
   (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
   ```
3. Click **Save Policy**

### Policy 3: Allow users to delete their own files

1. Click **New Policy**
2. In the modal that appears:
   - Select "Create a policy from scratch"
   - Name: `Avatar deletes for own files`
   - For operation: **DELETE**
   - Target roles: **authenticated**
   - Policy definition: 
   ```sql
   (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
   ```
3. Click **Save Policy**

### Policy 4: Allow public access to view all avatars

1. Click **New Policy**
2. In the modal that appears:
   - Select "Create a policy from scratch"
   - Name: `Public avatar access`
   - For operation: **SELECT**
   - Target roles: **public**
   - Policy definition: 
   ```sql
   (bucket_id = 'avatars')
   ```
3. Click **Save Policy**

## 3. Optional: Bucket Configuration

If available in your Supabase plan, set these additional configurations:

1. File Size Limit: 5MB (5242880 bytes)
2. Allowed MIME Types: image/jpeg, image/png, image/webp, image/gif

## Verification

After setting up these policies, test your avatar upload functionality. If it still doesn't work, check your browser's network console for specific error details.
