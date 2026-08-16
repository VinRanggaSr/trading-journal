import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { useJournalPlanForm } from './useJournalPlanForm';
import { JournalPlanFields } from './JournalPlanFields';

export function JournalFormDialog({ open, onOpenChange }) {
  const { form, setForm, checkedItems, toggleItem, checklistConfig, handleSubmit, createMutation, reset } =
    useJournalPlanForm({ onSuccess: () => onOpenChange(false), active: open });

  useEffect(() => {
    if (open) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader
          title="Trading Plan Baru"
          subtitle="Catat rencana sebelum entry"
          onClose={() => onOpenChange(false)}
        />
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <JournalPlanFields
              form={form}
              setForm={setForm}
              checklistConfig={checklistConfig}
              checkedItems={checkedItems}
              toggleItem={toggleItem}
            />

            {createMutation.isError && <p className="mt-5 text-sm text-red-600">{createMutation.error.message}</p>}
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Menyimpan...' : 'Simpan Trading Plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
