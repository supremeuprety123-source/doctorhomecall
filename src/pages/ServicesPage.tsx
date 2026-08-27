import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';
import { useServices, useDoctors, useTestimonials } from '../hooks/useData';

const iconMap: Record<string, string> = {
  stethoscope: '🩺', baby: '👶', 'heart-pulse': '❤️', siren: '🚨',
  'test-tubes': '🧪', activity: '🏃', 'clipboard-check': '📋', video: '📹',
  pill: '💊', syringe: '💉', thermometer: '🌡️', shield: '🛡️',
};

export default function ServicesPage() {
  const { services } = useServices();
  const { doctors } = useDoctors();
  const { testimonials } = useTestimonials();

  return (
    <div>
      <section className="bg-gradient-to-br from-teal-800 to-teal-950 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Our Services</h1>
            <p className="text-xl text-teal-200">Doctor visits, nursing support and sample collection at your home.</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 group">
                <div className="w-14 h-14 bg-theme-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-theme-primary-100 transition-colors">
                  <span className="text-3xl">{iconMap[service.icon] || '🩺'}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Three steps from call to visit.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Book Online or Call', desc: 'Use the booking form or call us. Tell us the problem and preferred time.' },
              { step: '2', title: 'Doctor Assigned', desc: 'We assign a suitable doctor for your area and concern.' },
              { step: '3', title: 'Care at Home', desc: 'The doctor visits your address, examines, advises, and writes medicines if needed.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-theme-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Doctors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Doctors available for home visits.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
                    {doctor.image_url ? <img src={doctor.image_url} alt={doctor.name} className="w-full h-full object-cover" /> : <span className="text-4xl">👨‍⚕️</span>}
                  </div>
                  {doctor.available && (
                    <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                      <CheckCircle size={12} /> Available
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-lg">{doctor.name}</h3>
                  <p className="text-theme-primary font-medium text-sm mt-1">{doctor.specialty}</p>
                  <div className="mt-3 space-y-1.5">
                    <p className="text-gray-500 text-sm flex items-center gap-2"><CheckCircle size={14} className="text-theme-primary flex-shrink-0" />{doctor.qualification}</p>
                    <p className="text-gray-500 text-sm flex items-center gap-2"><CheckCircle size={14} className="text-theme-primary flex-shrink-0" />{doctor.experience} experience</p>
                  </div>
                  <p className="text-gray-500 text-sm mt-3 leading-relaxed">{doctor.bio}</p>
                  <Link to="/appointment" className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-theme-primary hover:bg-theme-primary-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm">
                    Book Visit <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-theme-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Patient Testimonials</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
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
    </div>
  );
}
