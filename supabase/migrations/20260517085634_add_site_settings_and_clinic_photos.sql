/*
  # Add Site Settings and Clinic Photos

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) — setting key like 'email', 'phone', etc.
      - `value` (text) — setting value
      - `updated_at` (timestamp)
    - `clinic_photos`
      - `id` (uuid, primary key)
      - `url` (text) — image URL
      - `caption` (text)
      - `sort_order` (integer)
      - `created_at` (timestamp)

  2. Storage
    - `clinic-photos` bucket for slideshow images
    - `site-assets` bucket for logo and other assets

  3. Security
    - RLS on both new tables
    - Public read, admin write
*/

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can insert site settings" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update site settings" ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete site settings" ON site_settings FOR DELETE TO authenticated USING (true);

-- Clinic photos table
CREATE TABLE IF NOT EXISTS clinic_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  caption text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clinic_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view clinic photos" ON clinic_photos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can insert clinic photos" ON clinic_photos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update clinic photos" ON clinic_photos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete clinic photos" ON clinic_photos FOR DELETE TO authenticated USING (true);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('clinic-photos', 'clinic-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for clinic-photos
CREATE POLICY "Public can view clinic photos storage" 
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'clinic-photos');

CREATE POLICY "Authenticated can upload clinic photos" 
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'clinic-photos');

CREATE POLICY "Authenticated can update clinic photos" 
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'clinic-photos')
  WITH CHECK (bucket_id = 'clinic-photos');

CREATE POLICY "Authenticated can delete clinic photos" 
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'clinic-photos');

-- Storage policies for site-assets
CREATE POLICY "Public can view site assets storage" 
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-assets');

CREATE POLICY "Authenticated can upload site assets" 
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Authenticated can update site assets" 
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site-assets')
  WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Authenticated can delete site assets" 
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site-assets');

-- Seed site settings
INSERT INTO site_settings (key, value) VALUES
  ('email', 'info@doctorhomecall.com.np'),
  ('phone', '+977-01-4567890'),
  ('mobile', '+977-9801234567'),
  ('whatsapp', '+977-9801234567'),
  ('address', 'Putalisadak, Kathmandu, Nepal'),
  ('company_name', 'Doctor Home Call Service Nepal Pvt. Ltd.'),
  ('tagline', 'Quality Healthcare at Your Doorstep'),
  ('logo_url', ''),
  ('facebook', ''),
  ('instagram', ''),
  ('youtube', ''),
  ('map_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0!2d85.3147!3d27.7103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a0b5e5c3a3%3A0x3e5e5e5e5e5e5e5e!2sPutalisadak%2C%20Kathmandu%2C%20Nepal!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp'),
  ('meta_description', 'Doctor Home Call Service Nepal Pvt. Ltd. provides 24/7 home visit doctors, pediatric care, elderly care, emergency visits, and telemedicine across Kathmandu Valley.'),
  ('patients_served', '10,000+'),
  ('doctor_count', '50+'),
  ('response_time', '30 min'),
  ('rating', '4.9/5'),
  ('years_service', '7+');
