import { useLivePrice } from '../../hooks/useLivePrice';
import { useNominalVisibility } from '../../context/NominalVisibilityContext';
import { cn } from '../../lib/utils';

function formatIDR(n) {
  return new Intl.NumberFormat('id-ID').format(n);
}

export function LivePrice({ ticker, planPrice, className }) {
  const { price, isLoading, isError } = useLivePrice(ticker);
  const { hidden } = useNominalVisibility();

  if (isLoading) {
    return <div className={cn('h-[1em] w-20 animate-pulse rounded bg-bg', className)} />;
  }

  if (isError || !price) {
    return <span className={cn('text-ink-faint', className)}>-</span>;
  }

  const plan = Number(planPrice);
  const diffPct = plan > 0 ? ((price - plan) / plan) * 100 : null;

  return (
    <span className={cn('inline-flex items-baseline gap-1.5', className)}>
      <span className="font-semibold text-ink">{hidden ? '******' : `Rp${formatIDR(price)}`}</span>
      {diffPct !== null && (
        <span className={cn('text-xs font-medium', diffPct >= 0 ? 'text-emerald-600' : 'text-red-600')}>
          {diffPct >= 0 ? '+' : ''}
          {diffPct.toFixed(1)}%
        </span>
      )}
    </span>
  );
}
