/*
  # Storage Setup for Product Images

  1. New Storage Bucket
    - Create 'product-images' bucket for storing uploaded product images
    
  2. Storage Policies
    - Allow authenticated users to upload files
    - Allow authenticated users to read files
    - Allow users to delete their own files
    
  3. Security
    - Enable RLS on storage.objects
    - Proper authentication checks
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (using IF EXISTS to avoid errors)
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to read files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;

-- Policy to allow authenticated users to upload files to product-images bucket
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
);

-- Policy to allow authenticated users to read files from product-images bucket
CREATE POLICY "Allow authenticated users to read files"
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'product-images'
);

-- Policy to allow users to delete their own files from product-images bucket
CREATE POLICY "Allow users to delete own files"
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND auth.uid() = owner
);

-- Grant necessary permissions to authenticated role
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;