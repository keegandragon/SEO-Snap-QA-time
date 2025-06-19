/*
  # Initial schema setup for SEO Snap

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `usage_count` (integer)
      - `usage_limit` (integer)
      - `is_premium` (boolean)
      - `created_at` (timestamp)
    - `uploads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `image_url` (text)
      - `created_at` (timestamp)
    - `ai_outputs`
      - `id` (uuid, primary key)
      - `upload_id` (uuid, foreign key)
      - `product_description` (text)
      - `seo_tags` (text[])
      - `generated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  usage_count integer DEFAULT 0,
  usage_limit integer DEFAULT 5,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create ai_outputs table
CREATE TABLE IF NOT EXISTS ai_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id uuid REFERENCES uploads(id) ON DELETE CASCADE,
  product_description text,
  seo_tags text[],
  generated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_outputs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth_id = auth.uid());

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth_id = auth.uid());

CREATE POLICY "Users can read own uploads"
  ON uploads
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own uploads"
  ON uploads
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own ai outputs"
  ON ai_outputs
  FOR SELECT
  TO authenticated
  USING (upload_id IN (
    SELECT id FROM uploads WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own ai outputs"
  ON ai_outputs
  FOR INSERT
  TO authenticated
  WITH CHECK (upload_id IN (
    SELECT id FROM uploads WHERE user_id = auth.uid()
  ));

-- Function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', new.email));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();