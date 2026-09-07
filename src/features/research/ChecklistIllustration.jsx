import { Check } from 'lucide-react';

export function ChecklistIllustration({ className = '' }) {
  return (
    <div className={`w-[42%] ${className}`}>
      <div className="flex w-[102px] items-center gap-1.5 rounded-md border border-border bg-white px-1.5 py-1">
        <div className="h-3 w-3 shrink-0 rounded-[3px] border border-border" />
        <div className="h-1 w-16 rounded-full bg-border" />
      </div>

      <div className="ml-[26.25%] mt-1.5 flex w-[102px] items-center gap-1.5 rounded-md border border-emerald-100 bg-emerald-50 px-1.5 py-1">
        <div className="flex h-3 w-3 shrink-0 items-center justify-center rounded-[3px] bg-emerald-400">
          <Check size={9} strokeWidth={3} className="text-white" />
        </div>
        <div className="h-1 flex-1 rounded-full bg-emerald-300" />
      </div>

      <div className="mt-1.5 flex w-[102px] items-center gap-1.5 rounded-md border border-border bg-white px-1.5 py-1">
        <div className="h-3 w-3 shrink-0 rounded-[3px] border border-border" />
        <div className="h-1 w-16 rounded-full bg-border" />
      </div>
    </div>
  );
}
