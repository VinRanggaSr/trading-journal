import { cn } from '../../lib/utils';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-xl border border-border bg-white px-3 text-sm text-ink placeholder:text-ink-faint',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20',
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-ink', className)} {...props} />;
}
