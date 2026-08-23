import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import loginChartBg from '../assets/bg-new.png';

export function LoginPage() {
  const { authenticated, loading, login } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!loading && authenticated) {
    return <Navigate to="/journal" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const ok = await login(password);
    setSubmitting(false);
    if (ok) {
      navigate('/journal');
    } else {
      setError('Password salah, coba lagi.');
    }
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${loginChartBg})` }}
    >
      <Card className="relative w-full max-w-sm bg-[#F6F6F7] p-8 shadow-none">
        <p className="text-center text-lg font-bold tracking-tight text-ink">Trading Journal</p>
        <p className="mt-1 text-center text-sm text-ink-muted">Masuk untuk lanjut ke journal kamu</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Input
              id="password"
              type="password"
              placeholder="Masukan password"
              className="bg-[#F6F6F7]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
