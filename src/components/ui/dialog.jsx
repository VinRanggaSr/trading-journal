import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') onOpenChange(false);
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-10">
      <div className="absolute inset-0" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}

export function DialogContent({ className, children }) {
  return (
    <div className={cn('mx-auto w-full max-w-lg rounded-2xl border border-border bg-surface shadow-card', className)}>
      {children}
    </div>
  );
}

export function DialogHeader({ title, subtitle, onClose, actions }) {
  return (
    <div className="flex items-start justify-between border-b border-border px-4 py-4 sm:px-6">
      <div>
        <p className="text-base font-bold text-ink">{title}</p>
        {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-1">
        {actions}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-ink-faint transition-colors hover:bg-bg hover:text-ink"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

export function DialogBody({ className, children }) {
  return <div className={cn('max-h-[70vh] overflow-y-auto px-4 py-5 sm:px-6', className)}>{children}</div>;
}

export function DialogFooter({ className, children }) {
  return (
    <div className={cn('flex items-center justify-end gap-2 border-t border-border px-4 py-4 sm:px-6', className)}>
      {children}
    </div>
  );
}
