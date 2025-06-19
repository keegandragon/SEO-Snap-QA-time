/*
  # Update Storage Policies for Image Uploads

  1. Changes
    - Create product-images bucket if it doesn't exist
    - Add policies for authenticated users to:
      - Upload files to the bucket
      - Read files from the bucket
      - Delete their own files
  
  2. Security
    - Only authenticated users can upload and read files
    - Users can only delete their own files
*/

-- Create the storage bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('product-images', 'product-images')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to read files" ON storage.objects;
  DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;
END $$;

-- Policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images'
);

-- Policy to allow authenticated users to read any file
CREATE POLICY "Allow authenticated users to read files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'product-images'
);

-- Policy to allow users to delete their own files
CREATE POLICY "Allow users to delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND auth.uid() = owner
);