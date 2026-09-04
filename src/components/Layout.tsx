import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, Stethoscope, Sun, Moon } from 'lucide-react';
import { useSiteSettings } from '../hooks/useData';
import { useTheme } from '../hooks/useTheme';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/appointment', label: 'Book Appointment' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  const companyName = settings?.company_name || 'Doctors Home Care At Door Step Private Limited';
  const shortName = 'Doctors Home Care At Door Step';
  const tagline = settings?.tagline || 'Doctor visits at your home';
  const phone = settings?.mobile || settings?.phone || '+977-9818863902';
  const logoUrl = settings?.logo_url || '';

  const whatsappNumber = settings?.whatsapp || settings?.mobile || '9818863902';
  const viberNumber = settings?.viber || '';
  const tiktokUrl = settings?.tiktok || '';
  const twitterUrl = settings?.twitter || settings?.x_url || '';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-theme-primary-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10">
          <div className="flex items-center gap-4">
            <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <Phone size={13} />
              <span>{phone}</span>
            </a>
            <span className="hidden sm:inline opacity-50">|</span>
            <span className="hidden sm:inline">24/7 Home Visit Service</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} className="p-1.5 rounded hover:bg-white/10 transition-colors" aria-label="Toggle dark mode">
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <Link to="/appointment" className="bg-theme-accent hover:bg-theme-accent-light text-white px-4 py-1 rounded text-xs font-semibold transition-colors">
              Book Now
            </Link>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-md' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2.5 group">
              {logoUrl ? (
                <img src={logoUrl} alt={shortName} className="h-10 w-auto" />
              ) : (
                <div className="w-10 h-10 bg-theme-primary rounded-lg flex items-center justify-center group-hover:opacity-90 transition-opacity">
                  <Stethoscope size={22} className="text-white" />
                </div>
              )}
              <div className="leading-tight">
                <div className="font-bold text-theme-primary-900 text-sm lg:text-base tracking-tight">{shortName}</div>
                <div className="text-[10px] lg:text-xs text-theme-primary font-medium">{tagline}</div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}
                  className={`px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.to) ? 'bg-theme-primary-50 text-theme-primary' : 'text-gray-600 hover:text-theme-primary hover:bg-gray-50'
                  }`}>
                  {link.label}
                </Link>
              ))}
              <button onClick={toggleDarkMode} className="ml-2 p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Toggle dark mode">
                {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-gray-500" />}
              </button>
            </nav>

            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Toggle menu">
              {menuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
            </button>
          </div>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'}`}>
          <nav className="px-4 py-3 bg-white space-y-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'bg-theme-primary-50 text-theme-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-theme-primary'
                }`}>
                {link.label}
              </Link>
            ))}
            <button onClick={toggleDarkMode} className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-theme-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                {logoUrl ? (
                  <img src={logoUrl} alt={shortName} className="h-9 w-auto brightness-0 invert" />
                ) : (
                  <div className="w-9 h-9 bg-theme-primary rounded-lg flex items-center justify-center">
                    <Stethoscope size={20} className="text-white" />
                  </div>
                )}
                <div className="leading-tight">
                  <div className="font-bold text-sm">{shortName}</div>
                  <div className="text-[10px] text-teal-300">{tagline}</div>
                </div>
              </div>
              <p className="text-teal-200 text-sm leading-relaxed">
                {settings?.tagline || 'Home doctor visits in Kathmandu, Lalitpur and Bhaktapur.'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-teal-100">Quick Links</h4>
              <div className="space-y-2.5">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="block text-sm text-teal-300 hover:text-white transition-colors">{link.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-teal-100">Services</h4>
              <div className="space-y-2.5 text-sm text-teal-300">
                <p>General Home Visit</p><p>Pediatric Care</p><p>Elderly Care</p><p>Emergency Visit</p><p>Lab Sample Collection</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-teal-100">Contact</h4>
              <div className="space-y-2.5 text-sm text-teal-300">
                <p>{settings?.address || 'Putalisadak, Kathmandu, Nepal'}</p>
                {settings?.phone && <p className="hover:text-white transition-colors">{settings.phone}</p>}
                {settings?.mobile && <p className="hover:text-white transition-colors">{settings.mobile}</p>}
                {settings?.email && <p className="hover:text-white transition-colors">{settings.email}</p>}
                
                              {settings?.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">Facebook</a>}
                {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">Instagram</a>}
                
                              {settings?.whatsapp && (
                  <a 
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block hover:text-white transition-colors"
                  >
                    WhatsApp
                  </a>
                )}

                              {viberNumber && (
                  <a 
                    href={`https://viber.click/${viberNumber.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block hover:text-white transition-colors"
                  >
                    Viber
                  </a>
                )}

                              {tiktokUrl && (
                  <a 
                    href={tiktokUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block hover:text-white transition-colors"
                  >
                    TikTok
                  </a>
                )}

                              {twitterUrl && (
                  <a 
                    href={twitterUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block hover:text-white transition-colors"
                  >
                    Twitter / X
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-teal-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-teal-400">&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
            <Link to="/admin" className="text-xs text-teal-500 hover:text-teal-300 transition-colors">Admin</Link>
          </div>
        </div>
      </footer>

      <a
        href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%2C%20I%20would%20like%20to%20book%20a%20home%20visit.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.054 9.378L1.054 31.29l6.118-1.962C9.716 31.06 12.76 32 16.004 32 24.826 32 32 24.826 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.014-3.164 2.28-.844.18-1.948.324-5.67-1.218-4.762-1.97-7.826-6.81-8.072-7.134-.238-.324-1.932-2.574-1.932-4.906s1.224-3.482 1.66-3.962c.39-.432.9-.566 1.224-.566.15 0 .284.008.406.014.436.018.654.044.942.726.358.846 1.228 2.99 1.334 3.21.108.216.216.504.072.81-.14.312-.264.45-.48.696-.216.246-.422.436-.638.704-.2.236-.424.49-.178.926.246.436 1.094 1.806 2.354 2.928 1.622 1.444 2.99 1.892 3.418 2.1.324.156.71.13.948-.19.3-.39.668-1.034 1.042-1.67.266-.452.602-.508 1.012-.346.416.15 2.634 1.242 3.086 1.466.452.224.752.336.864.52.11.184.11 1.06-.28 2.16z"/>
        </svg>
      </a>
    </div>
  );
}