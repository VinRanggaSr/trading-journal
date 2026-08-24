import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NotebookPen, LayoutDashboard, LineChart, PieChart, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNominalVisibility } from '../../context/NominalVisibilityContext';
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input, Label } from '../ui/input';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/alokasi-portfolio', label: 'Alokasi Portfolio', icon: PieChart },
  { to: '/journal', label: 'Journal', icon: NotebookPen },
  { to: '/analysis', label: 'Analisis Saham', icon: LineChart }
];

export function Sidebar({ mobileOpen = false, onMobileClose = () => {} }) {
  const { logout } = useAuth();
  const { hidden, hide, unlock, error, verifying } = useNominalVisibility();
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [password, setPassword] = useState('');

  function handleToggle() {
    if (hidden) {
      setPassword('');
      setUnlockOpen(true);
    } else {
      hide();
    }
  }

  async function handleUnlockSubmit(e) {
    e.preventDefault();
    const success = await unlock(password);
    if (success) {
      setUnlockOpen(false);
      setPassword('');
    }
  }

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
          <p className="text-base font-bold tracking-tight text-ink">TradingJournal</p>
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

        <div className="mb-1 flex items-center justify-between rounded-lg px-2.5 py-2">
          <span className="text-sm font-medium text-ink-muted">Sembunyikan Nominal</span>
          <button
            type="button"
            role="switch"
            aria-checked={hidden}
            onClick={handleToggle}
            className={cn(
              'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
              hidden ? 'bg-ink' : 'bg-border'
            )}
          >
            <span
              className={cn(
                'inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform',
                hidden ? 'translate-x-[19px]' : 'translate-x-[3px]'
              )}
            />
          </button>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut size={16} strokeWidth={2} />
          Keluar
        </button>
      </aside>

      <Dialog open={unlockOpen} onOpenChange={setUnlockOpen}>
        <DialogContent>
          <DialogHeader
            title="Tampilkan Nominal"
            subtitle="Masukkan password untuk menampilkan kembali nominal"
            onClose={() => setUnlockOpen(false)}
          />
          <form onSubmit={handleUnlockSubmit}>
            <DialogBody>
              <div>
                <Label htmlFor="unlockPassword">Password</Label>
                <Input
                  id="unlockPassword"
                  type="password"
                  autoFocus
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </DialogBody>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setUnlockOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={verifying}>
                {verifying ? 'Memeriksa...' : 'Tampilkan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
