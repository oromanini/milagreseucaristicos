import { useState, useEffect, useCallback, useRef } from 'react';
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
const HERO_AUDIO_VIDEO_ID = 'BYzT9zOJHF0';

export const Home = () => {
  const { t } = useLanguage();
  const [miracles, setMiracles] = useState([]);
  const [filters, setFilters] = useState({ countries: [], centuries: [] });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, recognized: 0, investigating: 0, countries: 0 });
  
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [century, setCentury] = useState('');
  const [showInvestigating, setShowInvestigating] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioPlayerRef = useRef(null);

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
    const initializePlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      audioPlayerRef.current = new window.YT.Player('hero-audio-player', {
        height: '0',
        width: '0',
        videoId: HERO_AUDIO_VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => setIsAudioReady(true),
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsAudioPlaying(true);
            } else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              setIsAudioPlaying(false);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initializePlayer();
      return;
    }

    const existingScript = document.getElementById('youtube-iframe-api');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.id = 'youtube-iframe-api';
      document.body.appendChild(script);
    }

    window.onYouTubeIframeAPIReady = initializePlayer;
  }, []);

  const scrollToMiracles = () => {
    document.getElementById('miracles-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAudioToggle = () => {
    if (!audioPlayerRef.current) return;
    if (isAudioPlaying) {
      audioPlayerRef.current.pauseVideo();
    } else {
      audioPlayerRef.current.playVideo();
    }
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        <div id="hero-audio-player" className="absolute h-0 w-0 overflow-hidden" aria-hidden="true" />
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Monstrance"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

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

        <div className="absolute bottom-24 right-6 z-20">
          <div className="flex items-center gap-3 rounded-full border border-[#27272A] bg-[#0A0A0B]/80 px-4 py-2 text-[#E5E5E5] backdrop-blur">
            <span className="text-xs uppercase tracking-widest text-[#A1A1AA]">Música</span>
            <button
              type="button"
              onClick={handleAudioToggle}
              disabled={!isAudioReady}
              aria-pressed={isAudioPlaying}
              className="rounded-full border border-[#D4AF37] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-[#0A0A0B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAudioPlaying ? 'Pausar' : 'Tocar'}
            </button>
          </div>
        </div>

        <button
          onClick={scrollToMiracles}
          className="absolute bottom-8 inset-x-0 flex flex-col items-center text-[#A1A1AA] text-center animate-bounce"
          data-testid="scroll-indicator"
        >
          <span className="text-xs uppercase tracking-widest mb-2">{t('scrollToDiscover')}</span>
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      <section className="bg-[#121214] py-12 border-y border-[#27272A]" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="font-serif text-3xl text-[#D4AF37]">{stats.total}</div>
              <div className="text-[#A1A1AA] text-xs uppercase tracking-widest mt-1">{t('miracles')}</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl text-[#D4AF37]">{stats.recognized}</div>
              <div className="text-[#A1A1AA] text-xs uppercase tracking-widest mt-1">{t('recognized')}</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl text-[#D4AF37]">{stats.investigating}</div>
              <div className="text-[#A1A1AA] text-xs uppercase tracking-widest mt-1">{t('investigating')}</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl text-[#D4AF37]">{stats.countries}</div>
              <div className="text-[#A1A1AA] text-xs uppercase tracking-widest mt-1">Países</div>
            </div>
          </div>
        </div>
      </section>

      <section id="miracles-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" data-testid="miracles-section">
        <div className="mb-12 space-y-6" data-testid="filters-section">
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

          <div className="flex flex-wrap gap-4 items-center">
            <Select value={country || "all"} onValueChange={(v) => setCountry(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[180px] bg-[#121214] border-[#27272A] text-[#E5E5E5]" data-testid="country-filter">
                <SelectValue placeholder={t('allCountries')} />
              </SelectTrigger>
              <SelectContent className="bg-[#121214] border-[#27272A]">
                <SelectItem value="all" className="text-[#E5E5E5]">{t('allCountries')}</SelectItem>
                {filters.countries.map(c => (
                  <SelectItem key={c} value={c} className="text-[#E5E5E5]">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={century || "all"} onValueChange={(v) => setCentury(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[180px] bg-[#121214] border-[#27272A] text-[#E5E5E5]" data-testid="century-filter">
                <SelectValue placeholder={t('allCenturies')} />
              </SelectTrigger>
              <SelectContent className="bg-[#121214] border-[#27272A]">
                <SelectItem value="all" className="text-[#E5E5E5]">{t('allCenturies')}</SelectItem>
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

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          </div>
        ) : miracles.length === 0 ? (
          <div className="text-center py-20" data-testid="no-results">
            <p className="text-[#A1A1AA] text-lg">{t('noResults')}</p>
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
