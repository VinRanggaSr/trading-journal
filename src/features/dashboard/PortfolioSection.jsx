import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import * as api from '../../lib/api';
import { Card, CardHeader, CardLabel, CardContent } from '../../components/ui/card';
import { StatCard } from './StatCard';
import { computePosition } from '../../lib/journalStats';
import { JournalDetailDialog } from '../journal/JournalDetailDialog';
import { StatusBadge } from '../journal/StatusBadge';
import { Badge } from '../../components/ui/badge';
import { useNominalVisibility } from '../../context/NominalVisibilityContext';
import { cn } from '../../lib/utils';

function formatIDR(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '-';
  return 'Rp' + new Intl.NumberFormat('id-ID').format(Math.round(n));
}

function formatSignedIDR(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '-';
  const sign = n < 0 ? '-' : '+';
  return sign + 'Rp' + new Intl.NumberFormat('id-ID').format(Math.round(Math.abs(n)));
}

export function PortfolioSection({ journals }) {
  const { hidden } = useNominalVisibility();
  const [selectedJournalId, setSelectedJournalId] = useState(null);
  const positions = journals.map(computePosition).filter(Boolean);
  const openTickers = [...new Set(positions.filter((p) => p.isOpen).map((p) => p.ticker))];

  const priceQueries = useQueries({
    queries: openTickers.map((ticker) => ({
      queryKey: ['price', ticker],
      queryFn: () => api.getPrice(ticker),
      staleTime: 60 * 1000
    }))
  });

  const priceMap = {};
  openTickers.forEach((ticker, idx) => {
    const q = priceQueries[idx];
    if (q.data) priceMap[ticker] = q.data.price;
  });

  let totalIn = 0;
  let totalNow = 0;
  let activeModal = 0;
  let activeProfit = 0;

  const rows = positions.map((p) => {
    totalIn += p.totalNominalIn;
    let currentValueRemaining = 0;
    // Modal yang masih "nyangkut" di posisi ini - berkurang seiring exit partial,
    // dan jadi 0 begitu posisi ditutup penuh (remainingPercent = 0).
    const modalRemaining = (p.remainingPercent / 100) * p.totalNominalIn;

    if (p.isOpen) {
      const livePrice = priceMap[p.ticker];
      if (livePrice && p.avgEntryPrice > 0) {
        currentValueRemaining = modalRemaining * (livePrice / p.avgEntryPrice);
      } else {
        // Harga live belum termuat - fallback sementara pakai nilai modal apa adanya
        currentValueRemaining = modalRemaining;
      }
      activeModal += modalRemaining;
      activeProfit += currentValueRemaining - modalRemaining;
    }

    const totalValue = p.realizedValue + currentValueRemaining;
    totalNow += totalValue;
    const growthPct = p.totalNominalIn > 0 ? ((totalValue - p.totalNominalIn) / p.totalNominalIn) * 100 : 0;

    // Growth aktif: untung/rugi murni dari posisi yang MASIH terbuka (modal aktif vs nilai
    // aktif) - beda dari Growth (Rp)/(%) di atas yang menghitung total lifetime (realized +
    // unrealized dari modal awal). null kalau posisi sudah ditutup penuh (tidak ada lagi yang aktif).
    const growthActiveRp = modalRemaining > 0 ? currentValueRemaining - modalRemaining : null;
    const growthActivePct = modalRemaining > 0 ? (growthActiveRp / modalRemaining) * 100 : null;

    return { ...p, totalValue, growthPct, modalRemaining, currentValueRemaining, growthActiveRp, growthActivePct };
  });

  const totalProfitLoss = totalNow - totalIn;
  const isLoadingPrices = priceQueries.some((q) => q.isLoading);

  return (
    <div>
      <Card className="bg-[#EFEFF1]">
        <CardHeader className="px-[18px] pb-[9px] pt-[15px]">
          <CardLabel>Performa Posisi Entry</CardLabel>
        </CardHeader>
        <CardContent className="px-[9px] pb-[9px] pt-0">
          <div className="mb-[9px] grid grid-cols-1 gap-2 sm:grid-cols-3">
            <StatCard
              label="Modal Aktif Entry"
              value={hidden ? '******' : formatIDR(activeModal)}
              sub="Posisi yang masih terbuka"
            />
            <StatCard
              label="Profit Posisi Aktif"
              value={hidden ? '******' : formatSignedIDR(activeProfit)}
              valueClassName={activeProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}
              sub={isLoadingPrices ? 'Memuat harga live...' : 'Belum direalisasi'}
            />
            <StatCard
              label="Total Untung/Rugi"
              value={hidden ? '******' : formatSignedIDR(totalProfitLoss)}
              valueClassName={totalProfitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}
              sub="Realized + belum direalisasi"
            />
          </div>

          {rows.length === 0 ? (
            <p className="text-sm text-ink-faint">Belum ada posisi yang di-entry.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-surface">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="label-caps px-3 py-2 text-left font-semibold">Ticker</th>
                    <th className="label-caps px-3 py-2 text-left font-semibold">Status</th>
                    <th className="label-caps px-3 py-2 text-right font-semibold">Total Modal</th>
                    <th className="label-caps px-3 py-2 text-right font-semibold">Modal Aktif</th>
                    <th className="label-caps px-3 py-2 text-right font-semibold">Nilai Aktif</th>
                    <th className="label-caps px-3 py-2 text-right font-semibold">Growth Aktif</th>
                    <th className="label-caps px-3 py-2 text-right font-semibold">Growth (Rp)</th>
                    <th className="label-caps px-3 py-2 text-right font-semibold">Growth (%)</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.journalId} className="border-b border-border last:border-0">
                      <td className="px-3 py-1.5 font-semibold text-ink">{r.ticker}</td>
                      <td className="px-3 py-1.5">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-3 py-1.5 text-right text-ink-muted">
                        {hidden ? '******' : formatIDR(r.totalNominalIn)}
                      </td>
                      <td className="px-3 py-1.5 text-right text-ink-muted">
                        {hidden ? '******' : formatIDR(r.modalRemaining)}
                      </td>
                      <td className="px-3 py-1.5 text-right font-medium text-ink">
                        {hidden ? '******' : formatIDR(r.currentValueRemaining)}
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        {r.growthActiveRp === null ? (
                          <span className="text-ink-faint">-</span>
                        ) : (
                          <span className={cn(r.growthActiveRp >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                            {hidden ? '******' : formatSignedIDR(r.growthActiveRp)}
                            <span className="ml-1 text-xs text-ink-faint">
                              ({r.growthActivePct >= 0 ? '+' : ''}
                              {r.growthActivePct.toFixed(1)}%)
                            </span>
                          </span>
                        )}
                      </td>
                      <td
                        className={cn(
                          'px-3 py-1.5 text-right',
                          r.growthPct >= 0 ? 'text-emerald-600' : 'text-red-600'
                        )}
                      >
                        {hidden ? '******' : formatSignedIDR(r.totalValue - r.totalNominalIn)}
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        <Badge tone={r.growthPct >= 0 ? 'green' : 'red'}>
                          {r.growthPct >= 0 ? '+' : ''}
                          {r.growthPct.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedJournalId(r.journalId)}
                          title="Lihat detail journal"
                          className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-bg hover:text-ink"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <JournalDetailDialog
        journalId={selectedJournalId}
        open={Boolean(selectedJournalId)}
        onOpenChange={(next) => !next && setSelectedJournalId(null)}
      />
    </div>
  );
}
