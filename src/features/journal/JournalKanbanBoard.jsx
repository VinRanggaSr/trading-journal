import { JournalCard } from './JournalCard';

const COLUMNS = [
  { status: 'Pending', label: 'Pending', dot: 'bg-gray-400' },
  { status: 'No Entry', label: 'No Entry', dot: 'bg-gray-400' },
  { status: 'Entry', label: 'Entry', dot: 'bg-accent-purple' },
  { status: 'TP Partial', label: 'TP Partial', dot: 'bg-accent-orange' },
  { status: 'TP', label: 'Take Profit', dot: 'bg-emerald-500' },
  { status: 'CL', label: 'Cut Loss', dot: 'bg-red-500' }
];

export function JournalKanbanBoard({ journals, onCardClick }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {COLUMNS.map((col) => {
        const items = journals.filter((j) => j.Status === col.status);
        return (
          <div key={col.status} className="w-[300px] shrink-0 rounded-2xl border border-border bg-[#EFEFF1] p-3">
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className={`h-2 w-2 rounded-full ${col.dot}`} />
              <p className="text-sm font-semibold text-ink">{col.label}</p>
              <span className="text-sm text-ink-faint">{items.length}</span>
            </div>

            <div className="space-y-2">
              {items.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                  <p className="text-xs text-ink-faint">Belum ada</p>
                </div>
              )}
              {items.map((journal) => (
                <JournalCard
                  key={journal.JournalID}
                  journal={journal}
                  onClick={() => onCardClick(journal.JournalID)}
                  hideStatus
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
