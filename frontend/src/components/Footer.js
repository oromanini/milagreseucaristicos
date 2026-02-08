import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0A0A0B] border-t border-[#27272A] mt-20" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Milagres Eucarísticos" className="w-9 h-9 object-contain" loading="lazy" />
              <span className="font-serif text-xl text-[#D4AF37]">Milagres Eucarísticos</span>
            </div>
            <p className="text-[#A1A1AA] text-sm leading-relaxed">
              {t('footerMission')}
            </p>
            <p className="text-[#52525B] text-xs italic">
              {t('footerInspiration')}
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-[#E5E5E5] uppercase tracking-widest text-sm">Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-[#A1A1AA] hover:text-[#D4AF37] text-sm transition-colors">
                {t('home')}
              </Link>
              <Link to="/about" className="text-[#A1A1AA] hover:text-[#D4AF37] text-sm transition-colors">
                {t('about')}
              </Link>
              <Link to="/disclaimer" className="text-[#A1A1AA] hover:text-[#D4AF37] text-sm transition-colors">
                {t('disclaimer')}
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-serif text-[#E5E5E5] uppercase tracking-widest text-sm">Legal</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/privacy" className="text-[#A1A1AA] hover:text-[#D4AF37] text-sm transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link to="/terms" className="text-[#A1A1AA] hover:text-[#D4AF37] text-sm transition-colors">
                {t('termsOfUse')}
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-[#27272A] mt-8 pt-8 text-center">
          <p className="text-[#52525B] text-xs">
            © {new Date().getFullYear()} Milagres Eucarísticos. Ad Majorem Dei Gloriam.
          </p>
        </div>
      </div>
    </footer>
  );
};
