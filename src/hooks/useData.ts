import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Doctor, Service, Testimonial, SiteContent, Appointment, SiteSetting, ClinicPhoto } from '../lib/types';

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('doctors')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setDoctors(data);
        setLoading(false);
      });
  }, []);

  return { doctors, loading, setDoctors };
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setServices(data);
        setLoading(false);
      });
  }, []);

  return { services, loading, setServices };
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setTestimonials(data);
        setLoading(false);
      });
  }, []);

  return { testimonials, loading, setTestimonials };
}

export function useSiteContent(section: string) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('site_content')
      .select('*')
      .eq('section', section)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setContent(data);
        setLoading(false);
      });
  }, [section]);

  return { content, loading, setContent };
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('appointments')
      .select('*, services(title), doctors(name)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setAppointments(data as any);
        setLoading(false);
      });
  }, []);

  return { appointments, loading, setAppointments };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .then(({ data, error }) => {
        if (!error && data) {
          const map: Record<string, string> = {};
          data.forEach((s: SiteSetting) => { map[s.key] = s.value; });
          setSettings(map);
        }
        setLoading(false);
      });
  }, []);

  return { settings, loading, setSettings };
}

export function useClinicPhotos() {
  const [photos, setPhotos] = useState<ClinicPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('clinic_photos')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setPhotos(data);
        setLoading(false);
      });
  }, []);

  return { photos, loading, setPhotos };
}
