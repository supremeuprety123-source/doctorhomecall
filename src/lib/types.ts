export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  bio: string;
  image_url: string;
  available: boolean;
  sort_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  service_id: string | null;
  doctor_id: string | null;
  appointment_date: string;
  appointment_time: string;
  address: string;
  notes: string;
  status: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  patient_name: string;
  content: string;
  rating: number;
  sort_order: number;
  created_at: string;
}

export interface SiteContent {
  id: string;
  section: string;
  title: string;
  subtitle: string;
  body: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface ClinicPhoto {
  id: string;
  url: string;
  caption: string;
  sort_order: number;
  created_at: string;
}
