import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Edit3, X, Check, Upload, Image, Eye, LogOut, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Doctor, Service, Testimonial, SiteContent, Appointment, SiteSetting, ClinicPhoto } from '../lib/types';

type Tab = 'appointments' | 'doctors' | 'services' | 'testimonials' | 'content' | 'settings' | 'photos';

const ICON_OPTIONS = [
  { value: 'stethoscope', label: 'Stethoscope', emoji: '🩺' },
  { value: 'baby', label: 'Baby/Pediatric', emoji: '👶' },
  { value: 'heart-pulse', label: 'Heart/Pulse', emoji: '❤️' },
  { value: 'siren', label: 'Emergency', emoji: '🚨' },
  { value: 'test-tubes', label: 'Lab/Test', emoji: '🧪' },
  { value: 'activity', label: 'Activity/Physio', emoji: '🏃' },
  { value: 'clipboard-check', label: 'Checklist', emoji: '📋' },
  { value: 'video', label: 'Video/Tele', emoji: '📹' },
  { value: 'pill', label: 'Medicine', emoji: '💊' },
  { value: 'syringe', label: 'Injection', emoji: '💉' },
  { value: 'thermometer', label: 'Thermometer', emoji: '🌡️' },
  { value: 'shield', label: 'Shield/Insurance', emoji: '🛡️' },
];

const SETTINGS_GROUPS = [
  {
    label: 'Contact Information',
    keys: ['email', 'phone', 'mobile', 'whatsapp', 'address'],
    labels: { email: 'Email Address', phone: 'Phone Number', mobile: 'Mobile Number', whatsapp: 'WhatsApp Number', address: 'Clinic Address' },
  },
  {
    label: 'Branding',
    keys: ['company_name', 'tagline', 'logo_url'],
    labels: { company_name: 'Company Name', tagline: 'Tagline', logo_url: 'Logo URL (upload below)' },
  },
  {
    label: 'Social Media',
    keys: ['facebook', 'instagram', 'youtube'],
    labels: { facebook: 'Facebook URL', instagram: 'Instagram URL', youtube: 'YouTube URL' },
  },
  {
    label: 'Homepage Stats',
    keys: ['patients_served', 'doctor_count', 'response_time', 'rating', 'years_service'],
    labels: { patients_served: 'Patients Served', doctor_count: 'Doctor Count', response_time: 'Response Time', rating: 'Rating', years_service: 'Years of Service' },
  },
  {
    label: 'SEO & Map',
    keys: ['meta_description', 'map_embed_url', 'map_link_url'],
    labels: { meta_description: 'Meta Description (SEO)', map_embed_url: 'Google Map Embed URL (iframe)', map_link_url: 'Google Map Link URL (clickable)' },
  },
  {
    label: 'Theme & Colors',
    keys: ['primary_color', 'accent_color', 'dark_mode'],
    labels: { primary_color: 'Primary Color (hex)', accent_color: 'Accent Color (hex)', dark_mode: 'Dark Mode (true/false)' },
  },
];

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [siteContentList, setSiteContentList] = useState<SiteContent[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [clinicPhotos, setClinicPhotos] = useState<ClinicPhoto[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string>('Contact Information');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadData();
  }, [session]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) setLoginError('Invalid credentials. Please try again.');
    setLoggingIn(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  async function loadData() {
    const [apptRes, docRes, svcRes, testRes, contentRes, settingsRes, photosRes] = await Promise.all([
      supabase.from('appointments').select('*, services(title), doctors(name)').order('created_at', { ascending: false }),
      supabase.from('doctors').select('*').order('sort_order'),
      supabase.from('services').select('*').order('sort_order'),
      supabase.from('testimonials').select('*').order('sort_order'),
      supabase.from('site_content').select('*'),
      supabase.from('site_settings').select('*').order('key'),
      supabase.from('clinic_photos').select('*').order('sort_order'),
    ]);
    if (apptRes.data) setAppointments(apptRes.data as any);
    if (docRes.data) setDoctors(docRes.data);
    if (svcRes.data) setServices(svcRes.data);
    if (testRes.data) setTestimonials(testRes.data);
    if (contentRes.data) setSiteContentList(contentRes.data);
    if (settingsRes.data) setSiteSettings(settingsRes.data);
    if (photosRes.data) setClinicPhotos(photosRes.data);
  }

  async function updateAppointmentStatus(id: string, status: string) {
    await supabase.from('appointments').update({ status }).eq('id', id);
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  }

  async function saveEdit(table: string, id: string) {
    setSaving(true);
    const { id: _, created_at: __, services: ___, doctors: ____, ...updates } = editForm;
    await supabase.from(table).update(updates).eq('id', id);
    setEditingId(null);
    setEditForm({});
    setPreviewUrl(null);
    await loadData();
    setSaving(false);
  }

  async function deleteItem(table: string, id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    await supabase.from(table).delete().eq('id', id);
    await loadData();
  }

  async function addDoctor() {
    const { data } = await supabase.from('doctors').insert({
      name: 'New Doctor', specialty: 'General Medicine', qualification: 'MBBS',
      experience: '5 years', bio: 'New doctor profile — edit this', sort_order: doctors.length + 1,
    }).select().single();
    if (data) { await loadData(); setEditingId(data.id); setEditForm(data); }
  }

  async function addService() {
    const { data } = await supabase.from('services').insert({
      title: 'New Service', description: 'Service description', icon: 'stethoscope', sort_order: services.length + 1,
    }).select().single();
    if (data) { await loadData(); setEditingId(data.id); setEditForm(data); }
  }

  async function addTestimonial() {
    const { data } = await supabase.from('testimonials').insert({
      patient_name: 'New Patient', content: 'Testimonial content', rating: 5, sort_order: testimonials.length + 1,
    }).select().single();
    if (data) { await loadData(); setEditingId(data.id); setEditForm(data); }
  }

  async function saveContent(id: string) {
    setSaving(true);
    const { id: _, section: __, updated_at: ___, ...updates } = editForm;
    await supabase.from('site_content').update(updates).eq('id', id);
    setEditingId(null); setEditForm({});
    await loadData(); setSaving(false);
  }

  async function saveSetting(key: string, value: string) {
    setSaving(true);
    await supabase.from('site_settings').update({ value }).eq('key', key);
    await loadData(); setSaving(false);
  }

  async function handleImageUpload(file: File, bucket: string, onDone: (url: string) => void) {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (!error) {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      onDone(urlData.publicUrl);
    } else {
      alert('Upload failed: ' + error.message);
    }
    setUploading(false);
  }

  async function addClinicPhoto() {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      await handleImageUpload(file, 'clinic-photos', async (url) => {
        await supabase.from('clinic_photos').insert({ url, caption: 'Clinic photo', sort_order: clinicPhotos.length + 1 });
        await loadData();
      });
    };
    input.click();
  }

  function startEdit(item: Record<string, any>) {
    setEditingId(item.id);
    setEditForm({ ...item });
    if (item.image_url) setPreviewUrl(item.image_url);
    else setPreviewUrl(null);
  }

  function cancelEdit() {
    setEditingId(null); setEditForm({}); setPreviewUrl(null);
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'appointments', label: 'Appointments', count: appointments.length },
    { key: 'doctors', label: 'Doctors', count: doctors.length },
    { key: 'services', label: 'Services', count: services.length },
    { key: 'testimonials', label: 'Testimonials', count: testimonials.length },
    { key: 'content', label: 'Page Content', count: siteContentList.length },
    { key: 'photos', label: 'Clinic Photos', count: clinicPhotos.length },
    { key: 'settings', label: 'Site Settings', count: siteSettings.length },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  // ===== AUTH SCREEN =====
  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full" /></div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-800 to-teal-950 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-teal-300 text-sm mt-1">Doctor Home Call Service Nepal</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 shadow-xl">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{loginError}</div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <button type="submit" disabled={loggingIn} className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold py-3 rounded-xl transition-colors">
              {loggingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD =====
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-500 hover:text-gray-700 transition-colors"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Manage your website content</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors">
              <Eye size={16} /> View Website
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.key ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ===== APPOINTMENTS ===== */}
        {activeTab === 'appointments' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6">Appointments</h2>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No appointments yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Patient</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Phone</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Service</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Date/Time</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Address</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {appointments.map((a: any) => (
                        <tr key={a.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3"><div className="font-medium text-gray-900">{a.patient_name}</div>{a.patient_email && <div className="text-xs text-gray-400">{a.patient_email}</div>}</td>
                          <td className="px-4 py-3 text-gray-600">{a.patient_phone}</td>
                          <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{a.services?.title || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{a.appointment_date}<br /><span className="text-xs text-gray-400">{a.appointment_time}</span></td>
                          <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate hidden lg:table-cell">{a.address}</td>
                          <td className="px-4 py-3"><span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[a.status] || 'bg-gray-100 text-gray-600'}`}>{a.status}</span></td>
                          <td className="px-4 py-3">
                            <select value={a.status} onChange={(e) => updateAppointmentStatus(a.id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-teal-500 outline-none">
                              <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== DOCTORS ===== */}
        {activeTab === 'doctors' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Doctors</h2>
              <button onClick={addDoctor} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"><Plus size={16} /> Add Doctor</button>
            </div>
            <div className="grid gap-4">
              {doctors.map((doc) => (
                <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-5">
                  {editingId === doc.id ? (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2"><Edit3 size={14} className="text-teal-600" /> Editing Doctor</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Photo</label>
                        <div className="flex items-start gap-4">
                          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                            {previewUrl || editForm.image_url ? <img src={previewUrl || editForm.image_url} alt="Doctor" className="w-full h-full object-cover" /> : <Image size={32} className="text-gray-300" />}
                          </div>
                          <div className="flex-1">
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, 'doctor-images', (url) => { setEditForm((p: any) => ({ ...p, image_url: url })); setPreviewUrl(url); }); }} />
                            <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"><Upload size={16} />{uploading ? 'Uploading...' : 'Upload Photo'}</button>
                            <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB. Recommended: 400x400px</p>
                            {editForm.image_url && <button onClick={() => { setEditForm((p: any) => ({ ...p, image_url: '' })); setPreviewUrl(null); }} className="text-xs text-red-500 hover:text-red-700 mt-1">Remove photo</button>}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Name</label><input value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Specialty</label><input value={editForm.specialty || ''} onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Qualification</label><input value={editForm.qualification || ''} onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Experience</label><input value={editForm.experience || ''} onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Sort Order</label><input type="number" value={editForm.sort_order || 0} onChange={(e) => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                        <div className="flex items-end"><label className="flex items-center gap-2 text-sm pb-2.5"><input type="checkbox" checked={editForm.available || false} onChange={(e) => setEditForm({ ...editForm, available: e.target.checked })} className="rounded text-teal-600" /> Available</label></div>
                      </div>
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">Bio</label><textarea value={editForm.bio || ''} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none" rows={3} /></div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => saveEdit('doctors', doc.id)} disabled={saving} className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"><Check size={14} /> {saving ? 'Saving...' : 'Save'}</button>
                        <button onClick={cancelEdit} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"><X size={14} /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {doc.image_url ? <img src={doc.image_url} alt={doc.name} className="w-full h-full object-cover" /> : <span className="text-2xl">👨‍⚕️</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                            <p className="text-sm text-teal-600">{doc.specialty} | {doc.qualification}</p>
                            <p className="text-sm text-gray-500 mt-1">{doc.bio}</p>
                            <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${doc.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{doc.available ? 'Available' : 'Unavailable'}</span>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => startEdit(doc)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Edit3 size={16} className="text-gray-500" /></button>
                            <button onClick={() => deleteItem('doctors', doc.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} className="text-red-500" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== SERVICES ===== */}
        {activeTab === 'services' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Services</h2>
              <button onClick={addService} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"><Plus size={16} /> Add Service</button>
            </div>
            <div className="grid gap-4">
              {services.map((svc) => (
                <div key={svc.id} className="bg-white rounded-xl border border-gray-200 p-5">
                  {editingId === svc.id ? (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2"><Edit3 size={14} className="text-teal-600" /> Editing Service</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Title</label><input value={editForm.title || ''} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Icon</label><select value={editForm.icon || 'stethoscope'} onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none bg-white">{ICON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.emoji} {o.label}</option>)}</select></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Sort Order</label><input type="number" value={editForm.sort_order || 0} onChange={(e) => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                      </div>
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">Description</label><textarea value={editForm.description || ''} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none" rows={3} /></div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => saveEdit('services', svc.id)} disabled={saving} className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"><Check size={14} /> {saving ? 'Saving...' : 'Save'}</button>
                        <button onClick={cancelEdit} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"><X size={14} /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{ICON_OPTIONS.find(o => o.value === svc.icon)?.emoji || '🩺'}</span>
                        <div><h3 className="font-semibold text-gray-900">{svc.title}</h3><p className="text-sm text-gray-500 mt-1">{svc.description}</p></div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => startEdit(svc)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Edit3 size={16} className="text-gray-500" /></button>
                        <button onClick={() => deleteItem('services', svc.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} className="text-red-500" /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== TESTIMONIALS ===== */}
        {activeTab === 'testimonials' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Testimonials</h2>
              <button onClick={addTestimonial} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"><Plus size={16} /> Add Testimonial</button>
            </div>
            <div className="grid gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-5">
                  {editingId === t.id ? (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2"><Edit3 size={14} className="text-teal-600" /> Editing Testimonial</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Patient Name</label><input value={editForm.patient_name || ''} onChange={(e) => setEditForm({ ...editForm, patient_name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Rating (1-5)</label><input type="number" min="1" max="5" value={editForm.rating || 5} onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                      </div>
                      <div><label className="block text-xs font-medium text-gray-500 mb-1">Content</label><textarea value={editForm.content || ''} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none" rows={3} /></div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => saveEdit('testimonials', t.id)} disabled={saving} className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"><Check size={14} /> {saving ? 'Saving...' : 'Save'}</button>
                        <button onClick={cancelEdit} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"><X size={14} /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2"><h3 className="font-semibold text-gray-900">{t.patient_name}</h3><span className="text-amber-400 text-sm">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span></div>
                        <p className="text-sm text-gray-500 mt-1">"{t.content}"</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => startEdit(t)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Edit3 size={16} className="text-gray-500" /></button>
                        <button onClick={() => deleteItem('testimonials', t.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} className="text-red-500" /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== PAGE CONTENT ===== */}
        {activeTab === 'content' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Edit Page Content</h2>
            <p className="text-sm text-gray-500 mb-6">Changes here update the website immediately.</p>
            <div className="grid gap-4">
              {siteContentList.map((sc) => (
                <div key={sc.id} className="bg-white rounded-xl border border-gray-200 p-5">
                  {editingId === sc.id ? (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2"><Edit3 size={14} className="text-teal-600" /> Editing: <span className="capitalize">{sc.section}</span></h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Title</label><input value={editForm.title || ''} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Subtitle</label><input value={editForm.subtitle || ''} onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                        <div><label className="block text-xs font-medium text-gray-500 mb-1">Body Text</label><textarea value={editForm.body || ''} onChange={(e) => setEditForm({ ...editForm, body: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none" rows={4} /></div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={() => saveContent(sc.id)} disabled={saving} className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"><Save size={14} /> {saving ? 'Saving...' : 'Save & Publish'}</button>
                        <button onClick={cancelEdit} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"><X size={14} /> Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full capitalize">{sc.section}</span>
                        <h3 className="font-semibold text-gray-900 mt-1">{sc.title || '(no title)'}</h3>
                        <p className="text-sm text-teal-600">{sc.subtitle || '(no subtitle)'}</p>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{sc.body || '(no body)'}</p>
                      </div>
                      <button onClick={() => startEdit(sc)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"><Edit3 size={16} className="text-gray-500" /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== CLINIC PHOTOS ===== */}
        {activeTab === 'photos' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Clinic Photos</h2>
                <p className="text-sm text-gray-500">These photos appear as a slideshow on the homepage.</p>
              </div>
              <button onClick={addClinicPhoto} disabled={uploading} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"><Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Photo'}</button>
            </div>
            {clinicPhotos.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Image size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No clinic photos yet. Upload photos to display on the homepage slideshow.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {clinicPhotos.map((photo) => (
                  <div key={photo.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group relative">
                    <div className="aspect-video bg-gray-100">
                      <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      {editingId === photo.id ? (
                        <div className="space-y-2">
                          <input value={editForm.caption || ''} onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Caption" />
                          <input type="number" value={editForm.sort_order || 0} onChange={(e) => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) })} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Order" />
                          <div className="flex gap-1">
                            <button onClick={() => saveEdit('clinic_photos', photo.id)} disabled={saving} className="bg-teal-600 text-white px-2 py-1 rounded text-xs"><Check size={12} /></button>
                            <button onClick={cancelEdit} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"><X size={12} /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-gray-700 font-medium">{photo.caption}</p>
                            <p className="text-xs text-gray-400">Order: {photo.sort_order}</p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => startEdit(photo)} className="p-1 hover:bg-gray-100 rounded"><Edit3 size={12} className="text-gray-400" /></button>
                            <button onClick={() => deleteItem('clinic_photos', photo.id)} className="p-1 hover:bg-red-50 rounded"><Trash2 size={12} className="text-red-400" /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== SITE SETTINGS ===== */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Site Settings</h2>
            <p className="text-sm text-gray-500 mb-6">Manage contact info, branding, social media, and more.</p>

            {/* Logo Upload */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Logo</h3>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                  {siteSettings.find(s => s.key === 'logo_url')?.value ? (
                    <img src={siteSettings.find(s => s.key === 'logo_url')!.value} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <Image size={32} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageUpload(f, 'site-assets', async (url) => { await saveSetting('logo_url', url); });
                  }} />
                  <button onClick={() => document.getElementById('logo-upload')?.click()} disabled={uploading} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
                    <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Logo'}
                  </button>
                  <p className="text-xs text-gray-400 mt-2">PNG or SVG recommended. Will appear in the header and footer.</p>
                  {siteSettings.find(s => s.key === 'logo_url')?.value && (
                    <button onClick={() => saveSetting('logo_url', '')} className="text-xs text-red-500 hover:text-red-700 mt-1">Remove logo</button>
                  )}
                </div>
              </div>
            </div>

            {/* Settings Groups */}
            <div className="space-y-3">
              {SETTINGS_GROUPS.map((group) => (
                <div key={group.label} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedGroup(expandedGroup === group.label ? '' : group.label)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">{group.label}</h3>
                    {expandedGroup === group.label ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </button>
                  {expandedGroup === group.label && (
                    <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
                      {group.keys.map((key) => {
                        const setting = siteSettings.find(s => s.key === key);
                        if (!setting) return null;
                        return (
                          <div key={key}>
                            <label className="block text-xs font-medium text-gray-500 mb-1">{(group.labels as any)[key] || key}</label>
                            {key === 'map_embed_url' || key === 'meta_description' || key === 'map_link_url' ? (
                              <textarea
                                value={editForm[key] !== undefined ? editForm[key] : setting.value}
                                onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                                rows={3}
                              />
                            ) : key === 'primary_color' || key === 'accent_color' ? (
                              <div className="flex items-center gap-3">
                                <input
                                  type="color"
                                  value={editForm[key] !== undefined ? editForm[key] : setting.value}
                                  onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                                  className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer p-1"
                                />
                                <input
                                  value={editForm[key] !== undefined ? editForm[key] : setting.value}
                                  onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                                  placeholder="#0d9488"
                                />
                              </div>
                            ) : key === 'dark_mode' ? (
                              <select
                                value={editForm[key] !== undefined ? editForm[key] : setting.value}
                                onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                              >
                                <option value="false">Light Mode</option>
                                <option value="true">Dark Mode</option>
                              </select>
                            ) : (
                              <input
                                value={editForm[key] !== undefined ? editForm[key] : setting.value}
                                onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                              />
                            )}
                          </div>
                        );
                      })}
                      <div className="flex gap-2 pt-2">
                        <button onClick={async () => { setSaving(true); for (const key of group.keys) { if (editForm[key] !== undefined) { await supabase.from('site_settings').update({ value: editForm[key] }).eq('key', key); } } await loadData(); setEditForm({}); setSaving(false); }} disabled={saving} className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                          <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
