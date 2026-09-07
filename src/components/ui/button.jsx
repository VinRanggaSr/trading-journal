import { cn } from '../../lib/utils';

const variants = {
  primary: 'bg-ink text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:bg-ink/90',
  secondary: 'bg-white text-ink border border-border hover:bg-bg',
  ghost: 'bg-transparent text-ink-muted hover:bg-bg hover:text-ink'
};

const sizes = {
  default: 'h-10 px-4 text-sm',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-12 px-6 text-base'
};

export function Button({ className, variant = 'primary', size = 'default', href, ...props }) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors',
    'disabled:opacity-50 disabled:pointer-events-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30',
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return <a href={href} className={classes} {...props} />;
  }

  return <button className={classes} {...props} />;
}
