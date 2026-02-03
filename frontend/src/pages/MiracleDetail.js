import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { Separator } from '../components/ui/separator';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  BookOpen,
  Microscope,
  Church,
  Image,
  FileText,
  Quote,
  Sparkles,
  Loader2,
  ChevronRight,
  ChevronLeft,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const sections = [
  { id: 'overview', icon: BookOpen, labelKey: 'historicalContext' },
  { id: 'phenomenon', icon: Sparkles, labelKey: 'phenomenon' },
  { id: 'timeline', icon: Calendar, labelKey: 'timeline' },
  { id: 'scientific', icon: Microscope, labelKey: 'scientificEvidence' },
  { id: 'verdict', icon: Church, labelKey: 'churchVerdict' },
  { id: 'media', icon: Image, labelKey: 'media' },
  { id: 'references', icon: FileText, labelKey: 'references' },
];

export const MiracleDetail = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const [miracle, setMiracle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    fetchMiracle();
  }, [id]);

  const fetchMiracle = async () => {
    try {
      const response = await axios.get(`${API}/miracles/${id}`);
      setMiracle(response.data);
    } catch (error) {
      console.error('Error fetching miracle:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const getTranslated = (field) => {
    if (language !== 'pt' && miracle?.translations?.[language]?.[field]) {
      return miracle.translations[language][field];
    }
    return miracle?.[field];
  };


  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const currentSectionIndex = sections.findIndex(s => s.id === activeSection);
  const prevSection = sections[currentSectionIndex - 1];
  const nextSection = sections[currentSectionIndex + 1];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!miracle) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <p className="text-[#A1A1AA]">{t('noResults')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" data-testid="miracle-detail-page">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/"
          className="inline-flex items-center text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
          data-testid="back-link"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="uppercase text-xs tracking-widest">{t('home')}</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24">
              <nav className="space-y-1" data-testid="section-nav">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`section-nav-item w-full text-left flex items-center gap-3 ${
                      activeSection === section.id ? 'active' : ''
                    }`}
                    data-testid={`nav-${section.id}`}
                  >
                    <section.icon className="w-4 h-4" />
                    {t(section.labelKey)}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-12">
            {/* Header */}
            <header className="animate-fade-in-up">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{miracle.country_flag}</span>
                <span
                  className={`text-xs uppercase tracking-wider px-3 py-1 ${
                    miracle.status === 'recognized' ? 'badge-recognized' : 'badge-investigating'
                  }`}
                >
                  {miracle.status === 'recognized' ? t('statusRecognized') : t('statusInvestigating')}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#E5E5E5] mb-4">
                {getTranslated('name')}
              </h1>
              <div className="flex flex-wrap gap-6 text-[#A1A1AA]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>{miracle.city}, {miracle.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span>{t('century')} {miracle.century} {miracle.year && `(${miracle.year})`}</span>
                </div>
              </div>
            </header>

            {/* Summary */}
            {(miracle.summary || getTranslated('summary')) && (
              <section className="bg-[#121214] border border-[rgba(212,175,55,0.3)] p-6 animate-fade-in-up" data-testid="summary-section">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-serif text-lg text-[#D4AF37]">{t('summary')}</h3>
                </div>
                <p className="text-[#E5E5E5] leading-relaxed whitespace-pre-wrap">
                  {getTranslated('summary') || miracle.summary}
                </p>
              </section>
            )}

            {/* Overview Section */}
            <section id="overview" className="scroll-mt-24 animate-fade-in-up" data-testid="section-overview">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif text-2xl text-[#E5E5E5]">{t('historicalContext')}</h2>
              </div>
              <p className="text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                {getTranslated('historical_context')}
              </p>
            </section>

            <Separator className="bg-[#27272A]" />

            {/* Phenomenon Section */}
            <section id="phenomenon" className="scroll-mt-24 animate-fade-in-up" data-testid="section-phenomenon">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif text-2xl text-[#E5E5E5]">{t('phenomenon')}</h2>
              </div>
              <p className="text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">
                {getTranslated('phenomenon_description')}
              </p>
            </section>

            <Separator className="bg-[#27272A]" />

            {/* Timeline Section */}
            <section id="timeline" className="scroll-mt-24 animate-fade-in-up" data-testid="section-timeline">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif text-2xl text-[#E5E5E5]">{t('timeline')}</h2>
              </div>
              
              {miracle.timeline?.length > 0 ? (
                <div className="relative pl-8">
                  <div className="timeline-line absolute left-[5px] top-2 bottom-2 w-[2px]" />
                  <div className="space-y-8">
                    {miracle.timeline.map((event, index) => (
                      <div key={index} className="relative">
                        <div className="timeline-node absolute -left-8 top-1" />
                        <div className="text-[#D4AF37] font-serif text-lg mb-2">{event.year}</div>
                        <h4 className="text-[#E5E5E5] font-medium mb-1">{event.title}</h4>
                        <p className="text-[#A1A1AA] text-sm">{event.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[#52525B] italic">{t('noResults')}</p>
              )}
            </section>

            <Separator className="bg-[#27272A]" />

            {/* Scientific Evidence Section */}
            <section id="scientific" className="scroll-mt-24 animate-fade-in-up" data-testid="section-scientific">
              <div className="flex items-center gap-3 mb-6">
                <Microscope className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif text-2xl text-[#E5E5E5]">{t('scientificEvidence')}</h2>
              </div>
              
              {miracle.scientific_reports?.length > 0 ? (
                <div className="space-y-6">
                  {miracle.scientific_reports.map((report, index) => (
                    <div key={index} className="bg-[#121214] border border-[#27272A] p-6">
                      <div className="text-[#D4AF37] text-sm uppercase tracking-wider mb-3">{report.date}</div>
                      <p className="text-[#E5E5E5] mb-4">{report.description}</p>
                      
                      {report.experts?.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-[#A1A1AA] text-xs uppercase tracking-wider mb-2">Especialistas</h4>
                          <div className="space-y-1">
                            {report.experts.map((expert, i) => (
                              <div key={i} className="text-[#E5E5E5] text-sm">
                                {expert.name} - <span className="text-[#A1A1AA]">{expert.institution}</span>
                                {expert.role && <span className="text-[#52525B]"> ({expert.role})</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {report.original_excerpts?.length > 0 && (
                        <div>
                          <h4 className="text-[#A1A1AA] text-xs uppercase tracking-wider mb-2">Trechos Originais</h4>
                          {report.original_excerpts.map((excerpt, i) => (
                            <blockquote key={i} className="border-l-2 border-[#D4AF37] pl-4 italic text-[#A1A1AA] text-sm">
                              <Quote className="w-4 h-4 text-[#D4AF37] mb-1" />
                              {excerpt}
                            </blockquote>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#52525B] italic">{t('noResults')}</p>
              )}
            </section>

            <Separator className="bg-[#27272A]" />

            {/* Church Verdict Section */}
            <section id="verdict" className="scroll-mt-24 animate-fade-in-up" data-testid="section-verdict">
              <div className="flex items-center gap-3 mb-6">
                <Church className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif text-2xl text-[#E5E5E5]">{t('churchVerdict')}</h2>
              </div>
              <div className="bg-[#121214] border border-[rgba(212,175,55,0.3)] p-6">
                <p className="text-[#E5E5E5] leading-relaxed whitespace-pre-wrap">
                  {getTranslated('church_verdict')}
                </p>
              </div>
            </section>

            <Separator className="bg-[#27272A]" />

            {/* Media Section */}
            <section id="media" className="scroll-mt-24 animate-fade-in-up" data-testid="section-media">
              <div className="flex items-center gap-3 mb-6">
                <Image className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif text-2xl text-[#E5E5E5]">{t('media')}</h2>
              </div>
              
              {miracle.media?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {miracle.media.map((item, index) => (
                    <div key={index} className="bg-[#121214] border border-[#27272A] p-4">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-48 object-cover mb-3"
                        />
                      ) : item.type === 'video' ? (
                        <div className="w-full h-48 bg-[#0A0A0B] flex items-center justify-center mb-3">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[#D4AF37]">
                            <ExternalLink className="w-8 h-8" />
                          </a>
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-[#0A0A0B] flex items-center justify-center mb-3">
                          <FileText className="w-8 h-8 text-[#D4AF37]" />
                        </div>
                      )}
                      <h4 className="text-[#E5E5E5] font-medium">{item.title}</h4>
                      {item.description && (
                        <p className="text-[#A1A1AA] text-sm mt-1">{item.description}</p>
                      )}
                      {item.category && (
                        <span className="text-[#52525B] text-xs uppercase tracking-wider mt-2 inline-block">
                          {item.category}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#52525B] italic">{t('noResults')}</p>
              )}
            </section>

            <Separator className="bg-[#27272A]" />

            {/* References Section */}
            <section id="references" className="scroll-mt-24 animate-fade-in-up" data-testid="section-references">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif text-2xl text-[#E5E5E5]">{t('references')}</h2>
              </div>
              
              {miracle.references?.length > 0 ? (
                <ul className="space-y-4">
                  {miracle.references.map((ref, index) => (
                    <li key={index} className="text-[#A1A1AA] text-sm pl-4 border-l border-[#27272A]">
                      {ref.citation}
                      {ref.url && (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-[#D4AF37] hover:underline"
                        >
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#52525B] italic">{t('noResults')}</p>
              )}
            </section>

            {/* Section Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-[#27272A]">
              {prevSection ? (
                <button
                  onClick={() => scrollToSection(prevSection.id)}
                  className="flex items-center gap-2 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
                  data-testid="prev-section-btn"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm uppercase tracking-wider">{t(prevSection.labelKey)}</span>
                </button>
              ) : <div />}
              
              {nextSection && (
                <button
                  onClick={() => scrollToSection(nextSection.id)}
                  className="flex items-center gap-2 text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
                  data-testid="next-section-btn"
                >
                  <span className="text-sm uppercase tracking-wider">{t(nextSection.labelKey)}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
