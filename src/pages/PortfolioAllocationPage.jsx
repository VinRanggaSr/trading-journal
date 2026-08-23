import { useQuery } from '@tanstack/react-query';
import * as api from '../lib/api';
import { PortfolioAllocationSection } from '../features/dashboard/PortfolioAllocationSection';

export function PortfolioAllocationPage() {
  const {
    data: journals = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['journals'],
    queryFn: api.getJournals
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Alokasi Portfolio</h1>
        <p className="mt-1 text-sm text-ink-muted">Distribusi modal aktif kamu di tiap ticker.</p>
      </div>

      {isLoading && <p className="text-sm text-ink-muted">Memuat data...</p>}
      {isError && <p className="text-sm text-red-600">{error.message}</p>}

      {!isLoading && !isError && <PortfolioAllocationSection journals={journals} />}
    </div>
  );
}
