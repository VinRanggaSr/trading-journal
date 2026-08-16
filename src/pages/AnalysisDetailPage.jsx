import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Trash2 } from 'lucide-react';
import * as api from '../lib/api';
import { Button } from '../components/ui/button';
import { Input, Label } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { RichTextEditor } from '../features/stock-analysis/RichTextEditor';
import { TagInput } from '../features/stock-analysis/TagInput';
import { StockChart } from '../features/stock-analysis/StockChart';
import { Card, CardContent } from '../components/ui/card';
import { cn } from '../lib/utils';

const emptyForm = { ticker: '', fundamental: '', technical: '', moneyFlow: '', otherNotes: '', tags: '' };

export function AnalysisDetailPage() {
  const { analysisId } = useParams();
  const isNew = analysisId === 'new';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(isNew ? emptyForm : null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');
  const loadedIdRef = useRef(isNew ? 'new' : null);

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['stockAnalysis'],
    queryFn: api.getStockAnalysis
  });

  const analysis = isNew ? null : analyses.find((a) => a.AnalysisID === analysisId);

  useEffect(() => {
    if (!isNew && analysis && loadedIdRef.current !== analysisId) {
      loadedIdRef.current = analysisId;
      setConfirmDelete(false);
      setForm({
        ticker: analysis.Ticker || '',
        fundamental: analysis.Fundamental || '',
        technical: analysis.Technical || '',
        moneyFlow: analysis.MoneyFlow || '',
        otherNotes: analysis.OtherNotes || '',
        tags: analysis.Tags || ''
      });
    }
  }, [analysis, analysisId, isNew]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['stockAnalysis'] });
  }

  const createMutation = useMutation({
    mutationFn: api.createStockAnalysis,
    onSuccess: () => {
      invalidate();
      navigate('/analysis');
    }
  });
  const updateMutation = useMutation({ mutationFn: api.updateStockAnalysis, onSuccess: invalidate });
  const deleteMutation = useMutation({
    mutationFn: api.deleteStockAnalysis,
    onSuccess: () => {
      invalidate();
      navigate('/analysis');
    }
  });

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ticker: form.ticker.toUpperCase(),
      fundamental: form.fundamental,
      technical: form.technical,
      moneyFlow: form.moneyFlow,
      otherNotes: form.otherNotes,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    };

    if (isNew) {
      createMutation.mutate(payload);
    } else {
      updateMutation.mutate({ analysisId, ...payload });
    }
  }

  function handleDelete() {
    deleteMutation.mutate({ analysisId });
  }

  if (!isNew && isLoading) {
    return <p className="text-sm text-ink-muted">Memuat...</p>;
  }

  if (!isNew && !analysis) {
    return (
      <div>
        <Link to="/analysis" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft size={15} />
          Kembali ke Analisis
        </Link>
        <p className="mt-6 text-sm text-ink-muted">Analisis tidak ditemukan.</p>
      </div>
    );
  }

  if (!form) return null;

  const saveMutation = isNew ? createMutation : updateMutation;

  const tabsBar = (
    <div className="flex w-full items-center gap-1 rounded-xl bg-[#EFEFF1] p-1">
      <button
        type="button"
        onClick={() => setActiveTab('notes')}
        className={cn(
          'flex-1 rounded-[10px] px-4 py-1.5 text-sm font-medium transition-colors',
          activeTab === 'notes' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
        )}
      >
        Analysis
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('chart')}
        className={cn(
          'flex-1 rounded-[10px] px-4 py-1.5 text-sm font-medium transition-colors',
          activeTab === 'chart' ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
        )}
      >
        Chart
      </button>
    </div>
  );

  return (
    <div>
      <Link to="/analysis" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft size={15} />
        Kembali ke Analisis
      </Link>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            {isNew ? 'Analisis Saham Baru' : analysis.Ticker}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {isNew
              ? 'Simpan tesis kamu untuk saham ini'
              : `Terakhir update ${new Date(analysis.UpdatedDate).toLocaleDateString('id-ID')}`}
          </p>
        </div>

        {!confirmDelete && (
          <div className="flex shrink-0 items-center gap-2">
            {!isNew && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                title="Hapus analisis"
                className="rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 size={17} />
              </button>
            )}
            <Button type="button" variant="secondary" className="flex-1 sm:flex-none" onClick={() => navigate('/analysis')}>
              Batal
            </Button>
            <Button type="submit" form="analysisForm" className="flex-1 sm:flex-none" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">Hapus analisis {analysis.Ticker}?</p>
          <p className="mt-1 text-sm text-red-600">Aksi ini nggak bisa dibatalin.</p>
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
              Batal
            </Button>
          </div>
          {deleteMutation.isError && <p className="mt-2 text-sm text-red-600">{deleteMutation.error.message}</p>}
        </div>
      )}

      {!confirmDelete && (
        <form id="analysisForm" onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1">
              {activeTab === 'chart' ? (
                <Card>
                  <div className="p-2 pb-0">{tabsBar}</div>
                  <CardContent className="p-3">
                    <StockChart ticker={form.ticker} />
                  </CardContent>
                </Card>
              ) : (
                <RichTextEditor
                  key={analysisId}
                  content={form.otherNotes}
                  onChange={(html) => setForm((f) => ({ ...f, otherNotes: html }))}
                  placeholder="Masukan hasil analisis anda"
                  tabs={tabsBar}
                />
              )}
            </div>

            <div className="order-first w-full shrink-0 space-y-4 bg-bg lg:order-none lg:w-[300px] lg:sticky lg:top-6 lg:self-start">
              <div>
                <Label htmlFor="ticker">Ticker</Label>
                <Input
                  id="ticker"
                  required
                  value={form.ticker}
                  onChange={(e) => setForm({ ...form, ticker: e.target.value })}
                  placeholder="BBCA"
                  className="bg-bg"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (tekan Enter untuk menambahkan)</Label>
                <TagInput
                  id="tags"
                  value={form.tags}
                  onChange={(v) => setForm({ ...form, tags: v })}
                  placeholder="banking, bluechip"
                />
              </div>
              <div>
                <Label htmlFor="fundamental">Fundamental</Label>
                <Textarea
                  id="fundamental"
                  rows={4}
                  value={form.fundamental}
                  onChange={(e) => setForm({ ...form, fundamental: e.target.value })}
                  className="bg-bg"
                />
              </div>
              <div>
                <Label htmlFor="technical">Teknikal</Label>
                <Textarea
                  id="technical"
                  rows={4}
                  value={form.technical}
                  onChange={(e) => setForm({ ...form, technical: e.target.value })}
                  className="bg-bg"
                />
              </div>
              <div>
                <Label htmlFor="moneyFlow">Money Flow</Label>
                <Textarea
                  id="moneyFlow"
                  rows={4}
                  value={form.moneyFlow}
                  onChange={(e) => setForm({ ...form, moneyFlow: e.target.value })}
                  className="bg-bg"
                />
              </div>
            </div>
          </div>

          {saveMutation.isError && <p className="mt-4 text-sm text-red-600">{saveMutation.error.message}</p>}
        </form>
      )}
    </div>
  );
}
