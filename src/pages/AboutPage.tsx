import { Heart, Shield, Clock, Award, Users, Target } from 'lucide-react';
import { useSiteContent, useSiteSettings } from '../hooks/useData';

export default function AboutPage() {
  const { content: about } = useSiteContent('about');
  const { settings } = useSiteSettings();

  const values = [
    { icon: Heart, title: 'Compassion', desc: 'We treat every patient with empathy and genuine care, understanding their unique needs.' },
    { icon: Shield, title: 'Trust', desc: 'Building lasting relationships through transparent, honest, and reliable healthcare services.' },
    { icon: Clock, title: 'Accessibility', desc: 'Making quality healthcare available 24/7, eliminating barriers of distance and time.' },
    { icon: Award, title: 'Excellence', desc: 'Maintaining the highest standards of medical care with continuous professional development.' },
  ];

  const milestones = [
    { year: '2018', event: 'Founded in Kathmandu with a team of 5 doctors' },
    { year: '2019', event: 'Expanded to cover entire Kathmandu Valley' },
    { year: '2020', event: 'Served 5,000+ patients during COVID-19 pandemic' },
    { year: '2021', event: 'Launched telemedicine and lab collection services' },
    { year: '2022', event: 'Team grew to 30+ medical professionals' },
    { year: '2023', event: 'Reached 10,000+ patients served milestone' },
    { year: '2024', event: 'Introduced physiotherapy and post-surgical care' },
    { year: '2025', event: 'Expanding to Pokhara and Chitwan regions' },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-teal-800 to-teal-950 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{about?.title || 'About Us'}</h1>
            <p className="text-xl text-teal-200">{about?.subtitle || 'Trusted Home Healthcare Since 2018'}</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {about?.body || 'Doctor Home Call Service Nepal Pvt. Ltd. is a pioneering healthcare organization dedicated to making quality medical care accessible to everyone in the comfort of their homes. Founded in 2018, we have served over 10,000 patients across Kathmandu Valley with a team of experienced and compassionate doctors.'}
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to eliminate the barriers between patients and healthcare by bringing the clinic to your living room. Whether it is a routine check-up, pediatric care, elderly care, or an urgent medical need, our team is just a call away.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-theme-primary-50 rounded-2xl p-6 text-center">
                <Users size={32} className="text-theme-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-theme-primary-900">{settings.patients_served || '10K+'}</div>
                <div className="text-sm text-gray-500 mt-1">Patients Served</div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-6 text-center">
                <Shield size={32} className="text-amber-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-amber-900">{settings.doctor_count || '50+'}</div>
                <div className="text-sm text-gray-500 mt-1">Expert Doctors</div>
              </div>
              <div className="bg-theme-primary-50 rounded-2xl p-6 text-center">
                <Clock size={32} className="text-theme-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-theme-primary-900">24/7</div>
                <div className="text-sm text-gray-500 mt-1">Availability</div>
              </div>
              <div className="bg-amber-50 rounded-2xl p-6 text-center">
                <Target size={32} className="text-amber-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-amber-900">{settings.years_service || '7+'}</div>
                <div className="text-sm text-gray-500 mt-1">Years of Service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide every interaction and decision we make.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
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

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-theme-primary-100" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className={`relative flex items-start gap-6 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right' : ''} pl-12 lg:pl-0`}>
                    <div className="bg-gray-50 rounded-xl p-4 inline-block">
                      <span className="text-theme-primary font-bold text-sm">{m.year}</span>
                      <p className="text-gray-700 text-sm mt-1">{m.event}</p>
                    </div>
                  </div>
                  <div className="absolute left-2 lg:left-1/2 lg:-translate-x-1/2 w-5 h-5 bg-theme-primary rounded-full border-4 border-white shadow-sm" />
                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
