import { ResearchLinkCard } from '../features/research/ResearchLinkCard';
import { ChecklistIllustration } from '../features/research/ChecklistIllustration';
import { ThreadIllustration } from '../features/research/ThreadIllustration';

const LINKS = [
  {
    title: 'Stock Pick AI',
    description: 'Rekomendasi watchlist saham pilihan versi AI dari Investing.com Pro.',
    url: 'https://www.investing.com/pro/propicks'
  },
  {
    title: 'Pantau Watchlist',
    description: 'Pantau pergerakan saham dan fundamental dari watchlist yang dimiliki.',
    url: 'https://www.investing.com/pro/watchlist/w-59068993.iwl/v-9c82a9de',
    illustration: ChecklistIllustration
  },
  {
    title: 'Basic Rules',
    description: 'Pelajari aturan dasar dari pergerakan sebuah saham sebelum entry/exit.',
    url: 'https://my1rules.netlify.app/',
    illustration: ThreadIllustration
  }
];

export function ResearchSahamPage() {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Research Saham</h1>
        <p className="mt-1 text-sm text-ink-muted">Kumpulan link untuk riset saham kamu.</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((link) => (
          <ResearchLinkCard key={link.title} {...link} />
        ))}
      </div>
    </div>
  );
}
