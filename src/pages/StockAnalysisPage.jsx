import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import * as api from '../lib/api';
import { Button } from '../components/ui/button';
import { AnalysisCard } from '../features/stock-analysis/AnalysisCard';

export function StockAnalysisPage() {
  const navigate = useNavigate();

  const {
    data: analyses = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['stockAnalysis'],
    queryFn: api.getStockAnalysis
  });

  const sorted = [...analyses].sort((a, b) => new Date(b.UpdatedDate) - new Date(a.UpdatedDate));

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Analisis Saham</h1>
          <p className="mt-1 text-sm text-ink-muted">Tesis fundamental, teknikal, dan money flow tiap saham.</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => navigate('/analysis/new')}>
          <Plus size={16} />
          Analisis Baru
        </Button>
      </div>

      {isLoading && <p className="mt-6 text-sm text-ink-muted">Memuat...</p>}
      {isError && <p className="mt-6 text-sm text-red-600">{error.message}</p>}

      {!isLoading && !isError && sorted.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-ink-muted">Belum ada analisis saham.</p>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((a) => (
          <AnalysisCard key={a.AnalysisID} analysis={a} onClick={() => navigate(`/analysis/${a.AnalysisID}`)} />
        ))}
      </div>
    </div>
  );
}
