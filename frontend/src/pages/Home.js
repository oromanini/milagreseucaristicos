import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { MiracleCard } from '../components/MiracleCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { MusicPlayer } from '../components/MusicPlayer';
import { API_URL } from '../lib/api';

const API = API_URL;

const HERO_IMAGE = '/bg.png';

const ROTATING_HERO_PHRASES_PT = [
  'Descubra os milagres eucarísticos reconhecidos pela Igreja Católica, documentados pela ciência e preservados pela história.',
  'Explore os milagres eucarísticos onde a fé encontra a evidência científica e a tradição se torna prova histórica.',
  'Testemunhe os fenômenos eucarísticos que desafiam a lógica, validados por análises clínicas e ratificados pela Santa Sé.',
  'Mergulhe na história dos prodígios eucarísticos: mistérios sagrados que resistiram ao tempo e ao escrutínio da ciência.'
];

export const Home = () => {
  const { language, t } = useLanguage();
  const [miracles, setMiracles] = useState([]);
  const [filters, setFilters] = useState({ countries: [], centuries: [] });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, recognized: 0, investigating: 0, countries: 0 });
  
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [century, setCentury] = useState('');
  const [showInvestigating, setShowInvestigating] = useState(false);
  const [heroPhraseIndex, setHeroPhraseIndex] = useState(0);
  const [typedHeroDescription, setTypedHeroDescription] = useState('');
  const [isDeletingHeroText, setIsDeletingHeroText] = useState(false);

  const heroDescription = language === 'pt'
    ? typedHeroDescription
    : t('heroDescription');

  const fetchMiracles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (country) params.append('country', country);
      if (century) params.append('century', century);
      if (!showInvestigating) params.append('status', 'recognized');
      
      const response = await axios.get(`${API}/miracles?${params.toString()}`);
      setMiracles(response.data);
    } catch (error) {
      console.error('Error fetching miracles:', error);
    } finally {
      setLoading(false);
    }
  }, [search, country, century, showInvestigating]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filtersRes, statsRes] = await Promise.all([
          axios.get(`${API}/filters`),
          axios.get(`${API}/stats`)
        ]);
        setFilters(filtersRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchMiracles();
  }, [fetchMiracles]);

  useEffect(() => {
    if (language !== 'pt') {
      setHeroPhraseIndex(0);
      setTypedHeroDescription('');
      setIsDeletingHeroText(false);
      return;
    }

    const currentPhrase = ROTATING_HERO_PHRASES_PT[heroPhraseIndex];
    let timeoutDelay = isDeletingHeroText ? 20 : 35;

    if (!isDeletingHeroText && typedHeroDescription.length < currentPhrase.length) {
      timeoutDelay = 35;
    } else if (!isDeletingHeroText && typedHeroDescription.length === currentPhrase.length) {
      timeoutDelay = 1400;
    } else if (isDeletingHeroText && typedHeroDescription.length > 0) {
      timeoutDelay = 20;
    } else {
      timeoutDelay = 250;
    }

    const timeout = window.setTimeout(() => {
      if (!isDeletingHeroText && typedHeroDescription.length < currentPhrase.length) {
        setTypedHeroDescription(currentPhrase.slice(0, typedHeroDescription.length + 1));
        return;
      }

      if (!isDeletingHeroText && typedHeroDescription.length === currentPhrase.length) {
        setIsDeletingHeroText(true);
        return;
      }

      if (isDeletingHeroText && typedHeroDescription.length > 0) {
        setTypedHeroDescription(currentPhrase.slice(0, typedHeroDescription.length - 1));
        return;
      }

      setIsDeletingHeroText(false);
      setHeroPhraseIndex((prev) => (prev + 1) % ROTATING_HERO_PHRASES_PT.length);
    }, timeoutDelay);

    return () => window.clearTimeout(timeout);
  }, [language, heroPhraseIndex, typedHeroDescription, isDeletingHeroText]);

  const scrollToMiracles = () => {
    document.getElementById('miracles-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Monstrance"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-gold-gradient mb-4 pb-2 pt-1 leading-[1.2] inline-block">
            {t('heroTitle')}
          </h1>
          <p className="text-[color:var(--gold)] text-lg sm:text-xl font-serif mb-6">
            {t('heroSubtitle')}
          </p>
          <p className="text-white text-base sm:text-lg max-w-2xl mx-auto mb-8 min-h-[56px] sm:min-h-[72px]">
            {heroDescription}
            {language === 'pt' && (
              <span className="inline-block w-[2px] h-[1em] bg-[#D4AF37] ml-1 align-[-2px] animate-pulse" aria-hidden="true" />
            )}
          </p>
          <Button
            onClick={scrollToMiracles}
            className="bg-[#D4AF37] hover:bg-[#A68A2D] text-[#0A0A0B] uppercase tracking-widest px-8 py-6 elegant-glow-button transition-shadow duration-500"
            data-testid="explore-btn"
          >
            {t('explore')}
          </Button>
        </div>

        <div className="absolute bottom-6 sm:bottom-8 inset-x-0 flex justify-center">
          <button
            onClick={scrollToMiracles}
            className="text-center text-[color:var(--text-secondary)] animate-bounce"
            data-testid="scroll-indicator"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-widest">{t('scrollHint')}</span>
              <ChevronDown className="w-6 h-6" />
            </div>
          </button>
        </div>

        <div className="absolute bottom-24 sm:bottom-24 inset-x-0 px-4 flex justify-center">
          <MusicPlayer className="w-full max-w-md" />
        </div>
      </section>

      <section className="bg-[#121214] py-12 border-y border-[#27272A]" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="font-serif text-3xl text-[color:var(--gold)]">{stats.total}</div>
              <div className="text-[color:var(--text-secondary)] text-xs uppercase tracking-widest mt-1">{t('miracles')}</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl text-[color:var(--gold)]">{stats.recognized}</div>
              <div className="text-[color:var(--text-secondary)] text-xs uppercase tracking-widest mt-1">{t('recognized')}</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl text-[color:var(--gold)]">{stats.investigating}</div>
              <div className="text-[color:var(--text-secondary)] text-xs uppercase tracking-widest mt-1">{t('investigating')}</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl text-[color:var(--gold)]">{stats.countries}</div>
              <div className="text-[color:var(--text-secondary)] text-xs uppercase tracking-widest mt-1">Países</div>
            </div>
          </div>
        </div>
      </section>

      <section id="miracles-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" data-testid="miracles-section">
        <div className="mb-12 space-y-6" data-testid="filters-section">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--text-muted)]" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#121214] border-[#27272A] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-muted)]"
              data-testid="search-input"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <Select value={country || "all"} onValueChange={(v) => setCountry(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[180px] bg-[#121214] border-[#27272A] text-[color:var(--text-primary)]" data-testid="country-filter">
                <SelectValue placeholder={t('allCountries')} />
              </SelectTrigger>
              <SelectContent className="bg-[#121214] border-[#27272A]">
                <SelectItem value="all" className="text-[color:var(--text-primary)]">{t('allCountries')}</SelectItem>
                {filters.countries.map(c => (
                  <SelectItem key={c} value={c} className="text-[color:var(--text-primary)]">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={century || "all"} onValueChange={(v) => setCentury(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[180px] bg-[#121214] border-[#27272A] text-[color:var(--text-primary)]" data-testid="century-filter">
                <SelectValue placeholder={t('allCenturies')} />
              </SelectTrigger>
              <SelectContent className="bg-[#121214] border-[#27272A]">
                <SelectItem value="all" className="text-[color:var(--text-primary)]">{t('allCenturies')}</SelectItem>
                {filters.centuries.map(c => (
                  <SelectItem key={c} value={c} className="text-[color:var(--text-primary)]">{t('century')} {c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-investigating"
                checked={showInvestigating}
                onCheckedChange={setShowInvestigating}
                data-testid="investigating-switch"
              />
              <Label htmlFor="show-investigating" className="text-[color:var(--text-secondary)] text-sm">
                {t('showInvestigating')}
              </Label>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[color:var(--gold)] animate-spin" />
          </div>
        ) : miracles.length === 0 ? (
          <div className="text-center py-20" data-testid="no-results">
            <p className="text-[color:var(--text-secondary)] text-lg">{t('noResults')}</p>
          </div>
        ) : (
          <div className="bento-grid" data-testid="miracles-grid">
            {miracles.map((miracle, index) => (
              <div
                key={miracle.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MiracleCard miracle={miracle} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
