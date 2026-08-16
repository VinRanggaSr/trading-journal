import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { StatusBadge } from './StatusBadge';
import { LivePrice } from './LivePrice';

function formatIDR(n) {
  if (n === '' || n === null || n === undefined || Number.isNaN(Number(n))) return '-';
  return new Intl.NumberFormat('id-ID').format(n);
}

export function JournalCard({ journal, onClick, hideStatus = false }) {
  return (
    <Card onClick={onClick} className="cursor-pointer p-2.5 shadow-none">
      <div className="px-2.5 pt-[5px]">
        <div className="flex items-start justify-between gap-2">
          <p className="text-base font-bold text-ink">{journal.Ticker}</p>
          <div className="flex items-center gap-1.5">
            <Badge tone="gray">R:R {journal.RiskReward || '-'}</Badge>
            {!hideStatus && <StatusBadge status={journal.Status} />}
          </div>
        </div>

        <div className="mt-0.5 text-sm">
          <LivePrice ticker={journal.Ticker} planPrice={journal.PlanPrice} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-border bg-bg px-3 py-[8.4px] text-center">
        <div>
          <p className="label-caps">Plan</p>
          <p className="text-sm font-semibold text-ink">{formatIDR(journal.PlanPrice)}</p>
        </div>
        <div>
          <p className="label-caps text-accent-orange">TP</p>
          <p className="text-sm font-semibold text-ink">{formatIDR(journal.TP)}</p>
        </div>
        <div>
          <p className="label-caps">CL</p>
          <p className="text-sm font-semibold text-ink">{formatIDR(journal.CL)}</p>
        </div>
      </div>
    </Card>
  );
}
