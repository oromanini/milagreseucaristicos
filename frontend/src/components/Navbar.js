import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';

const languages = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentLang = languages.find(l => l.code === language);

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/about', label: t('about') },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" data-testid="navbar-logo">
            <img
              src="/logo.png"
              alt="Milagres Eucarísticos"
              className="h-12 w-12 object-contain"
            />
            <span className="font-serif text-lg text-gold-gradient hidden sm:block">
              Milagres Eucarísticos
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`uppercase text-xs tracking-widest transition-colors duration-300 ${
                  isActive(link.path) ? 'text-[#D4AF37]' : 'text-[#A1A1AA] hover:text-[#D4AF37]'
                }`}
                data-testid={`nav-link-${link.path.replace('/', '') || 'home'}`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to="/admin"
                className={`uppercase text-xs tracking-widest transition-colors duration-300 ${
                  location.pathname.startsWith('/admin') ? 'text-[#D4AF37]' : 'text-[#A1A1AA] hover:text-[#D4AF37]'
                }`}
                data-testid="nav-link-admin"
              >
                {t('admin')}
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-[#A1A1AA] hover:text-[#D4AF37]" data-testid="language-selector">
                  <Globe className="w-4 h-4 mr-2" />
                  <span>{currentLang?.flag}</span>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#121214] border-[#27272A]">
                {languages.map(lang => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`cursor-pointer ${language === lang.code ? 'text-[#D4AF37]' : 'text-[#E5E5E5]'}`}
                    data-testid={`language-option-${lang.code}`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth */}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-[#A1A1AA] hover:text-[#D4AF37] uppercase text-xs tracking-widest"
                data-testid="logout-btn"
              >
                {t('logout')}
              </Button>
            ) : (
              <Link to="/login" data-testid="login-link">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 uppercase text-xs tracking-widest"
                >
                  {t('login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#E5E5E5]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0B] border-t border-[#27272A]" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block uppercase text-sm tracking-widest ${
                  isActive(link.path) ? 'text-[#D4AF37]' : 'text-[#A1A1AA]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block uppercase text-sm tracking-widest text-[#A1A1AA]"
              >
                {t('admin')}
              </Link>
            )}

            <div className="flex items-center space-x-4 pt-4 border-t border-[#27272A]">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`text-lg ${language === lang.code ? 'opacity-100' : 'opacity-50'}`}
                >
                  {lang.flag}
                </button>
              ))}
            </div>

            {isAuthenticated ? (
              <Button
                variant="ghost"
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="w-full text-[#A1A1AA]"
              >
                {t('logout')}
              </Button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-[#D4AF37]/30 text-[#D4AF37]">
                  {t('login')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
