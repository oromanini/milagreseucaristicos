import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { MapPin, Calendar } from 'lucide-react';

export const MiracleCard = ({ miracle }) => {
  const { language, t } = useLanguage();
  const mainImage = miracle.media?.find((item) => item.type === 'image' && item.url)?.url;
  
  // Get translated content if available
  const getTranslated = (field) => {
    if (language !== 'pt' && miracle.translations?.[language]?.[field]) {
      return miracle.translations[language][field];
    }
    return miracle[field];
  };

  const name = getTranslated('name');

  return (
    <Link
      to={`/miracle/${miracle.id}`}
      className="block card-hover group h-full"
      data-testid={`miracle-card-${miracle.id}`}
    >
      <div className="bg-[#121214] border border-[rgba(212,175,55,0.2)] p-6 h-[430px] flex flex-col rounded-2xl">
        {mainImage && (
          <div className="flex justify-center mb-4">
            <img
              src={mainImage}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[rgba(212,175,55,0.35)] shadow-[0_0_0_4px_rgba(255,255,255,0.04)]"
              loading="lazy"
            />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-3xl">{miracle.country_flag}</span>
          <span
            className={`text-xs uppercase tracking-wider px-2 py-1 ${
              miracle.status === 'recognized' ? 'badge-recognized' : 'badge-investigating'
            }`}
          >
            {miracle.status === 'recognized' ? t('recognized') : t('investigating')}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl text-[#E5E5E5] group-hover:text-[#D4AF37] transition-colors duration-300 mb-3 line-clamp-2 min-h-[56px]">
          {name}
        </h3>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 text-xs text-[#A1A1AA] uppercase tracking-wide mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{miracle.city}, {miracle.country}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{t('century')} {miracle.century}</span>
          </div>
        </div>

        {/* Description preview */}
        <p className="text-[#A1A1AA] text-sm leading-relaxed line-clamp-4 flex-grow">
          {getTranslated('phenomenon_description')}
        </p>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-[#27272A]">
          <span className="text-[#D4AF37] text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300 inline-block">
            {language === 'pt' ? 'Ler mais' : language === 'es' ? 'Leer más' : 'Read more'} →
          </span>
        </div>
      </div>
    </Link>
  );
};
