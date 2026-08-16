import { Card } from '../../components/ui/card';
import { cn } from '../../lib/utils';

const BAR_SEGMENTS = 24;

export function StatCard({ label, value, sub, accent, valueClassName }) {
  const filledBars = accent ? Math.round((accent.pct / 100) * BAR_SEGMENTS) : 0;

  return (
    <Card className="p-5 shadow-none">
      <p className="label-caps">{label}</p>
      <p className={cn('mt-2 font-mono text-2xl font-bold text-ink', valueClassName)}>{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-muted">{sub}</p>}
      {accent && (
        <div className="mt-3 flex items-center gap-[3px]">
          {Array.from({ length: BAR_SEGMENTS }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-[3px] rounded-full"
              style={{ backgroundColor: i < filledBars ? accent.color : '#E9E9EB' }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
