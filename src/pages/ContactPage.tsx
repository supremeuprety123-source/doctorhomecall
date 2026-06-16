import { Phone, Mail, MapPin, Clock, MessageCircle, ExternalLink, Navigation } from 'lucide-react';
import { useSiteSettings, useSiteContent } from '../hooks/useData';

export default function ContactPage() {
  const { content: contact } = useSiteContent('contact');
  const { settings } = useSiteSettings();

  const mapUrl = settings.map_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.062483863493!2d85.3305599!3d27.7153664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1be5ebf59565%3A0x142e77b54a7b3502!2sDoctors%20House%20Call%20Service%20Nepal!5e0!3m2!1sen!2snp!4v1715900000000!5m2!1sen!2snp';
  const mapLinkUrl = settings.map_link_url || 'https://www.google.com/maps/place/Doctors+House+Call+Service+Nepal/@27.7153664,85.3305599,17z';

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: settings.phone || '+977-01-4567890', href: `tel:${(settings.phone || '+977-01-4567890').replace(/[^0-9+]/g, '')}` },
    { icon: Phone, label: 'Mobile', value: settings.mobile || '+977-9801234567', href: `tel:${(settings.mobile || '+977-9801234567').replace(/[^0-9+]/g, '')}` },
    { icon: Mail, label: 'Email', value: settings.email || 'info@doctorhomecall.com.np', href: `mailto:${settings.email || 'info@doctorhomecall.com.np'}` },
    { icon: MapPin, label: 'Address', value: settings.address || 'Putalisadak, Kathmandu, Nepal', href: mapLinkUrl, external: true },
    { icon: Clock, label: 'Hours', value: '24/7 — We never close', href: '#' },
    { icon: MessageCircle, label: 'WhatsApp', value: settings.whatsapp || '+977-9801234567', href: `https://wa.me/${(settings.whatsapp || '+9779801234567').replace(/[^0-9]/g, '')}`, external: true },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-teal-800 to-teal-950 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-xl text-teal-200">{contact?.subtitle || 'We are here to help — reach out anytime.'}</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-3">
                {contactInfo.map((item) => (
                  <a key={item.label} href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-11 h-11 bg-theme-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-theme-primary-100 transition-colors">
                      <item.icon size={20} className="text-theme-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="font-medium text-gray-900">{item.value}</p>
                    </div>
                    {item.external && <ExternalLink size={16} className="text-gray-400 flex-shrink-0 mt-1" />}
                  </a>
                ))}
              </div>
              <div className="mt-8 p-6 bg-theme-primary-50 rounded-2xl">
                <h3 className="font-bold text-theme-primary-900 mb-2">Need Urgent Help?</h3>
                <p className="text-sm text-theme-primary-700 mb-4">For medical emergencies, please call us directly. Our team is available 24/7.</p>
                <a href={`tel:${(settings.mobile || '+977-9801234567').replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-2 bg-theme-primary hover:bg-theme-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                  <Phone size={18} /> Call Now
                </a>
              </div>
            </div>
            <div>
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="400"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              </div>
              <a
                href={mapLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-theme-primary hover:bg-theme-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors w-full justify-center"
              >
                <Navigation size={18} />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
