import { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, FileText, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useServices, useDoctors } from '../hooks/useData';

export default function AppointmentPage() {
  const { services } = useServices();
  const { doctors } = useDoctors();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patient_name: '',
    patient_phone: '',
    patient_email: '',
    service_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    address: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('appointments').insert({
      ...form,
      service_id: form.service_id || null,
      doctor_id: form.doctor_id || null,
    });
    if (!error) {
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Appointment Booked!</h2>
          <p className="text-gray-600 mb-6">
            Thank you, {form.patient_name}. We will confirm your appointment shortly via phone. A doctor will visit you at the scheduled time.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ patient_name: '', patient_phone: '', patient_email: '', service_id: '', doctor_id: '', appointment_date: '', appointment_time: '', address: '', notes: '' }); }}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-800 to-teal-950 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Book an Appointment</h1>
            <p className="text-xl text-teal-200">
              Request a home visit. We will call back to confirm the time and doctor.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Patient Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="patient_name"
                    required
                    value={form.patient_name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="patient_phone"
                    required
                    value={form.patient_phone}
                    onChange={handleChange}
                    placeholder="+977-9800000000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="patient_email"
                    value={form.patient_email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Service *</label>
                <select
                  name="service_id"
                  required
                  value={form.service_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white"
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-6">Appointment Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Doctor</label>
                <select
                  name="doctor_id"
                  value={form.doctor_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white"
                >
                  <option value="">Any available doctor</option>
                  {doctors.filter(d => d.available).map((d) => (
                    <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Date *</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="appointment_date"
                    required
                    value={form.appointment_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Time *</label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    name="appointment_time"
                    required
                    value={form.appointment_time}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Address *</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    required
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Full address for home visit"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
              <div className="relative">
                <FileText size={18} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Describe your symptoms or any special requirements..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-4 rounded-xl transition-colors text-lg"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
