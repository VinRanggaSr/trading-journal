import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-60">
        <header className="flex items-center gap-3 border-b border-border bg-bg px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-[#EFEFF1] hover:text-ink"
            aria-label="Buka menu"
          >
            <Menu size={20} />
          </button>
          <p className="text-sm font-bold tracking-tight text-ink">Trading Journal</p>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
