import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const Login = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      toast.success(t('success'));
      navigate('/admin');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.detail || t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16" data-testid="login-page">
      <div className="w-full max-w-md">
        <div className="bg-[#121214] border border-[#27272A] p-8 animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">✝️</span>
            <h1 className="font-serif text-2xl text-[#E5E5E5]">
              {t('signIn')}
            </h1>
            <p className="text-[#A1A1AA] text-sm mt-2">
              {t('admin')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#A1A1AA]">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                data-testid="email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#A1A1AA]">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5]"
                data-testid="password-input"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] hover:bg-[#A68A2D] text-[#0A0A0B]"
              data-testid="submit-btn"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t('signIn')
              )}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
};
