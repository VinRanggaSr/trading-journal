import { cn } from '../../lib/utils';

export function Checkbox({ className, ...props }) {
  return (
    <input
      type="checkbox"
      className={cn('h-4 w-4 shrink-0 rounded border-border accent-ink', className)}
      {...props}
    />
  );
}
