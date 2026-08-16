import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useJournalPlanForm } from '../features/journal/useJournalPlanForm';
import { JournalPlanFields } from '../features/journal/JournalPlanFields';

export function JournalNewPage() {
  const navigate = useNavigate();
  const { form, setForm, checkedItems, toggleItem, checklistConfig, handleSubmit, createMutation } =
    useJournalPlanForm({ onSuccess: () => navigate('/journal') });

  return (
    <div>
      <Link to="/journal" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft size={15} />
        Kembali ke Journal
      </Link>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Trading Plan Baru</h1>
          <p className="mt-1 text-sm text-ink-muted">Catat rencana sebelum entry</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="secondary" className="flex-1 sm:flex-none" onClick={() => navigate('/journal')}>
            Batal
          </Button>
          <Button type="submit" form="journalPlanForm" className="flex-1 sm:flex-none" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>

      <form id="journalPlanForm" onSubmit={handleSubmit} className="mt-6">
        <JournalPlanFields
          form={form}
          setForm={setForm}
          checklistConfig={checklistConfig}
          checkedItems={checkedItems}
          toggleItem={toggleItem}
        />

        {createMutation.isError && <p className="mt-5 text-sm text-red-600">{createMutation.error.message}</p>}
      </form>
    </div>
  );
}
