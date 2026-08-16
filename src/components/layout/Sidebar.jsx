import { NavLink } from 'react-router-dom';
import { NotebookPen, LayoutDashboard, LineChart, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/journal', label: 'Journal', icon: NotebookPen },
  { to: '/analysis', label: 'Analisis Saham', icon: LineChart }
];

export function Sidebar({ mobileOpen = false, onMobileClose = () => {} }) {
  const { logout } = useAuth();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-border bg-bg px-3 py-6 transition-transform duration-200 ease-out',
          'lg:w-60 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="mb-6 flex items-center justify-between px-2.5">
          <p className="text-sm font-bold tracking-tight text-ink">Trading Journal</p>
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-1 text-ink-faint transition-colors hover:bg-[#EFEFF1] hover:text-ink lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-[#EFEFF1] text-ink' : 'text-ink-muted hover:bg-[#EFEFF1] hover:text-ink'
                )
              }
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut size={16} strokeWidth={2} />
          Keluar
        </button>
      </aside>
    </>
  );
}
