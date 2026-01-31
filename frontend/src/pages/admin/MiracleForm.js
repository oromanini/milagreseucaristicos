import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const emptyMiracle = {
  name: '',
  country: '',
  country_flag: '',
  city: '',
  century: '',
  year: '',
  status: 'recognized',
  historical_context: '',
  phenomenon_description: '',
  timeline: [],
  scientific_reports: [],
  church_verdict: '',
  media: [],
  references: [],
  translations: {
    en: { name: '', historical_context: '', phenomenon_description: '', church_verdict: '', summary: null },
    es: { name: '', historical_context: '', phenomenon_description: '', church_verdict: '', summary: null }
  }
};

export const MiracleForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id && id !== 'new';
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [miracle, setMiracle] = useState(emptyMiracle);

  useEffect(() => {
    if (isEditing) {
      fetchMiracle();
    }
  }, [id]);

  const fetchMiracle = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/miracles/${id}`);
      setMiracle({
        ...emptyMiracle,
        ...response.data,
        translations: {
          ...emptyMiracle.translations,
          ...response.data.translations
        }
      });
    } catch (error) {
      console.error('Error fetching miracle:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isEditing) {
        await axios.put(`${API}/miracles/${id}`, miracle);
      } else {
        await axios.post(`${API}/miracles`, miracle);
      }
      toast.success(t('success'));
      navigate('/admin');
    } catch (error) {
      console.error('Error saving:', error);
      toast.error(error.response?.data?.detail || t('error'));
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setMiracle(prev => ({ ...prev, [field]: value }));
  };

  const updateTranslation = (lang, field, value) => {
    setMiracle(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang],
          [field]: value
        }
      }
    }));
  };

  // Timeline management
  const addTimelineEvent = () => {
    setMiracle(prev => ({
      ...prev,
      timeline: [...prev.timeline, { year: '', title: '', description: '' }]
    }));
  };

  const updateTimelineEvent = (index, field, value) => {
    setMiracle(prev => ({
      ...prev,
      timeline: prev.timeline.map((event, i) => 
        i === index ? { ...event, [field]: value } : event
      )
    }));
  };

  const removeTimelineEvent = (index) => {
    setMiracle(prev => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index)
    }));
  };

  // References management
  const addReference = () => {
    setMiracle(prev => ({
      ...prev,
      references: [...prev.references, { citation: '', url: '' }]
    }));
  };

  const updateReference = (index, field, value) => {
    setMiracle(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const removeReference = (index) => {
    setMiracle(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  // Media management
  const addMedia = () => {
    setMiracle(prev => ({
      ...prev,
      media: [...prev.media, { type: 'image', url: '', title: '', description: '', category: 'current' }]
    }));
  };

  const updateMedia = (index, field, value) => {
    setMiracle(prev => ({
      ...prev,
      media: prev.media.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeMedia = (index) => {
    setMiracle(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  // File upload
  const handleFileUpload = async (e, mediaIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateMedia(mediaIndex, 'url', `${process.env.REACT_APP_BACKEND_URL}${response.data.url}`);
      toast.success('Upload concluído');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erro no upload');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20" data-testid="miracle-form">
      {/* Back */}
      <Link
        to="/admin"
        className="inline-flex items-center text-[#A1A1AA] hover:text-[#D4AF37] mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span className="uppercase text-xs tracking-widest">{t('dashboard')}</span>
      </Link>

      <h1 className="font-serif text-3xl text-[#E5E5E5] mb-8">
        {isEditing ? t('edit') : t('newMiracle')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="bg-[#121214] border border-[#27272A] mb-6">
            <TabsTrigger value="basic" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0A0B]">
              Básico
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0A0B]">
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0A0B]">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0A0B]">
              Mídia
            </TabsTrigger>
            <TabsTrigger value="references" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0A0B]">
              Referências
            </TabsTrigger>
            <TabsTrigger value="translations" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-[#0A0A0B]">
              Traduções
            </TabsTrigger>
          </TabsList>

          {/* Basic Info */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[#A1A1AA]">Nome do Milagre *</Label>
                <Input
                  value={miracle.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  required
                  className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                  data-testid="miracle-name-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#A1A1AA]">Status *</Label>
                <Select value={miracle.status} onValueChange={(v) => updateField('status', v)}>
                  <SelectTrigger className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]" data-testid="status-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#121214] border-[#27272A]">
                    <SelectItem value="recognized" className="text-[#E5E5E5]">{t('recognized')}</SelectItem>
                    <SelectItem value="investigating" className="text-[#E5E5E5]">{t('investigating')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-[#A1A1AA]">País *</Label>
                <Input
                  value={miracle.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  required
                  placeholder="Itália"
                  className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#A1A1AA]">Bandeira (emoji) *</Label>
                <Input
                  value={miracle.country_flag}
                  onChange={(e) => updateField('country_flag', e.target.value)}
                  required
                  placeholder="🇮🇹"
                  className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#A1A1AA]">Cidade *</Label>
                <Input
                  value={miracle.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  required
                  placeholder="Lanciano"
                  className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[#A1A1AA]">Século *</Label>
                <Input
                  value={miracle.century}
                  onChange={(e) => updateField('century', e.target.value)}
                  required
                  placeholder="VIII"
                  className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[#A1A1AA]">Ano (opcional)</Label>
                <Input
                  value={miracle.year}
                  onChange={(e) => updateField('year', e.target.value)}
                  placeholder="750"
                  className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                />
              </div>
            </div>
          </TabsContent>

          {/* Content */}
          <TabsContent value="content" className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[#A1A1AA]">Contexto Histórico *</Label>
              <Textarea
                value={miracle.historical_context}
                onChange={(e) => updateField('historical_context', e.target.value)}
                required
                rows={6}
                className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                data-testid="historical-context-input"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#A1A1AA]">Descrição do Fenômeno *</Label>
              <Textarea
                value={miracle.phenomenon_description}
                onChange={(e) => updateField('phenomenon_description', e.target.value)}
                required
                rows={6}
                className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#A1A1AA]">Parecer da Igreja *</Label>
              <Textarea
                value={miracle.church_verdict}
                onChange={(e) => updateField('church_verdict', e.target.value)}
                required
                rows={4}
                className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
              />
            </div>
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline" className="space-y-6">
            {miracle.timeline.map((event, index) => (
              <div key={index} className="bg-[#121214] border border-[#27272A] p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#D4AF37] text-sm">Evento {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTimelineEvent(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#A1A1AA]">Ano</Label>
                    <Input
                      value={event.year}
                      onChange={(e) => updateTimelineEvent(index, 'year', e.target.value)}
                      className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#A1A1AA]">Título</Label>
                    <Input
                      value={event.title}
                      onChange={(e) => updateTimelineEvent(index, 'title', e.target.value)}
                      className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#A1A1AA]">Descrição</Label>
                  <Textarea
                    value={event.description}
                    onChange={(e) => updateTimelineEvent(index, 'description', e.target.value)}
                    rows={2}
                    className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addTimelineEvent}
              className="border-[#D4AF37]/30 text-[#D4AF37]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Evento
            </Button>
          </TabsContent>

          {/* Media */}
          <TabsContent value="media" className="space-y-6">
            {miracle.media.map((item, index) => (
              <div key={index} className="bg-[#121214] border border-[#27272A] p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#D4AF37] text-sm">Mídia {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMedia(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#A1A1AA]">Tipo</Label>
                    <Select value={item.type} onValueChange={(v) => updateMedia(index, 'type', v)}>
                      <SelectTrigger className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121214] border-[#27272A]">
                        <SelectItem value="image" className="text-[#E5E5E5]">Imagem</SelectItem>
                        <SelectItem value="video" className="text-[#E5E5E5]">Vídeo</SelectItem>
                        <SelectItem value="document" className="text-[#E5E5E5]">Documento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#A1A1AA]">Categoria</Label>
                    <Select value={item.category} onValueChange={(v) => updateMedia(index, 'category', v)}>
                      <SelectTrigger className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#121214] border-[#27272A]">
                        <SelectItem value="historical" className="text-[#E5E5E5]">Histórica</SelectItem>
                        <SelectItem value="scientific" className="text-[#E5E5E5]">Científica</SelectItem>
                        <SelectItem value="current" className="text-[#E5E5E5]">Atual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#A1A1AA]">URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={item.url}
                      onChange={(e) => updateMedia(index, 'url', e.target.value)}
                      className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5] flex-1"
                    />
                    <label className="cursor-pointer">
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload(e, index)}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" className="border-[#27272A]" asChild>
                        <span><Upload className="w-4 h-4" /></span>
                      </Button>
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#A1A1AA]">Título</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateMedia(index, 'title', e.target.value)}
                      className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#A1A1AA]">Descrição</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateMedia(index, 'description', e.target.value)}
                      className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addMedia}
              className="border-[#D4AF37]/30 text-[#D4AF37]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Mídia
            </Button>
          </TabsContent>

          {/* References */}
          <TabsContent value="references" className="space-y-6">
            <p className="text-[#A1A1AA] text-sm">
              Use o formato ABNT para as citações bibliográficas.
            </p>
            {miracle.references.map((ref, index) => (
              <div key={index} className="bg-[#121214] border border-[#27272A] p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#D4AF37] text-sm">Referência {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReference(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#A1A1AA]">Citação (ABNT)</Label>
                  <Textarea
                    value={ref.citation}
                    onChange={(e) => updateReference(index, 'citation', e.target.value)}
                    rows={2}
                    className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#A1A1AA]">URL (opcional)</Label>
                  <Input
                    value={ref.url || ''}
                    onChange={(e) => updateReference(index, 'url', e.target.value)}
                    className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addReference}
              className="border-[#D4AF37]/30 text-[#D4AF37]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Referência
            </Button>
          </TabsContent>

          {/* Translations */}
          <TabsContent value="translations" className="space-y-8">
            {/* English */}
            <div className="space-y-4">
              <h3 className="text-[#D4AF37] font-serif text-lg flex items-center gap-2">
                🇺🇸 English
              </h3>
              <div className="space-y-4 pl-4 border-l border-[#27272A]">
                <div className="space-y-2">
                  <Label className="text-[#A1A1AA]">Name</Label>
                  <Input
                    value={miracle.translations.en?.name || ''}
                    onChange={(e) => updateTranslation('en', 'name', e.target.value)}
                    className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#A1A1AA]">Historical Context</Label>
                  <Textarea
                    value={miracle.translations.en?.historical_context || ''}
                    onChange={(e) => updateTranslation('en', 'historical_context', e.target.value)}
                    rows={4}
                    className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#A1A1AA]">Phenomenon Description</Label>
                  <Textarea
                    value={miracle.translations.en?.phenomenon_description || ''}
                    onChange={(e) => updateTranslation('en', 'phenomenon_description', e.target.value)}
                    rows={4}
                    className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#A1A1AA]">Church Verdict</Label>
                  <Textarea
                    value={miracle.translations.en?.church_verdict || ''}
                    onChange={(e) => updateTranslation('en', 'church_verdict', e.target.value)}
                    rows={3}
                    className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                  />
                </div>
              </div>
            </div>

            {/* Spanish */}
            <div className="space-y-4">
              <h3 className="text-[#D4AF37] font-serif text-lg flex items-center gap-2">
                🇪🇸 Español
              </h3>
              <div className="space-y-4 pl-4 border-l border-[#27272A]">
                <div className="space-y-2">
                  <Label className="text-[#A1A1AA]">Nombre</Label>
                  <Input
                    value={miracle.translations.es?.name || ''}
                    onChange={(e) => updateTranslation('es', 'name', e.target.value)}
                    className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#A1A1AA]">Contexto Histórico</Label>
                  <Textarea
                    value={miracle.translations.es?.historical_context || ''}
                    onChange={(e) => updateTranslation('es', 'historical_context', e.target.value)}
                    rows={4}
                    className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#A1A1AA]">Descripción del Fenómeno</Label>
                  <Textarea
                    value={miracle.translations.es?.phenomenon_description || ''}
                    onChange={(e) => updateTranslation('es', 'phenomenon_description', e.target.value)}
                    rows={4}
                    className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#A1A1AA]">Veredicto de la Iglesia</Label>
                  <Textarea
                    value={miracle.translations.es?.church_verdict || ''}
                    onChange={(e) => updateTranslation('es', 'church_verdict', e.target.value)}
                    rows={3}
                    className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Submit */}
        <div className="flex justify-end gap-4 pt-6 border-t border-[#27272A]">
          <Link to="/admin">
            <Button type="button" variant="outline" className="border-[#27272A] text-[#A1A1AA]">
              {t('cancel')}
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#D4AF37] hover:bg-[#A68A2D] text-[#0A0A0B]"
            data-testid="save-btn"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('save')}
          </Button>
        </div>
      </form>
    </div>
  );
};
