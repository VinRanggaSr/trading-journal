import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DECORATION_COLORS = ['#EBB336', '#FC6228', '#02B4D4', '#1C72F0', '#F94197'];

export function FunnelSection({ stats }) {
  const segments = [
    { label: 'Sukses', value: stats.success, pct: stats.successPct, color: DECORATION_COLORS[0] },
    { label: 'Gagal', value: stats.fail, pct: stats.failPct, color: DECORATION_COLORS[1] },
    { label: 'Sedang Berjalan', value: stats.inProgress, pct: stats.inProgressPct, color: DECORATION_COLORS[2] },
    { label: 'Tidak Memenuhi Syarat', value: stats.notQualified, pct: stats.notQualifiedPct, color: DECORATION_COLORS[3] }
  ];

  const chartData = segments.filter((s) => s.value > 0);

  return (
    <div>
      <p className="label-caps mb-3">Ringkasan Semua Journal ({stats.total})</p>

      {stats.total === 0 ? (
        <p className="text-sm text-ink-faint">Belum ada data journal.</p>
      ) : (
        <div className="flex flex-col items-center gap-8 sm:flex-row">
          <div className="relative h-[190px] w-[190px] shrink-0">
            <div className="absolute inset-3 rounded-full border border-dashed border-border" />
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={62}
                  outerRadius={82}
                  paddingAngle={8}
                  cornerRadius={8}
                  startAngle={90}
                  endAngle={-270}
                  isAnimationActive={false}
                  stroke="none"
                >
                  {chartData.map((s) => (
                    <Cell key={s.label} fill={s.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-mono text-3xl font-bold text-ink">{stats.total}</p>
              <p className="text-xs text-ink-muted">Total Journal</p>
            </div>
          </div>

          <div className="w-full flex-1 divide-y divide-dashed divide-border">
            {segments.map((s) => (
              <div
                key={s.label}
                className="flex flex-wrap items-center justify-between gap-y-1 py-3 text-sm first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-ink-muted">{s.label}</span>
                  <span className="shrink-0 rounded-full bg-[#EFEFF1] px-2 py-0.5 text-xs text-ink-faint">
                    {s.value} Journal
                  </span>
                </div>
                <span className="font-mono font-semibold text-ink">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
