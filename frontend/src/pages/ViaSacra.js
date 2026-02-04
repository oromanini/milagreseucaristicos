import { User, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';

export const ViaSacra = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F9F4EE] pt-24 pb-16 text-[#4B3B2A]" data-testid="via-sacra-page">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#5B2C83]">{t('viaSacraTitle')}</h1>
            <p className="mt-4 text-lg text-[#6B5A4A]">{t('viaSacraSubtitle')}</p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#D6C7B8] bg-white/80 p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-[#3E2A1A]">{t('viaSacraSoloTitle')}</h2>
            <p className="mt-4 text-base text-[#6B5A4A]">{t('viaSacraSoloDescription')}</p>
            <Button className="mt-8 w-full bg-[#4B0072] text-white hover:bg-[#3B005A]">
              <User className="mr-2 h-4 w-4" />
              {t('viaSacraSoloButton')}
            </Button>
          </div>

          <div className="rounded-2xl border border-[#D6C7B8] bg-white/80 p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-[#3E2A1A]">{t('viaSacraGroupTitle')}</h2>
            <p className="mt-4 text-base text-[#6B5A4A]">{t('viaSacraGroupDescription')}</p>
            <Button className="mt-8 w-full bg-[#8E3BF4] text-white hover:bg-[#732EC4]">
              <Users className="mr-2 h-4 w-4" />
              {t('viaSacraGroupButton')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
