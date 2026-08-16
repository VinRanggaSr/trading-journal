import { cn } from '../../lib/utils';

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-faint',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20',
        className
      )}
      {...props}
    />
  );
}
