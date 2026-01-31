import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { Plus, Upload, Pencil, Trash2, Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const Dashboard = () => {
  const { t } = useLanguage();
  const [miracles, setMiracles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, recognized: 0, investigating: 0, countries: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [miraclesRes, statsRes] = await Promise.all([
        axios.get(`${API}/miracles`),
        axios.get(`${API}/stats`)
      ]);
      setMiracles(miraclesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/miracles/${id}`);
      setMiracles(miracles.filter(m => m.id !== id));
      toast.success(t('success'));
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error(t('error'));
    }
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

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" data-testid="admin-dashboard">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#E5E5E5]">{t('dashboard')}</h1>
          <p className="text-[#A1A1AA] mt-1">{t('admin')}</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="border-[#27272A] text-[#A1A1AA] hover:text-[#D4AF37] hover:border-[#D4AF37]"
            data-testid="download-template-btn"
          >
            <Download className="w-4 h-4 mr-2" />
            {t('downloadTemplate')}
          </Button>
          <Link to="/admin/import">
            <Button
              variant="outline"
              className="border-[#27272A] text-[#A1A1AA] hover:text-[#D4AF37] hover:border-[#D4AF37]"
              data-testid="import-btn"
            >
              <Upload className="w-4 h-4 mr-2" />
              {t('bulkImport')}
            </Button>
          </Link>
          <Link to="/admin/miracle/new">
            <Button className="bg-[#D4AF37] hover:bg-[#A68A2D] text-[#0A0A0B]" data-testid="new-miracle-btn">
              <Plus className="w-4 h-4 mr-2" />
              {t('newMiracle')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#121214] border border-[#27272A] p-4">
          <div className="text-[#D4AF37] font-serif text-2xl">{stats.total}</div>
          <div className="text-[#A1A1AA] text-xs uppercase tracking-wider">Total</div>
        </div>
        <div className="bg-[#121214] border border-[#27272A] p-4">
          <div className="text-[#D4AF37] font-serif text-2xl">{stats.recognized}</div>
          <div className="text-[#A1A1AA] text-xs uppercase tracking-wider">{t('recognized')}</div>
        </div>
        <div className="bg-[#121214] border border-[#27272A] p-4">
          <div className="text-[#D4AF37] font-serif text-2xl">{stats.investigating}</div>
          <div className="text-[#A1A1AA] text-xs uppercase tracking-wider">{t('investigating')}</div>
        </div>
        <div className="bg-[#121214] border border-[#27272A] p-4">
          <div className="text-[#D4AF37] font-serif text-2xl">{stats.countries}</div>
          <div className="text-[#A1A1AA] text-xs uppercase tracking-wider">Países</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#121214] border border-[#27272A] overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          </div>
        ) : miracles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#A1A1AA]">{t('noResults')}</p>
            <p className="text-[#52525B] text-sm mt-2">
              Comece adicionando milagres ou importando via JSON
            </p>
          </div>
        ) : (
          <Table className="admin-table">
            <TableHeader>
              <TableRow className="border-[#27272A] hover:bg-transparent">
                <TableHead className="text-[#A1A1AA]">Nome</TableHead>
                <TableHead className="text-[#A1A1AA]">País</TableHead>
                <TableHead className="text-[#A1A1AA]">Século</TableHead>
                <TableHead className="text-[#A1A1AA]">Status</TableHead>
                <TableHead className="text-[#A1A1AA] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {miracles.map(miracle => (
                <TableRow key={miracle.id} className="border-[#27272A]" data-testid={`miracle-row-${miracle.id}`}>
                  <TableCell className="text-[#E5E5E5] font-medium">
                    <Link to={`/miracle/${miracle.id}`} className="hover:text-[#D4AF37]">
                      {miracle.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-[#A1A1AA]">
                    {miracle.country_flag} {miracle.country}
                  </TableCell>
                  <TableCell className="text-[#A1A1AA]">{miracle.century}</TableCell>
                  <TableCell>
                    <span className={`text-xs uppercase tracking-wider px-2 py-1 ${
                      miracle.status === 'recognized' ? 'badge-recognized' : 'badge-investigating'
                    }`}>
                      {miracle.status === 'recognized' ? t('recognized') : t('investigating')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/miracle/${miracle.id}`}>
                        <Button variant="ghost" size="sm" className="text-[#A1A1AA] hover:text-[#D4AF37]" data-testid={`edit-btn-${miracle.id}`}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-[#A1A1AA] hover:text-red-500" data-testid={`delete-btn-${miracle.id}`}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#121214] border-[#27272A]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-[#E5E5E5]">{t('confirmDelete')}</AlertDialogTitle>
                            <AlertDialogDescription className="text-[#A1A1AA]">
                              Esta ação não pode ser desfeita. O milagre "{miracle.name}" será removido permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-[#27272A] text-[#A1A1AA]">{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(miracle.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {t('delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
