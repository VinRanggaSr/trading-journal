import { useState, useRef, useEffect } from 'react';
import { Eye, Filter } from 'lucide-react';
import { Card, CardHeader, CardLabel, CardContent } from '../../components/ui/card';
import { StatCard } from './StatCard';
import { useLivePositions } from '../../hooks/useLivePositions';
import { JournalDetailDialog } from '../journal/JournalDetailDialog';
import { StatusBadge } from '../journal/StatusBadge';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { useNominalVisibility } from '../../context/NominalVisibilityContext';
import { cn } from '../../lib/utils';

const STATUS_ORDER = ['Pending', 'No Entry', 'Entry', 'TP Partial', 'TP', 'CL'];
const STATUS_LABELS = {
  Pending: 'Pending',
  'No Entry': 'No Entry',
  Entry: 'Entry',
  'TP Partial': 'TP Partial',
  TP: 'Take Profit',
  CL: 'Cut Loss'
};

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
  const [filterOpen, setFilterOpen] = useState(false);
  const [hiddenStatuses, setHiddenStatuses] = useState(() => new Set());
  const filterRef = useRef(null);
  const { rows, isLoadingPrices } = useLivePositions(journals);

  useEffect(() => {
    if (!filterOpen) return;
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterOpen]);

  let totalIn = 0;
  let totalNow = 0;
  let activeModal = 0;
  let activeProfit = 0;

  rows.forEach((r) => {
    totalIn += r.totalNominalIn;
    totalNow += r.totalValue;
    if (r.isOpen) {
      activeModal += r.modalRemaining;
      activeProfit += r.currentValueRemaining - r.modalRemaining;
    }
  });

  const totalProfitLoss = totalNow - totalIn;

  const statusOptions = STATUS_ORDER.filter((s) => rows.some((r) => r.status === s));
  const visibleRows = rows.filter((r) => !hiddenStatuses.has(r.status));

  function toggleStatus(status) {
    setHiddenStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

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
                    <th className="label-caps px-3 py-2 text-left font-semibold">
                      <div className="relative flex items-center gap-1" ref={filterRef}>
                        <span>Status</span>
                        <button
                          type="button"
                          onClick={() => setFilterOpen((v) => !v)}
                          title="Filter status"
                          className="rounded p-0.5 text-ink-faint transition-colors hover:bg-bg hover:text-ink-muted"
                        >
                          <Filter size={12} />
                        </button>

                        {filterOpen && (
                          <div className="absolute left-0 top-full z-20 mt-1.5 w-44 rounded-xl border border-border bg-white p-2 normal-case shadow-card">
                            {statusOptions.map((status) => (
                              <label
                                key={status}
                                className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1.5 text-sm font-normal text-ink hover:bg-bg"
                              >
                                <Checkbox
                                  checked={!hiddenStatuses.has(status)}
                                  onChange={() => toggleStatus(status)}
                                />
                                {STATUS_LABELS[status] || status}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </th>
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
                  {visibleRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-3 py-6 text-center text-sm text-ink-faint">
                        Tidak ada posisi dengan status yang dipilih.
                      </td>
                    </tr>
                  ) : (
                    visibleRows.map((r) => (
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
                    ))
                  )}
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
