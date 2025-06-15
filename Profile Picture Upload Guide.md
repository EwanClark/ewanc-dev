# Profile Picture Upload Guide

This guide explains how to set up and use the profile picture upload functionality in your application.

## Setup Instructions

### 1. Configure Supabase Storage

#### Option 1: Using SQL Script (Recommended)
1. Go to your Supabase dashboard and navigate to the SQL Editor
2. Run the SQL script from `scripts/setup-profile-uploads.sql` to:
   - Create the `avatars` storage bucket
   - Set up all needed RLS policies in a single operation

#### Option 2: Manual Setup via Supabase UI
1. Navigate to the **Storage** section in your Supabase dashboard
2. Click **Create a new bucket**
3. Set:
   - Name: `avatars`
   - Public bucket: ✅ (checked)
4. Click **Create bucket**

### 2. Set Up Storage Policies in Supabase

If you used the SQL script, these policies are already created. If setting up manually, create the following policies:

1. In your `avatars` bucket, go to the **Policies** tab
2. Make sure RLS is turned on (should be on by default)
3. Create the following policies:

   #### Policy 1: Anyone can upload an avatar
   - Click **New Policy**
   - Choose **INSERT** for operation
   - Set:
     - Policy name: `Anyone can upload an avatar.`
     - Allowed roles: `anon, authenticated`
     - Using policy expression:
     ```sql
     bucket_id = 'avatars'
     ```

   #### Policy 2: Anyone can view avatars
   - Click **New Policy**
   - Choose **SELECT** for operation
   - Set:
     - Policy name: `Anyone can view avatars.`
     - Allowed roles: `anon, authenticated`
     - Using policy expression:
     ```sql
     bucket_id = 'avatars'
     ```
     
   #### Policy 3: Users can update their own avatar
   - Click **New Policy**
   - Choose **UPDATE** for operation
   - Set:
     - Policy name: `Users can update their own avatar.`
     - Allowed roles: `authenticated`
     - Using policy expression:
     ```sql
     auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'avatars'
     ```
     
   #### Policy 4: Users can delete their own avatar
   - Click **New Policy**
   - Choose **DELETE** for operation
   - Set:
     - Policy name: `Users can delete their own avatar.`
     - Allowed roles: `authenticated`
     - Using policy expression:
     ```sql
     auth.uid()::text = (storage.foldername(name))[1] AND bucket_id = 'avatars'
     ```

### 3. Configure CORS for Storage

1. In your Supabase dashboard, go to Storage > Policies > CORS
2. Add the following configuration to allow uploads from your application:
   ```json
   {
     "AllowedOrigins": ["*"],
     "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
     "AllowedHeaders": ["*"],
     "MaxAgeSeconds": 86400
   }
   ```

## How the Profile Picture Upload Works

The application already includes a complete implementation for profile picture uploads, including:

1. **Upload Component**: The profile page includes UI for uploading and editing avatars
2. **Image Cropping**: Users can crop, zoom, and rotate their profile pictures using the `ImageCropModal` component
3. **Storage Management**: Avatars are uploaded to the Supabase storage bucket and linked to the user's profile

### User Flow

1. User navigates to the Profile page
2. User clicks the "Upload" button to select an image
3. The image is loaded into the cropping modal
4. User adjusts the crop, zoom, and rotation
5. User clicks "Apply Crop" to save the changes
6. The cropped image is:
   - Uploaded to the `avatars` bucket in Supabase Storage
   - Named with pattern `avatar-{user_id}-{timestamp}.jpg`
   - The `avatar_url` field in the user's profile is updated with the new URL

## Implementation Details

### Components

- **Profile Page** (`app/profile/page.tsx`): Contains the main profile management UI
- **Image Crop Modal** (`components/image-crop-modal.tsx`): Handles image cropping functionality

### Key Functions

- `handleUploadClick()`: Triggers the file selection dialog
- `handleImageSelect()`: Opens the image crop modal for an existing avatar
- `handleCropComplete()`: Processes the cropped image, uploads it to storage, and updates the profile

### Storage Structure

- **Bucket**: `avatars`
- **Path Pattern**: `{user_id}/filename.jpg` (the user ID must be the first folder name)
- **Example**: `123e4567-e89b-12d3-a456-426614174000/avatar.jpg`

### Security

- Row Level Security ensures users can only upload and update their own avatars
- File naming convention ties each avatar to a specific user ID
- Public access is granted for viewing avatars, making them available on the frontend

## Troubleshooting

### Common Issues

1. **Upload Errors**:
   - Check browser console for specific error messages
   - Verify file size is under 2MB
   - Ensure Supabase storage is properly configured

2. **Avatar Not Displaying**:
   - Check if the URL in `avatar_url` is correct and accessible
   - Verify CORS settings in Supabase storage
   - Check network tab in browser dev tools for any 403 or 404 errors

3. **Permission Errors**:
   - Verify RLS policies are correctly applied
   - Check that the user is properly authenticated
   - Ensure the file naming follows the expected pattern

### Testing the Upload Functionality

1. Log in with a test user
2. Navigate to the profile page
3. Upload a test image and verify it appears in the avatar section
4. Log out and check if the avatar is still visible on public pages
5. Try updating the avatar to ensure the update process works correctly

## Best Practices

- Keep image sizes small to improve performance
- Consider implementing server-side validation of uploaded files
- Add additional image optimization for various screen sizes
- Consider adding a default avatar for users who haven't uploaded a profile picture

## Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [React Image Crop Documentation](https://github.com/DominicTobias/react-image-crop)
- [NextJS Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
