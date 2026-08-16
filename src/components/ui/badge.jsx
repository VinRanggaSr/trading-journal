import { cn } from '../../lib/utils';

const styles = {
  gray: 'bg-gray-100 text-gray-600',
  purple: 'bg-accent-purple/10 text-accent-purple',
  orange: 'bg-accent-orange/10 text-accent-orange',
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-600'
};

export function Badge({ tone = 'gray', className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold',
        styles[tone],
        className
      )}
      {...props}
    />
  );
}
