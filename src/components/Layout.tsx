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
      {/* Top Bar */}
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

      {/* Main Header / Navbar */}
     <div className="font-black text-theme-primary-900 text-xl sm:text-2xl lg:text-3xl tracking-tight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-3 group">
              {logoUrl ? (
                <img src={logoUrl} alt={shortName} className="h-10 sm:h-12 w-auto" />
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-theme-primary rounded-lg flex items-center justify-center group-hover:opacity-90 transition-opacity">
                  <Stethoscope size={24} className="text-white" />
                </div>
              )}
              <div className="leading-tight">
                {/* Enlarged and Bolder Company Name */}
                <div className="font-black text-theme-primary-900 text-base sm:text-lg lg:text-xl tracking-tight">
                  {shortName}
                </div>
                <div className="text-[10px] sm:text-xs text-theme-primary font-medium">{tagline}</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
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

            {/* Mobile Menu Button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Toggle menu">
              {menuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
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
              <p className="text-teal-200 text-sm leading-relaxed mb-6">
                {settings?.tagline || 'Home doctor visits in Kathmandu, Lalitpur and Bhaktapur.'}
              </p>

              {/* Social Media Logos Section */}
              <div>
                <h5 className="font-medium text-xs text-teal-200 uppercase tracking-wider mb-3">Connect With Us</h5>
                <div className="flex items-center flex-wrap gap-2.5">
                  {/* Facebook Icon */}
                  {settings?.facebook && (
                    <a
                      href={settings.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-teal-900/80 hover:bg-blue-600 flex items-center justify-center text-teal-200 hover:text-white transition-all duration-200"
                      aria-label="Facebook"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}

                  {/* Instagram Icon */}
                  {settings?.instagram && (
                    <a
                      href={settings.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-teal-900/80 hover:bg-pink-600 flex items-center justify-center text-teal-200 hover:text-white transition-all duration-200"
                      aria-label="Instagram"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}

                  {/* WhatsApp Icon */}
                  {settings?.whatsapp && (
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-teal-900/80 hover:bg-green-500 flex items-center justify-center text-teal-200 hover:text-white transition-all duration-200"
                      aria-label="WhatsApp"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 32 32">
                        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.054 9.378L1.054 31.29l6.118-1.962C9.716 31.06 12.76 32 16.004 32 24.826 32 32 24.826 32 16S24.826 0 16.004 0zm9.31 22.606c-.39 1.1-1.932 2.014-3.164 2.28-.844.18-1.948.324-5.67-1.218-4.762-1.97-7.826-6.81-8.072-7.134-.238-.324-1.932-2.574-1.932-4.906s1.224-3.482 1.66-3.962c.39-.432.9-.566 1.224-.566.15 0 .284.008.406.014.436.018.654.044.942.726.358.846 1.228 2.99 1.334 3.21.108.216.216.504.072.81-.14.312-.264.45-.48.696-.216.246-.422.436-.638.704-.2.236-.424.49-.178.926.246.436 1.094 1.806 2.354 2.928 1.622 1.444 2.99 1.892 3.418 2.1.324.156.71.13.948-.19.3-.39.668-1.034 1.042-1.67.266-.452.602-.508 1.012-.346.416.15 2.634 1.242 3.086 1.466.452.224.752.336.864.52.11.184.11 1.06-.28 2.16z"/>
                      </svg>
                    </a>
                  )}

                  {/* Viber Icon */}
                  {viberNumber && (
                    <a
                      href={`https://viber.click/${viberNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-teal-900/80 hover:bg-purple-600 flex items-center justify-center text-teal-200 hover:text-white transition-all duration-200"
                      aria-label="Viber"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M11.97 0C5.36 0 0 5.36 0 11.97c0 2.22.61 4.3 1.68 6.1L.1 23.32c-.1.35.22.67.57.57l5.25-1.58c1.8 1.07 3.88 1.68 6.05 1.68 6.61 0 11.97-5.36 11.97-11.97S18.58 0 11.97 0zm6.9 16.32c-.31.84-1.56 1.62-2.39 1.81-.57.13-1.31.23-3.81-.8-3.2-1.32-5.26-4.57-5.42-4.78-.16-.21-1.3-1.73-1.3-3.3 0-1.57.82-2.34 1.11-2.66.29-.32.64-.4.85-.4.21 0 .42 0 .6.01.2.01.46-.08.72.54.26.62.89 2.17.97 2.33.08.16.13.35.03.56-.1.21-.15.34-.3.51-.15.17-.32.38-.46.51-.15.15-.31.31-.13.62.18.31.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.49 1.53.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.16.28.1 1.78.84 2.09.99.31.15.52.23.6.36.08.13.08.77-.23 1.61z"/>
                      </svg>
                    </a>
                  )}

                  {/* TikTok Icon */}
                  {tiktokUrl && (
                    <a
                      href={tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-teal-900/80 hover:bg-black flex items-center justify-center text-teal-200 hover:text-white transition-all duration-200"
                      aria-label="TikTok"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.36 1.53-1.33 2.53.01.83.43 1.64 1.11 2.12.78.56 1.8.69 2.7.4 1.02-.32 1.83-1.18 2.08-2.22.1-.5.12-1.02.12-1.53.01-4.71.01-9.42.01-14.13z"/>
                      </svg>
                    </a>
                  )}

                  {/* Twitter / X Icon */}
                  {twitterUrl && (
                    <a
                      href={twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-teal-900/80 hover:bg-gray-900 flex items-center justify-center text-teal-200 hover:text-white transition-all duration-200"
                      aria-label="Twitter / X"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-teal-100">Quick Links</h4>
              <div className="space-y-2.5">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="block text-sm text-teal-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Services Column */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-teal-100">Services</h4>
              <div className="space-y-2.5 text-sm text-teal-300">
                <p>General Home Visit</p>
                <p>Pediatric Care</p>
                <p>Elderly Care</p>
                <p>Emergency Visit</p>
                <p>Lab Sample Collection</p>
              </div>
            </div>

            {/* Contact Details Column */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-teal-100">Contact</h4>
              <div className="space-y-2.5 text-sm text-teal-300">
                <p>{settings?.address || 'Putalisadak, Kathmandu, Nepal'}</p>
                {settings?.phone && <p className="hover:text-white transition-colors">{settings.phone}</p>}
                {settings?.mobile && <p className="hover:text-white transition-colors">{settings.mobile}</p>}
                {settings?.email && <p className="hover:text-white transition-colors">{settings.email}</p>}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-teal-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-teal-400">&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
            <Link to="/admin" className="text-xs text-teal-500 hover:text-teal-300 transition-colors">Admin</Link>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
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