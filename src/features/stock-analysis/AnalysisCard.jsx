import { Card } from '../../components/ui/card';
import { tagColor } from '../../lib/tagColor';

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function AnalysisCard({ analysis, onClick }) {
  const tags = (analysis.Tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const otherNotesPreview = stripHtml(analysis.OtherNotes);

  return (
    <Card onClick={onClick} className="cursor-pointer overflow-hidden p-0 shadow-none">
      <div className="relative flex h-28 items-center justify-center overflow-hidden bg-bg">
        <div className="dot-sphere" />
        <p className="relative z-10 rounded-full bg-surface px-4 py-1.5 font-mono text-lg font-bold text-ink shadow-sm">
          {analysis.Ticker}
        </p>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface to-transparent" />
      </div>

      <div className="p-5 pt-3">
        <p className="text-xs text-ink-faint">{new Date(analysis.UpdatedDate).toLocaleDateString('id-ID')}</p>

        {otherNotesPreview && (
          <div className="relative mt-1.5">
            <p className="line-clamp-6 text-sm text-ink-muted">{otherNotesPreview}</p>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface to-transparent" />
          </div>
        )}

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const color = tagColor(tag);
              return (
                <span
                  key={tag}
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `${color}1A`, color }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
