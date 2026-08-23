import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardLabel, CardContent } from '../../components/ui/card';
import { StatCard } from './StatCard';
import { useLivePositions } from '../../hooks/useLivePositions';
import { useNominalVisibility } from '../../context/NominalVisibilityContext';

const PALETTE = [
  '#EBB336',
  '#FC6228',
  '#02B4D4',
  '#1C72F0',
  '#F94197',
  '#5E32FB',
  '#22C55E',
  '#F59E0B',
  '#EC4899',
  '#06B6D4',
  '#8B5CF6',
  '#EF4444'
];

function formatIDR(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '-';
  return 'Rp' + new Intl.NumberFormat('id-ID').format(Math.round(n));
}

function formatSignedIDR(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '-';
  const sign = n < 0 ? '-' : '+';
  return sign + 'Rp' + new Intl.NumberFormat('id-ID').format(Math.round(Math.abs(n)));
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-2xl border border-border bg-white px-3.5 py-2.5 text-sm shadow-card">
      <p className="font-semibold text-ink">{d.name}</p>
      <p className="text-ink-muted">{d.pct.toFixed(1)}%</p>
    </div>
  );
}

export function PortfolioAllocationSection({ journals }) {
  const { hidden } = useNominalVisibility();
  const { rows, isLoadingPrices } = useLivePositions(journals);

  const activeRows = rows.filter((r) => r.modalRemaining > 0);

  const byTicker = {};
  activeRows.forEach((r) => {
    if (!byTicker[r.ticker]) {
      byTicker[r.ticker] = { ticker: r.ticker, modalAktif: 0, nilaiAktif: 0, journalCount: 0 };
    }
    byTicker[r.ticker].modalAktif += r.modalRemaining;
    byTicker[r.ticker].nilaiAktif += r.currentValueRemaining;
    byTicker[r.ticker].journalCount += 1;
  });

  const totalModalAktif = Object.values(byTicker).reduce((sum, t) => sum + t.modalAktif, 0);
  const totalNilaiAktif = Object.values(byTicker).reduce((sum, t) => sum + t.nilaiAktif, 0);
  const totalProfitAktif = totalNilaiAktif - totalModalAktif;

  const tickerRows = Object.values(byTicker)
    .map((t) => ({
      ...t,
      profit: t.nilaiAktif - t.modalAktif,
      pct: totalNilaiAktif > 0 ? (t.nilaiAktif / totalNilaiAktif) * 100 : 0
    }))
    .sort((a, b) => b.nilaiAktif - a.nilaiAktif)
    .map((t, i) => ({ ...t, color: PALETTE[i % PALETTE.length] }));

  const chartData = tickerRows.map((t) => ({
    name: t.ticker,
    value: t.nilaiAktif > 0 ? t.nilaiAktif : t.modalAktif,
    pct: t.pct
  }));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Modal Aktif Saat Ini"
          value={hidden ? '******' : formatIDR(totalModalAktif)}
          sub="Total modal di posisi terbuka"
        />
        <StatCard
          label="Profit Posisi Aktif"
          value={hidden ? '******' : formatSignedIDR(totalProfitAktif)}
          valueClassName={totalProfitAktif >= 0 ? 'text-emerald-600' : 'text-red-600'}
          sub={isLoadingPrices ? 'Memuat harga live...' : 'Belum direalisasi'}
        />
        <StatCard
          label="Total Equity"
          value={hidden ? '******' : formatIDR(totalNilaiAktif)}
          sub="Modal aktif + profit posisi aktif"
        />
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardLabel>Alokasi per Ticker</CardLabel>
        </CardHeader>
        <CardContent>
          {tickerRows.length === 0 ? (
            <p className="text-sm text-ink-faint">Belum ada posisi aktif.</p>
          ) : (
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              <div className="relative h-[190px] w-[190px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      content={<ChartTooltip />}
                      allowEscapeViewBox={{ x: true, y: true }}
                      wrapperStyle={{ zIndex: 30, pointerEvents: 'none' }}
                    />
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={82}
                      paddingAngle={chartData.length > 1 ? 4 : 0}
                      cornerRadius={8}
                      startAngle={90}
                      endAngle={-270}
                      isAnimationActive={false}
                      stroke="none"
                    >
                      {chartData.map((d, i) => (
                        <Cell key={d.name} fill={tickerRows[i].color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p className="font-mono text-2xl font-bold text-ink">{tickerRows.length}</p>
                  <p className="text-xs text-ink-muted">Ticker Aktif</p>
                </div>
              </div>

              <div className="w-full flex-1 divide-y divide-dashed divide-border">
                {tickerRows.map((t) => {
                  return (
                    <div
                      key={t.ticker}
                      className="flex flex-wrap items-center justify-between gap-y-1 py-3 text-sm first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: t.color }} />
                        <span className="font-medium text-ink">{t.ticker}</span>
                        {t.journalCount > 1 && (
                          <span className="shrink-0 rounded-full bg-[#EFEFF1] px-2 py-0.5 text-xs text-ink-faint">
                            {t.journalCount} journal
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <span className="text-ink-muted">{hidden ? '******' : formatIDR(t.modalAktif)}</span>
                        <span className="w-12 shrink-0 font-mono font-semibold text-ink">{t.pct.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
