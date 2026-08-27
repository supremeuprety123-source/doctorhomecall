import { Heart, Shield, Clock, Users } from 'lucide-react';
import { useSiteContent, useSiteSettings } from '../hooks/useData';

export default function AboutPage() {
  const { content: about } = useSiteContent('about');
  const { settings } = useSiteSettings();

  const values = [
    { icon: Heart, title: 'Patient first', desc: 'We listen carefully and explain clearly so families know what is happening and what comes next.' },
    { icon: Shield, title: 'Registered doctors', desc: 'Visits are done by NMC-registered doctors. You can ask for registration details when booking.' },
    { icon: Clock, title: 'When you need us', desc: 'Call for same-day or scheduled visits. We cover Kathmandu, Lalitpur and Bhaktapur.' },
    { icon: Users, title: 'Care at home', desc: 'Useful for elderly parents, young children, post-illness recovery, or when travel is hard.' },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-teal-800 to-teal-950 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{about?.title || 'About us'}</h1>
            <p className="text-xl text-teal-200">{about?.subtitle || 'Home doctor visits in Kathmandu Valley'}</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Who we are</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {about?.body || 'Doctors Home Care At Door Step Private Limited arranges doctor home visits, basic nursing support and lab sample collection in Kathmandu, Lalitpur and Bhaktapur. We help when someone is too unwell to travel, needs a routine check at home, or prefers care without a hospital wait.'}
              </p>
              <p className="text-gray-600 leading-relaxed">
                Book by phone or through the website. We confirm the time, send a suitable doctor, and follow up if needed. For life-threatening emergencies, call emergency services first.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-theme-primary-50 rounded-2xl p-6 text-center">
                <Users size={32} className="text-theme-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-theme-primary-900">{settings.patients_served || 'Home visits'}</div>
                <div className="text-sm text-gray-500 mt-1">Across the valley</div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-6 text-center">
                <Shield size={32} className="text-amber-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-amber-900">{settings.doctor_count || 'NMC panel'}</div>
                <div className="text-sm text-gray-500 mt-1">Doctors</div>
              </div>
              <div className="bg-theme-primary-50 rounded-2xl p-6 text-center">
                <Clock size={32} className="text-theme-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-theme-primary-900">24/7</div>
                <div className="text-sm text-gray-500 mt-1">Phone support</div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-6 text-center">
                <Heart size={32} className="text-amber-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-amber-900">KTM · LTP · BKT</div>
                <div className="text-sm text-gray-500 mt-1">Service area</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How we work</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Simple principles for every home visit.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-theme-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <v.icon size={24} className="text-theme-primary" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
