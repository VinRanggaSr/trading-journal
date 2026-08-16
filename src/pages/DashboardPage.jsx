import { useQuery } from '@tanstack/react-query';
import * as api from '../lib/api';
import { computeFunnelStats } from '../lib/journalStats';
import { FunnelSection } from '../features/dashboard/FunnelSection';
import { PortfolioSection } from '../features/dashboard/PortfolioSection';

export function DashboardPage() {
  const {
    data: journals = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['journals'],
    queryFn: api.getJournals
  });

  const stats = computeFunnelStats(journals);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-muted">Ringkasan performa trading kamu.</p>
      </div>

      {isLoading && <p className="text-sm text-ink-muted">Memuat data...</p>}
      {isError && <p className="text-sm text-red-600">{error.message}</p>}

      {!isLoading && !isError && (
        <>
          <FunnelSection stats={stats} />
          <PortfolioSection journals={journals} />
        </>
      )}
    </div>
  );
}
