import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Upload, Loader2, Download, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '../../lib/api';

const API = API_URL;

export const BulkImport = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [jsonContent, setJsonContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setJsonContent(event.target.result);
    };
    reader.readAsText(file);
  };

  const downloadTemplate = async () => {
    try {
      const response = await axios.get(`${API}/miracles/template/json`);
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'miracles_template.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error(t('error'));
    }
  };

  const handleImport = async () => {
    if (!jsonContent.trim()) {
      toast.error('Cole ou carregue um JSON primeiro');
      return;
    }

    let data;
    try {
      data = JSON.parse(jsonContent);
    } catch (error) {
      toast.error('JSON inválido. Verifique a formatação.');
      return;
    }

    if (!data.miracles || !Array.isArray(data.miracles)) {
      toast.error('O JSON deve conter um array "miracles"');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API}/miracles/bulk-import`, data);
      setResult(response.data);
      
      if (response.data.imported_count > 0) {
        toast.success(`${response.data.imported_count} milagres importados com sucesso!`);
      }
      if (response.data.error_count > 0) {
        toast.error(`${response.data.error_count} erros na importação`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error(error.response?.data?.detail || t('importError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-20" data-testid="bulk-import-page">
      {/* Back */}
      <Link
        to="/admin"
        className="inline-flex items-center text-[#A1A1AA] hover:text-[#D4AF37] mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span className="uppercase text-xs tracking-widest">{t('dashboard')}</span>
      </Link>

      <h1 className="font-serif text-3xl text-[#E5E5E5] mb-4">{t('bulkImport')}</h1>
      <p className="text-[#A1A1AA] mb-8">
        Importe vários milagres de uma vez usando um arquivo JSON. Baixe o template para ver a estrutura esperada.
      </p>

      {/* Instructions */}
      <div className="bg-[#121214] border border-[#27272A] p-6 mb-8">
        <h2 className="font-serif text-xl text-[#D4AF37] mb-4">Como usar</h2>
        <ol className="text-[#A1A1AA] space-y-3 list-decimal list-inside">
          <li>Baixe o template JSON clicando no botão abaixo</li>
          <li>Copie o template para o ChatGPT e peça para gerar os milagres</li>
          <li>Cole o JSON gerado na área de texto abaixo ou faça upload do arquivo</li>
          <li>Clique em "Importar" para adicionar todos os milagres ao banco de dados</li>
        </ol>
        
        <Button
          variant="outline"
          onClick={downloadTemplate}
          className="mt-6 border-[#D4AF37]/30 text-[#D4AF37]"
          data-testid="download-template-btn"
        >
          <Download className="w-4 h-4 mr-2" />
          {t('downloadTemplate')}
        </Button>
      </div>

      {/* Upload area */}
      <div className="space-y-4 mb-8">
        <div className="flex gap-4">
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-[#27272A] text-[#A1A1AA]"
            data-testid="upload-file-btn"
          >
            <Upload className="w-4 h-4 mr-2" />
            Carregar arquivo JSON
          </Button>
        </div>

        <Textarea
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
          placeholder='{"miracles": [...]}'
          rows={15}
          className="bg-[#0A0A0B] border-[#27272A] text-[#E5E5E5] font-mono text-sm"
          data-testid="json-textarea"
        />
      </div>

      {/* Import button */}
      <Button
        onClick={handleImport}
        disabled={loading || !jsonContent.trim()}
        className="bg-[#D4AF37] hover:bg-[#A68A2D] text-[#0A0A0B]"
        data-testid="import-btn"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Importando...
          </>
        ) : (
          'Importar Milagres'
        )}
      </Button>

      {/* Results */}
      {result && (
        <div className="mt-8 bg-[#121214] border border-[#27272A] p-6" data-testid="import-result">
          <h2 className="font-serif text-xl text-[#E5E5E5] mb-4">Resultado da Importação</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-5 h-5" />
              <span>{result.imported_count} importados com sucesso</span>
            </div>
            <div className="flex items-center gap-2 text-red-500">
              <XCircle className="w-5 h-5" />
              <span>{result.error_count} erros</span>
            </div>
          </div>

          {result.imported.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[#D4AF37] text-sm uppercase tracking-wider mb-2">Importados</h3>
              <ul className="text-[#A1A1AA] text-sm space-y-1 max-h-40 overflow-y-auto">
                {result.imported.map((item, i) => (
                  <li key={i}>✓ {item.name}</li>
                ))}
              </ul>
            </div>
          )}

          {result.errors.length > 0 && (
            <div>
              <h3 className="text-red-500 text-sm uppercase tracking-wider mb-2">Erros</h3>
              <ul className="text-[#A1A1AA] text-sm space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((item, i) => (
                  <li key={i} className="text-red-400">
                    ✗ {item.name}: {item.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            onClick={() => navigate('/admin')}
            className="mt-6 bg-[#D4AF37] hover:bg-[#A68A2D] text-[#0A0A0B]"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};
