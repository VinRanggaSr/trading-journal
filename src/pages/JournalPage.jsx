import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import * as api from '../lib/api';
import { Button } from '../components/ui/button';
import { JournalKanbanBoard } from '../features/journal/JournalKanbanBoard';
import { JournalFormDialog } from '../features/journal/JournalFormDialog';
import { JournalDetailDialog } from '../features/journal/JournalDetailDialog';

export function JournalPage() {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  function handleNewClick() {
    if (window.matchMedia('(max-width: 639px)').matches) {
      navigate('/journal/new');
    } else {
      setCreateOpen(true);
    }
  }

  const {
    data: journals = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['journals'],
    queryFn: api.getJournals
  });

  const sorted = [...journals].sort((a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate));

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Journal</h1>
          <p className="mt-1 text-sm text-ink-muted">Trading plan & journal kamu.</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={handleNewClick}>
          <Plus size={16} />
          Trading Plan Baru
        </Button>
      </div>

      {isLoading && <p className="mt-6 text-sm text-ink-muted">Memuat journal...</p>}
      {isError && <p className="mt-6 text-sm text-red-600">{error.message}</p>}

      {!isLoading && !isError && sorted.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-ink-muted">Belum ada trading plan. Mulai dengan bikin yang pertama.</p>
        </div>
      )}

      {!isLoading && !isError && sorted.length > 0 && (
        <div className="mt-6">
          <JournalKanbanBoard journals={sorted} onCardClick={setSelectedId} />
        </div>
      )}

      <JournalFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      <JournalDetailDialog
        journalId={selectedId}
        open={Boolean(selectedId)}
        onOpenChange={(next) => !next && setSelectedId(null)}
      />
    </div>
  );
}
