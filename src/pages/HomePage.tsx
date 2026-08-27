import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowRight, Star, Clock, Shield, Users, ChevronRight, ChevronLeft, Sun, Moon, ShieldCheck } from 'lucide-react';
import { useServices, useTestimonials, useSiteContent, useDoctors, useSiteSettings, useClinicPhotos } from '../hooks/useData';
import { useTheme } from '../hooks/useTheme';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  bio: string;
  image_url?: string;
  experience: string;
  nmc_number?: string;
}

const iconMap: Record<string, string> = {
  stethoscope: '🩺', baby: '👶', 'heart-pulse': '❤️', siren: '🚨',
  'test-tubes': '🧪', activity: '🏃', 'clipboard-check': '📋', video: '📹',
  pill: '💊', syringe: '💉', thermometer: '🌡️', shield: '🛡️',
};

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const needsExpansion = doctor.bio && doctor.bio.length > 120;

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col">

      <div className="w-full h-80 sm:h-96 bg-theme-primary-50 overflow-hidden relative">
        {doctor.image_url ? (
          <img
            src={doctor.image_url}
            alt={doctor.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-teal-50">
            <span className="text-7xl">👨‍⚕️</span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between bg-white">
        <div>
          <div className="mb-2.5">
            <h3 className="inline-block font-bold text-theme-primary text-xl bg-theme-primary-50 px-3 py-1 rounded-md">
              {doctor.name}
            </h3>
          </div>

          <p className="text-gray-500 text-sm font-normal mb-2">{doctor.qualification}</p>

          {doctor.nmc_number && (
            <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-2.5 py-1 rounded-md mb-3">
              <ShieldCheck size={13} className="flex-shrink-0" />
              NMC No: {doctor.nmc_number}
            </div>
          )}

          <div className="text-gray-500 text-sm leading-relaxed">
            <p>
              {isExpanded || !needsExpansion
                ? doctor.bio
                : `${doctor.bio.slice(0, 120)}...`}
            </p>
            {needsExpansion && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-theme-primary font-semibold text-xs mt-1.5 focus:outline-none hover:underline inline-flex items-center gap-0.5"
              >
                {isExpanded ? 'Read Less ▲' : 'Read More ▼'}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 text-xs font-medium text-gray-400">
          <span>{doctor.experience} experience</span>
        </div>
      </div>

    </div>
  );
}

function Slideshow({ photos }: { photos: { url: string; caption: string }[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % photos.length), 4000);
    return () => clearInterval(timer);
  }, [photos.length]);

  if (photos.length === 0) return null;

  return (
    <div className="relative w-full h-64 sm:h-80 lg:h-[420px] rounded-2xl overflow-hidden shadow-xl">
      <img src={photos[current].url} alt={photos[current].caption} className="w-full h-full object-cover transition-opacity duration-700" key={current} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      {photos[current].caption && (
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-sm font-medium drop-shadow-lg">{photos[current].caption}</p>
        </div>
      )}
      {photos.length > 1 && (
        <>
          <button onClick={() => setCurrent((c) => (c - 1 + photos.length) % photos.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center transition-colors">
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button onClick={() => setCurrent((c) => (c + 1) % photos.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center transition-colors">
            <ChevronRight size={20} className="text-white" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {photos.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function HomePage() {
  const { services } = useServices();
  const { testimonials } = useTestimonials();
  const { content: hero } = useSiteContent('hero');
  const { content: cta } = useSiteContent('cta');
  const { doctors } = useDoctors();
  const { settings } = useSiteSettings();
  const { photos: clinicPhotos } = useClinicPhotos();
  const { darkMode, toggleDarkMode } = useTheme();

  const phone = settings?.mobile || settings?.phone || '+977-9801234567';

  const stats = [
    { icon: Users, label: settings?.patients_served || 'Home visits', desc: 'Across the valley' },
    { icon: Shield, label: settings?.doctor_count || 'NMC registered', desc: 'Doctors on panel' },
    { icon: Clock, label: settings?.response_time || 'Same day', desc: 'Visit scheduling' },
    { icon: Star, label: settings?.rating || '24/7', desc: 'Call support' },
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-teal-800 to-teal-950 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-teal-700/50 backdrop-blur-sm border border-teal-600/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {hero?.title || 'Doctor at your doorstep'}
              </h1>
              <p className="text-lg sm:text-xl text-teal-200 leading-relaxed mb-8 max-w-2xl">
                {hero?.body || 'A doctor comes to your home for check-ups, fever, elderly care, or when travel is difficult. Serving Kathmandu, Lalitpur and Bhaktapur.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/appointment"
                  className="inline-flex items-center justify-center gap-2 bg-theme-accent hover:bg-theme-accent-light text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                  Book Home Visit <ArrowRight size={18} />
                </Link>
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-white/20 transition-all duration-300">
                  <Phone size={18} /> Call Now
                </a>
              </div>
            </div>
            {clinicPhotos.length > 0 && (
              <div className="hidden lg:block">
                <Slideshow photos={clinicPhotos} />
              </div>
            )}
          </div>
        </div>
      </section>

      {clinicPhotos.length > 0 && (
        <section className="lg:hidden bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Slideshow photos={clinicPhotos} />
          </div>
        </section>
      )}

      <button onClick={toggleDarkMode}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
        aria-label="Toggle dark mode">
        {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-gray-600" />}
      </button>

      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((item) => (
              <div key={item.desc} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-theme-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon size={22} className="text-theme-primary" />
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Home visits, nursing support, and lab collection when you need them.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 8).map((service) => (
              <div key={service.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 group">
                <div className="w-12 h-12 bg-theme-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-theme-primary-100 transition-colors">
                  <span className="text-2xl">{iconMap[service.icon] || '🩺'}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 text-theme-primary hover:text-theme-primary-700 font-semibold transition-colors">View All Services <ChevronRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Doctors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">NMC-registered doctors available for home visits across the valley.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-theme-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A few notes from families we have visited.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-theme-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-theme-primary">{t.patient_name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.patient_name}</p>
                    <p className="text-gray-400 text-xs">Patient</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gradient-to-r from-teal-700 to-teal-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{cta?.title || 'Need a home visit?'}</h2>
          <p className="text-teal-200 text-lg mb-8 max-w-2xl mx-auto">{cta?.body || 'Call or book online. We will confirm the visit time and send a doctor to your address.'}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/appointment" className="inline-flex items-center justify-center gap-2 bg-theme-accent hover:bg-theme-accent-light text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg">
              Book Appointment <ArrowRight size={18} />
            </Link>
            <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 transition-all duration-300">
              <Phone size={18} /> {phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
