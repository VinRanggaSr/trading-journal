import { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { DocStackIllustration } from './DocStackIllustration';

export function ResearchLinkCard({ title, description, url, illustration: Illustration = DocStackIllustration }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard nggak tersedia (mis. http tanpa secure context) - abaikan aja
    }
  }

  return (
    <Card className="group overflow-hidden p-0 shadow-none">
      <div className="relative h-28 overflow-hidden bg-bg">
        <div className="dot-grid" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface to-transparent" />
        <Illustration className="absolute left-4 top-4 z-10 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105" />
      </div>

      <div className="p-5 pt-4">
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm text-ink-muted">{description}</p>

        <div className="mt-4 flex items-center gap-2">
          <Button size="sm" href={url} target="_blank" rel="noopener noreferrer">
            <ArrowUpRight size={14} />
            Buka
          </Button>
          <Button size="sm" variant="secondary" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Disalin' : 'Salin Link'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
