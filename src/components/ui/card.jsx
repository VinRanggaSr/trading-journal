import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-2xl border border-border bg-surface shadow-card', className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('flex items-center justify-between px-6 pt-5 pb-3', className)} {...props} />;
}

export function CardLabel({ className, ...props }) {
  return <p className={cn('label-caps', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('px-6 pb-6', className)} {...props} />;
}

export function CardMetric({ className, ...props }) {
  return <p className={cn('font-mono text-3xl font-bold text-ink', className)} {...props} />;
}
