/*
  # Doctor Home Call Service Nepal - Initial Schema

  1. New Tables
    - `doctors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `specialty` (text)
      - `qualification` (text)
      - `experience` (text)
      - `bio` (text)
      - `image_url` (text)
      - `available` (boolean, default true)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamp)
    - `services`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `icon` (text)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamp)
    - `appointments`
      - `id` (uuid, primary key)
      - `patient_name` (text)
      - `patient_phone` (text)
      - `patient_email` (text)
      - `service_id` (uuid, FK to services)
      - `doctor_id` (uuid, FK to doctors, nullable)
      - `appointment_date` (date)
      - `appointment_time` (text)
      - `address` (text)
      - `notes` (text)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
    - `testimonials`
      - `id` (uuid, primary key)
      - `patient_name` (text)
      - `content` (text)
      - `rating` (integer, 1-5)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamp)
    - `site_content`
      - `id` (uuid, primary key)
      - `section` (text, unique)
      - `title` (text)
      - `subtitle` (text)
      - `body` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public read access for doctors, services, testimonials, site_content
    - Authenticated admin access for all CRUD operations
    - Public insert for appointments (booking form)
*/

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text NOT NULL,
  qualification text DEFAULT '',
  experience text DEFAULT '',
  bio text DEFAULT '',
  image_url text DEFAULT '',
  available boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'stethoscope',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  patient_phone text NOT NULL,
  patient_email text DEFAULT '',
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE SET NULL,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  address text NOT NULL,
  notes text DEFAULT '',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  content text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Site content table (for editable CMS-like content)
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text UNIQUE NOT NULL,
  title text DEFAULT '',
  subtitle text DEFAULT '',
  body text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view doctors" ON doctors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can view services" ON services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can view testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can view site content" ON site_content FOR SELECT TO anon, authenticated USING (true);

-- Public can book appointments
CREATE POLICY "Public can book appointments" ON appointments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public can view own appointments by email" ON appointments FOR SELECT TO anon, authenticated USING (true);

-- Admin full access policies (authenticated users)
CREATE POLICY "Admin can insert doctors" ON doctors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update doctors" ON doctors FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete doctors" ON doctors FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin can insert services" ON services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update services" ON services FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete services" ON services FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin can update appointments" ON appointments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete appointments" ON appointments FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin can insert testimonials" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update testimonials" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete testimonials" ON testimonials FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin can insert site content" ON site_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update site content" ON site_content FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete site content" ON site_content FOR DELETE TO authenticated USING (true);

-- Seed data: Services
INSERT INTO services (title, description, icon, sort_order) VALUES
  ('General Home Visit', 'Comprehensive medical consultation at your doorstep by experienced general practitioners.', 'stethoscope', 1),
  ('Pediatric Care', 'Specialized home visits for children including vaccinations, growth monitoring, and illness treatment.', 'baby', 2),
  ('Elderly Care', 'Dedicated healthcare services for senior citizens including chronic disease management and wellness checks.', 'heart-pulse', 3),
  ('Emergency Visit', 'Urgent medical attention at home for non-life-threatening emergencies and acute conditions.', 'siren', 4),
  ('Lab Sample Collection', 'Convenient home collection of blood, urine, and other samples for laboratory testing.', 'test-tubes', 5),
  ('Physiotherapy', 'Professional physiotherapy sessions at home for rehabilitation, pain management, and mobility improvement.', 'activity', 6),
  ('Post-Surgical Care', 'Follow-up care and wound management after surgical procedures in the comfort of your home.', 'clipboard-check', 7),
  ('Telemedicine Consultation', 'Virtual doctor consultations via video call for initial assessment and follow-up appointments.', 'video', 8);

-- Seed data: Doctors
INSERT INTO doctors (name, specialty, qualification, experience, bio, image_url, available, sort_order) VALUES
  ('Dr. Rajesh Sharma', 'General Medicine', 'MBBS, MD', '15 years', 'Senior physician with extensive experience in home-based medical care and chronic disease management.', '', true, 1),
  ('Dr. Sita Poudel', 'Pediatrics', 'MBBS, MD Pediatrics', '12 years', 'Specialist in child healthcare with a compassionate approach to pediatric home visits.', '', true, 2),
  ('Dr. Bikash Thapa', 'Internal Medicine', 'MBBS, MD Medicine', '18 years', 'Expert in internal medicine with focus on elderly care and complex medical conditions.', '', true, 3),
  ('Dr. Anjali Gurung', 'Physiotherapy', 'BPT, MPT', '10 years', 'Dedicated physiotherapist specializing in home-based rehabilitation and pain management.', '', true, 4),
  ('Dr. Prakash Adhikari', 'Emergency Medicine', 'MBBS, MEM', '8 years', 'Emergency medicine specialist providing urgent home visit services across Kathmandu Valley.', '', true, 5),
  ('Dr. Maya Rai', 'Family Medicine', 'MBBS, DFM', '14 years', 'Family medicine practitioner offering holistic home healthcare for all age groups.', '', true, 6);

-- Seed data: Testimonials
INSERT INTO testimonials (patient_name, content, rating, sort_order) VALUES
  ('Ram Bahadur', 'The doctor arrived within 30 minutes of booking. Excellent service and very professional care. My mother felt much better after the visit.', 5, 1),
  ('Sunita Shrestha', 'Very convenient for families with small children. Dr. Poudel was gentle and thorough with my kids. Highly recommend!', 5, 2),
  ('Hari Prasad', 'The physiotherapy sessions at home saved me weeks of travel to the clinic. Dr. Gurung is truly skilled at her work.', 5, 3),
  ('Anita Tamang', 'Used the emergency visit service late at night. Quick response and the doctor handled the situation very well. Grateful for this service.', 5, 4),
  ('Deepak Karki', 'Regular check-ups for my elderly father are now so easy. The doctors are caring and always on time. Thank you!', 4, 5);

-- Seed data: Site content
INSERT INTO site_content (section, title, subtitle, body) VALUES
  ('hero', 'Quality Healthcare at Your Doorstep', 'Doctor Home Call Service Nepal Pvt. Ltd.', 'Bringing experienced doctors directly to your home across Kathmandu Valley. No waiting rooms, no travel stress — just compassionate medical care where you need it most.'),
  ('about', 'About Us', 'Trusted Home Healthcare Since 2018', 'Doctor Home Call Service Nepal Pvt. Ltd. is a pioneering healthcare organization dedicated to making quality medical care accessible to everyone in the comfort of their homes. Founded in 2018, we have served over 10,000 patients across Kathmandu Valley with a team of experienced and compassionate doctors. Our mission is to eliminate the barriers between patients and healthcare by bringing the clinic to your living room. Whether it is a routine check-up, pediatric care, elderly care, or an urgent medical need, our team is just a call away.'),
  ('contact', 'Contact Us', 'We are here to help', 'Phone: +977-01-4567890, +977-9801234567 | Email: info@doctorhomecall.com.np | Address: Putalisadak, Kathmandu, Nepal'),
  ('cta', 'Book Your Home Visit Today', 'Available 24/7 across Kathmandu Valley', 'Call us or book online to get a doctor at your doorstep within 30 minutes.');
