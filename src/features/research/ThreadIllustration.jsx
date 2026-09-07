import { LineChart, Send } from 'lucide-react';

export function ThreadIllustration({ className = '' }) {
  return (
    <div className={`w-[42%] ${className}`}>
      <div className="flex w-[102px] items-center gap-1.5 rounded-md border border-border bg-white px-1.5 py-1">
        <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-border">
          <LineChart size={7} strokeWidth={2.5} className="text-ink-faint" />
        </div>
        <div className="h-1 w-16 rounded-full bg-border" />
      </div>

      <div className="ml-[26.25%] mt-1.5 flex w-[102px] items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50 px-1.5 py-1">
        <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-blue-400">
          <Send size={7} strokeWidth={2.5} className="text-white" />
        </div>
        <div className="h-1 flex-1 rounded-full bg-blue-300" />
      </div>

      <div className="mt-1.5 flex w-[102px] items-center gap-1.5 rounded-md border border-border bg-white px-1.5 py-1">
        <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-border">
          <LineChart size={7} strokeWidth={2.5} className="text-ink-faint" />
        </div>
        <div className="h-1 w-16 rounded-full bg-border" />
      </div>
    </div>
  );
}
