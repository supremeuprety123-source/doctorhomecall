/*
  # Setup Storage for Doctor Images

  1. Storage
    - Create `doctor-images` storage bucket for doctor profile photos
  2. Security
    - Public read access for doctor images
    - Authenticated users can upload images
*/

-- Insert the storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('doctor-images', 'doctor-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public can view doctor images" 
  ON storage.objects FOR SELECT 
  TO anon, authenticated
  USING (bucket_id = 'doctor-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated can upload doctor images" 
  ON storage.objects FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'doctor-images');

-- Allow authenticated users to update
CREATE POLICY "Authenticated can update doctor images" 
  ON storage.objects FOR UPDATE 
  TO authenticated
  USING (bucket_id = 'doctor-images')
  WITH CHECK (bucket_id = 'doctor-images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated can delete doctor images" 
  ON storage.objects FOR DELETE 
  TO authenticated
  USING (bucket_id = 'doctor-images');
