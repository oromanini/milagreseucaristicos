import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { API_URL } from '../lib/api';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const API = API_URL;

export const Contact = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: 'duvida',
    email: '',
    subject: '',
    message: '',
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.message) {
      toast.error(t('contactRequiredFields'));
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/contact-messages`, {
        type: form.type,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });

      toast.success(t('contactSent'));
      setForm({ type: 'duvida', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending contact message:', error);
      const detail = error?.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto" data-testid="contact-page">
      <h1 className="font-serif text-4xl text-[#E5E5E5] mb-3">{t('contactTitle')}</h1>
      <p className="text-[#A1A1AA] mb-8">{t('contactDescription')}</p>

      <form onSubmit={onSubmit} className="bg-[#121214] border border-[#27272A] p-6 space-y-5">
        <div className="space-y-2">
          <Label className="text-[#E5E5E5]">{t('contactType')}</Label>
          <Select value={form.type} onValueChange={(value) => setForm((prev) => ({ ...prev, type: value }))}>
            <SelectTrigger className="border-[#27272A] text-[#E5E5E5]" data-testid="contact-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#121214] border-[#27272A] text-[#E5E5E5]">
              <SelectItem value="duvida">{t('contactTypeQuestion')}</SelectItem>
              <SelectItem value="reclamacao">{t('contactTypeComplaint')}</SelectItem>
              <SelectItem value="sugestao">{t('contactTypeSuggestion')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[#E5E5E5]">{t('email')}</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="border-[#27272A] text-[#E5E5E5]"
            placeholder="voce@email.com"
            data-testid="contact-email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#E5E5E5]">{t('contactSubject')}</Label>
          <Input
            value={form.subject}
            onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
            className="border-[#27272A] text-[#E5E5E5]"
            placeholder={t('contactSubjectPlaceholder')}
            data-testid="contact-subject"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#E5E5E5]">{t('contactMessage')}</Label>
          <Textarea
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            className="border-[#27272A] text-[#E5E5E5] min-h-[160px]"
            placeholder={t('contactMessagePlaceholder')}
            data-testid="contact-message"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="bg-[#D4AF37] hover:bg-[#A68A2D] text-[#0A0A0B]"
          data-testid="contact-submit"
        >
          {loading ? t('loading') : t('contactSubmit')}
        </Button>
      </form>
    </div>
  );
};
