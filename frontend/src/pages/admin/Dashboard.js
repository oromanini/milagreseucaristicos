import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
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
import { Plus, Upload, Pencil, Trash2, Loader2, Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { API_URL } from '../../lib/api';

const API = API_URL;

export const Dashboard = () => {
  const { t } = useLanguage();
  const [miracles, setMiracles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, recognized: 0, investigating: 0, countries: 0 });
  const [filters, setFilters] = useState({ countries: [], centuries: [] });

  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [century, setCentury] = useState('');
  const [status, setStatus] = useState('');

  const [centuryToDelete, setCenturyToDelete] = useState('');
  const [deletingCentury, setDeletingCentury] = useState(false);

  useEffect(() => {
    fetchFiltersAndStats();
  }, []);

  useEffect(() => {
    fetchMiracles();
  }, [search, country, century, status]);

  const fetchFiltersAndStats = async () => {
    try {
      const [filtersRes, statsRes] = await Promise.all([
        axios.get(`${API}/filters`),
        axios.get(`${API}/stats`)
      ]);
      setFilters(filtersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching metadata:', error);
      toast.error(t('error'));
    }
  };

  const fetchMiracles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (country) params.append('country', country);
      if (century) params.append('century', century);
      if (status) params.append('status', status);

      const miraclesRes = await axios.get(`${API}/miracles?${params.toString()}`);
      setMiracles(miraclesRes.data);
    } catch (error) {
      console.error('Error fetching miracles:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/miracles/${id}`);
      setMiracles(miracles.filter(m => m.id !== id));
      toast.success('Milagre excluído com sucesso.');
      fetchFiltersAndStats();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error(t('error'));
    }
  };

  const handleDeleteByCentury = async () => {
    if (!centuryToDelete) {
      toast.error('Selecione um século para excluir.');
      return;
    }

    setDeletingCentury(true);
    try {
      const response = await axios.delete(`${API}/miracles/by-century/${encodeURIComponent(centuryToDelete)}`);
      const removedCount = response.data?.deleted_count ?? 0;
      toast.success(`${removedCount} milagre(s) removido(s) do século ${centuryToDelete}.`);
      setCenturyToDelete('');
      await Promise.all([fetchMiracles(), fetchFiltersAndStats()]);
    } catch (error) {
      console.error('Error deleting by century:', error);
      const detail = error?.response?.data?.detail;
      toast.error(detail || t('error'));
    } finally {
      setDeletingCentury(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCountry('');
    setCentury('');
    setStatus('');
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

      {/* Filters */}
      <div className="bg-[#121214] border border-[#27272A] p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome do milagre"
              className="pl-9 border-[#27272A] text-[#E5E5E5]"
              data-testid="admin-filter-search"
            />
          </div>

          <Select value={country || 'all'} onValueChange={(value) => setCountry(value === 'all' ? '' : value)}>
            <SelectTrigger className="border-[#27272A] text-[#E5E5E5]" data-testid="admin-filter-country">
              <SelectValue placeholder="Todos os países" />
            </SelectTrigger>
            <SelectContent className="bg-[#121214] border-[#27272A] text-[#E5E5E5]">
              <SelectItem value="all">Todos os países</SelectItem>
              {filters.countries.map((item) => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={century || 'all'} onValueChange={(value) => setCentury(value === 'all' ? '' : value)}>
            <SelectTrigger className="border-[#27272A] text-[#E5E5E5]" data-testid="admin-filter-century">
              <SelectValue placeholder="Todos os séculos" />
            </SelectTrigger>
            <SelectContent className="bg-[#121214] border-[#27272A] text-[#E5E5E5]">
              <SelectItem value="all">Todos os séculos</SelectItem>
              {filters.centuries.map((item) => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status || 'all'} onValueChange={(value) => setStatus(value === 'all' ? '' : value)}>
            <SelectTrigger className="border-[#27272A] text-[#E5E5E5]" data-testid="admin-filter-status">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent className="bg-[#121214] border-[#27272A] text-[#E5E5E5]">
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="recognized">{t('recognized')}</SelectItem>
              <SelectItem value="investigating">{t('investigating')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3 flex justify-end">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="border-[#27272A] text-[#A1A1AA] hover:text-[#D4AF37] hover:border-[#D4AF37]"
            data-testid="admin-clear-filters"
          >
            Limpar filtros
          </Button>
        </div>
      </div>

      {/* Delete by century */}
      <div className="bg-[#121214] border border-red-900/40 p-4 mb-6">
        <p className="text-[#E5E5E5] font-medium mb-3">Exclusão em lote por século</p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <Select
            value={centuryToDelete || 'none'}
            onValueChange={(value) => setCenturyToDelete(value === 'none' ? '' : value)}
          >
            <SelectTrigger className="border-red-900/50 text-[#E5E5E5]" data-testid="admin-delete-century-select">
              <SelectValue placeholder="Selecione um século para excluir todos os milagres" />
            </SelectTrigger>
            <SelectContent className="bg-[#121214] border-[#27272A] text-[#E5E5E5]">
              <SelectItem value="none">Selecione um século</SelectItem>
              {filters.centuries.map((item) => (
                <SelectItem key={item} value={item}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-red-700 hover:bg-red-800"
                disabled={!centuryToDelete || deletingCentury}
                data-testid="admin-delete-century-btn"
              >
                {deletingCentury ? 'Excluindo...' : 'Excluir todos do século'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#121214] border-[#27272A]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#E5E5E5]">Confirmar exclusão em lote</AlertDialogTitle>
                <AlertDialogDescription className="text-[#A1A1AA]">
                  Esta ação removerá permanentemente todos os milagres do século "{centuryToDelete}".
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-[#27272A] text-[#A1A1AA]">{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteByCentury}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirmar exclusão
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
              Ajuste os filtros ou adicione novos milagres.
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
