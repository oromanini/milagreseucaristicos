import { useState, useEffect } from 'react';
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

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HERO_IMAGE = 'https://images.unsplash.com/photo-1574786790595-94c66b8740fd';

export const Home = () => {
  const { t } = useLanguage();
  const [miracles, setMiracles] = useState([]);
  const [filters, setFilters] = useState({ countries: [], centuries: [] });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, recognized: 0, investigating: 0, countries: 0 });
  
  // Filter state
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [century, setCentury] = useState('');
  const [showInvestigating, setShowInvestigating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchMiracles();
  }, [search, country, century, showInvestigating]);

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

  const fetchMiracles = async () => {
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
  };

  const scrollToMiracles = () => {
    document.getElementById('miracles-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Monstrance"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#E5E5E5] mb-4">
            {t('heroTitle')}
          </h1>
          <p className="text-[#D4AF37] text-lg sm:text-xl font-serif mb-6">
            {t('heroSubtitle')}
          </p>
          <p className="text-[#A1A1AA] text-base sm:text-lg max-w-2xl mx-auto mb-8">
            {t('heroDescription')}
          </p>
          <Button
            onClick={scrollToMiracles}
            className="bg-[#D4AF37] hover:bg-[#A68A2D] text-[#0A0A0B] uppercase tracking-widest px-8 py-6"
            data-testid="explore-btn"
          >
            {t('explore')}
          </Button>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToMiracles}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#A1A1AA] animate-bounce"
          data-testid="scroll-indicator"
        >
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest mb-2">{t('scrollToDiscover')}</span>
            <ChevronDown className="w-6 h-6" />
          </div>
        </button>
      </section>

      {/* Stats Section */}
      <section className="bg-[#121214] py-12 border-y border-[#27272A]" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="font-serif text-3xl text-[#D4AF37]">{stats.total}</div>
              <div className="text-[#A1A1AA] text-xs uppercase tracking-widest mt-1">
                {t('miracles')}
              </div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl text-[#D4AF37]">{stats.recognized}</div>
              <div className="text-[#A1A1AA] text-xs uppercase tracking-widest mt-1">
                {t('recognized')}
              </div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl text-[#D4AF37]">{stats.investigating}</div>
              <div className="text-[#A1A1AA] text-xs uppercase tracking-widest mt-1">
                {t('investigating')}
              </div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl text-[#D4AF37]">{stats.countries}</div>
              <div className="text-[#A1A1AA] text-xs uppercase tracking-widest mt-1">
                {t('allCountries').replace('Todos os ', '').replace('All ', '').replace('Todos los ', '')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Miracles Section */}
      <section id="miracles-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" data-testid="miracles-section">
        {/* Filters */}
        <div className="mb-12 space-y-6" data-testid="filters-section">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#121214] border-[#27272A] text-[#E5E5E5] placeholder:text-[#52525B]"
              data-testid="search-input"
            />
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap gap-4 items-center">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-[180px] bg-[#121214] border-[#27272A] text-[#E5E5E5]" data-testid="country-filter">
                <SelectValue placeholder={t('allCountries')} />
              </SelectTrigger>
              <SelectContent className="bg-[#121214] border-[#27272A]">
                <SelectItem value="" className="text-[#E5E5E5]">{t('allCountries')}</SelectItem>
                {filters.countries.map(c => (
                  <SelectItem key={c} value={c} className="text-[#E5E5E5]">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={century} onValueChange={setCentury}>
              <SelectTrigger className="w-[180px] bg-[#121214] border-[#27272A] text-[#E5E5E5]" data-testid="century-filter">
                <SelectValue placeholder={t('allCenturies')} />
              </SelectTrigger>
              <SelectContent className="bg-[#121214] border-[#27272A]">
                <SelectItem value="" className="text-[#E5E5E5]">{t('allCenturies')}</SelectItem>
                {filters.centuries.map(c => (
                  <SelectItem key={c} value={c} className="text-[#E5E5E5]">{t('century')} {c}</SelectItem>
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
              <Label htmlFor="show-investigating" className="text-[#A1A1AA] text-sm">
                {t('showInvestigating')}
              </Label>
            </div>
          </div>
        </div>

        {/* Miracles Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          </div>
        ) : miracles.length === 0 ? (
          <div className="text-center py-20" data-testid="no-results">
            <p className="text-[#A1A1AA] text-lg">{t('noResults')}</p>
            <p className="text-[#52525B] text-sm mt-2">
              {t('showInvestigating')} {!showInvestigating && '↑'}
            </p>
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
