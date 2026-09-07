export function DocStackIllustration({ className = '' }) {
  return (
    <div className={`relative h-16 w-32 ${className}`}>
      <div className="absolute left-0 top-3 h-16 w-12 -rotate-6 rounded-lg border border-border bg-white p-1.5">
        <div className="h-1.5 w-7 rounded-full bg-accent-orange/70" />
        <div className="mt-1.5 h-1 w-8 rounded-full bg-border" />
        <div className="mt-1 h-1 w-6 rounded-full bg-border" />
        <div className="mt-1 h-1 w-7 rounded-full bg-border" />
      </div>

      <div className="absolute left-9 top-0 h-16 w-12 rotate-2 rounded-lg border border-border bg-white p-1.5">
        <div className="grid grid-cols-2 gap-0.5">
          <div className="h-2 rounded-sm bg-[#EFEFF1]" />
          <div className="h-2 rounded-sm bg-red-200" />
          <div className="h-2 rounded-sm bg-[#EFEFF1]" />
          <div className="h-2 rounded-sm bg-[#EFEFF1]" />
        </div>
        <div className="mt-1.5 h-1 w-8 rounded-full bg-border" />
        <div className="mt-1 h-1 w-6 rounded-full bg-border" />
      </div>

      <div className="absolute left-[4.5rem] top-1.5 h-16 w-12 rotate-12 rounded-lg border border-border bg-white p-1.5">
        <div className="h-1.5 w-7 rounded-full bg-emerald-300" />
        <div className="mt-1.5 h-1 w-8 rounded-full bg-border" />
        <div className="mt-1 h-1 w-5 rounded-full bg-border" />
        <div className="mt-1 h-1 w-7 rounded-full bg-border" />
      </div>
    </div>
  );
}
