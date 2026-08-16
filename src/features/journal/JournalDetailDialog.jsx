import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X as XIcon, Trash2, Pencil } from 'lucide-react';
import * as api from '../../lib/api';
import { Dialog, DialogContent, DialogHeader, DialogBody } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input, Label } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { StatusBadge } from './StatusBadge';
import { LivePrice } from './LivePrice';

function formatIDR(n) {
  if (n === '' || n === null || n === undefined || Number.isNaN(Number(n))) return '-';
  return new Intl.NumberFormat('id-ID').format(n);
}

function formatDate(iso) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  } catch (e) {
    return iso;
  }
}

const CAN_ENTRY_STATUSES = ['Pending', 'No Entry', 'Entry', 'TP Partial'];
const CAN_EXIT_STATUSES = ['Entry', 'TP Partial'];

const emptyEditForm = { ticker: '', planPrice: '', tp: '', cl: '', riskReward: '', notes: '', additionalNotes: '' };

export function JournalDetailDialog({ journalId, open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [activeAction, setActiveAction] = useState(null); // null | 'entry' | 'tp' | 'tp-partial' | 'cl'
  const [actionForm, setActionForm] = useState({ price: '', nominal: '', percent: '' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [editCheckedItems, setEditCheckedItems] = useState({});

  const { data: journal, isLoading } = useQuery({
    queryKey: ['journal', journalId],
    queryFn: () => api.getJournalDetail(journalId),
    enabled: open && Boolean(journalId)
  });

  const { data: checklistConfig = [] } = useQuery({
    queryKey: ['checklistConfig'],
    queryFn: api.getChecklistConfig,
    enabled: open
  });

  useEffect(() => {
    setEditMode(false);
    setConfirmDelete(false);
    setActiveAction(null);
  }, [journalId]);

  function resetAndInvalidate() {
    queryClient.invalidateQueries({ queryKey: ['journal', journalId] });
    queryClient.invalidateQueries({ queryKey: ['journals'] });
    setActiveAction(null);
    setActionForm({ price: '', nominal: '', percent: '' });
  }

  const statusMutation = useMutation({ mutationFn: api.updateJournalStatus, onSuccess: resetAndInvalidate });
  const entryMutation = useMutation({ mutationFn: api.addEntry, onSuccess: resetAndInvalidate });
  const exitMutation = useMutation({ mutationFn: api.addExit, onSuccess: resetAndInvalidate });
  const updatePlanMutation = useMutation({
    mutationFn: api.updateJournalPlan,
    onSuccess: () => {
      resetAndInvalidate();
      setEditMode(false);
    }
  });
  const deleteMutation = useMutation({
    mutationFn: api.deleteJournal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      onOpenChange(false);
    }
  });

  if (!open) return null;

  function enterEditMode() {
    if (!journal) return;
    setEditForm({
      ticker: journal.Ticker || '',
      planPrice: journal.PlanPrice ?? '',
      tp: journal.TP ?? '',
      cl: journal.CL ?? '',
      riskReward: journal.RiskReward || '',
      notes: journal.Notes || '',
      additionalNotes: additionalNotes || ''
    });
    const checkedMap = {};
    items.forEach((it) => {
      const matched = checklistConfig.find((c) => c.CriteriaText === it.text);
      if (matched) checkedMap[matched.ChecklistID] = it.checked;
    });
    setEditCheckedItems(checkedMap);
    setEditMode(true);
  }

  function toggleEditItem(id) {
    setEditCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function submitEdit(e) {
    e.preventDefault();
    const checklistItems = checklistConfig.map((c) => ({
      text: c.CriteriaText,
      checked: Boolean(editCheckedItems[c.ChecklistID])
    }));

    updatePlanMutation.mutate({
      journalId,
      ticker: editForm.ticker.toUpperCase(),
      planPrice: Number(editForm.planPrice),
      tp: Number(editForm.tp),
      cl: Number(editForm.cl),
      riskReward: editForm.riskReward,
      checklist: { items: checklistItems, additionalNotes: editForm.additionalNotes },
      notes: editForm.notes
    });
  }

  function markNoEntry() {
    statusMutation.mutate({ journalId, status: 'No Entry' });
  }

  function submitEntry(e) {
    e.preventDefault();
    entryMutation.mutate({
      journalId,
      entryPrice: Number(actionForm.price),
      nominal: Number(actionForm.nominal)
    });
  }

  function submitExit(type) {
    return (e) => {
      e.preventDefault();
      exitMutation.mutate({
        journalId,
        exitType: type,
        exitPrice: Number(actionForm.price),
        percentSold: type === 'TP Partial' ? Number(actionForm.percent) : 100
      });
    };
  }

  function handleDelete() {
    deleteMutation.mutate({ journalId });
  }

  const checklist = journal?.Checklist;
  const items = Array.isArray(checklist) ? checklist : checklist?.items || [];
  const additionalNotes = Array.isArray(checklist) ? '' : checklist?.additionalNotes || '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader
          title={journal ? journal.Ticker : 'Memuat...'}
          subtitle={journal ? `Dibuat ${formatDate(journal.CreatedDate)}` : undefined}
          onClose={() => onOpenChange(false)}
          actions={
            journal &&
            !editMode &&
            !confirmDelete && (
              <>
                <button
                  type="button"
                  onClick={enterEditMode}
                  title="Edit journal"
                  className="rounded-lg p-1 text-ink-faint transition-colors hover:bg-bg hover:text-ink"
                >
                  <Pencil size={17} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  title="Hapus journal"
                  className="rounded-lg p-1 text-ink-faint transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={17} />
                </button>
              </>
            )
          }
        />

        <DialogBody className="space-y-6">
          {isLoading && <p className="text-sm text-ink-muted">Memuat detail...</p>}

          {journal && confirmDelete && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">Hapus journal {journal.Ticker}?</p>
              <p className="mt-1 text-sm text-red-600">
                Semua data entry & exit yang terkait ikut terhapus. Aksi ini nggak bisa dibatalin.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                  Batal
                </Button>
              </div>
              {deleteMutation.isError && (
                <p className="mt-2 text-sm text-red-600">{deleteMutation.error.message}</p>
              )}
            </div>
          )}

          {journal && editMode && (
            <form onSubmit={submitEdit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="editTicker">Ticker</Label>
                  <Input
                    id="editTicker"
                    required
                    value={editForm.ticker}
                    onChange={(e) => setEditForm({ ...editForm, ticker: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editPlanPrice">Harga Rencana</Label>
                  <Input
                    id="editPlanPrice"
                    type="number"
                    required
                    value={editForm.planPrice}
                    onChange={(e) => setEditForm({ ...editForm, planPrice: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editRiskReward">Risk : Reward</Label>
                  <Input
                    id="editRiskReward"
                    required
                    value={editForm.riskReward}
                    onChange={(e) => setEditForm({ ...editForm, riskReward: e.target.value })}
                    placeholder="1:2"
                  />
                </div>
                <div>
                  <Label htmlFor="editTp">Take Profit</Label>
                  <Input
                    id="editTp"
                    type="number"
                    required
                    value={editForm.tp}
                    onChange={(e) => setEditForm({ ...editForm, tp: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editCl">Cut Loss</Label>
                  <Input
                    id="editCl"
                    type="number"
                    required
                    value={editForm.cl}
                    onChange={(e) => setEditForm({ ...editForm, cl: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <p className="label-caps mb-2">Syarat Entry</p>
                <div className="space-y-2 rounded-xl border border-border p-3">
                  {checklistConfig.length === 0 && (
                    <p className="text-sm text-ink-faint">Belum ada kriteria di ChecklistConfig.</p>
                  )}
                  {checklistConfig.map((item) => (
                    <label key={item.ChecklistID} className="flex items-center gap-2 text-sm text-ink">
                      <Checkbox
                        checked={Boolean(editCheckedItems[item.ChecklistID])}
                        onChange={() => toggleEditItem(item.ChecklistID)}
                      />
                      {item.CriteriaText}
                    </label>
                  ))}
                </div>
                <Textarea
                  className="mt-2"
                  rows={2}
                  placeholder="Catatan tambahan soal syarat entry (opsional)"
                  value={editForm.additionalNotes}
                  onChange={(e) => setEditForm({ ...editForm, additionalNotes: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="editNotes">Notes / Alasan Detail</Label>
                <Textarea
                  id="editNotes"
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                />
              </div>

              {updatePlanMutation.isError && (
                <p className="text-sm text-red-600">{updatePlanMutation.error.message}</p>
              )}

              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditMode(false)}>
                  Batal
                </Button>
                <Button type="submit" size="sm" disabled={updatePlanMutation.isPending}>
                  {updatePlanMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </form>
          )}

          {journal && !confirmDelete && !editMode && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusBadge status={journal.Status} />
                <div className="flex flex-wrap items-start gap-4 text-right text-sm">
                  <div>
                    <p className="label-caps">Harga Live</p>
                    <LivePrice ticker={journal.Ticker} planPrice={journal.PlanPrice} />
                  </div>
                  <div>
                    <p className="label-caps">Plan</p>
                    <p className="font-semibold text-ink">{formatIDR(journal.PlanPrice)}</p>
                  </div>
                  <div>
                    <p className="label-caps text-accent-orange">TP</p>
                    <p className="font-semibold text-ink">{formatIDR(journal.TP)}</p>
                  </div>
                  <div>
                    <p className="label-caps">CL</p>
                    <p className="font-semibold text-ink">{formatIDR(journal.CL)}</p>
                  </div>
                  <div>
                    <p className="label-caps">R:R</p>
                    <p className="font-semibold text-ink">{journal.RiskReward || '-'}</p>
                  </div>
                </div>
              </div>

              {items.length > 0 && (
                <div>
                  <p className="label-caps mb-2">Syarat Entry</p>
                  <ul className="space-y-1.5">
                    {items.map((it, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        {it.checked ? (
                          <Check size={15} className="shrink-0 text-emerald-600" />
                        ) : (
                          <XIcon size={15} className="shrink-0 text-ink-faint" />
                        )}
                        <span className={it.checked ? 'text-ink' : 'text-ink-faint line-through'}>{it.text}</span>
                      </li>
                    ))}
                  </ul>
                  {additionalNotes && <p className="mt-2 text-sm text-ink-muted">{additionalNotes}</p>}
                </div>
              )}

              {journal.Notes && (
                <div>
                  <p className="label-caps mb-1">Notes</p>
                  <p className="text-sm text-ink-muted">{journal.Notes}</p>
                </div>
              )}

              <div>
                <p className="label-caps mb-2">Riwayat Entry</p>
                {journal.entries?.length > 0 ? (
                  <div className="space-y-1.5">
                    {journal.entries.map((en) => (
                      <div
                        key={en.EntryID}
                        className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm"
                      >
                        <span className="text-ink-muted">{formatDate(en.EntryDate)}</span>
                        <span className="font-medium text-ink">{formatIDR(en.EntryPrice)}</span>
                        <span className="text-ink-muted">Rp{formatIDR(en.Nominal)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink-faint">Belum ada entry.</p>
                )}
              </div>

              <div>
                <p className="label-caps mb-2">Riwayat Exit</p>
                {journal.exits?.length > 0 ? (
                  <div className="space-y-1.5">
                    {journal.exits.map((ex) => (
                      <div
                        key={ex.ExitID}
                        className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm"
                      >
                        <span className="text-ink-muted">{formatDate(ex.ExitDate)}</span>
                        <StatusBadge status={ex.ExitType} />
                        <span className="font-medium text-ink">{formatIDR(ex.ExitPrice)}</span>
                        {ex.ExitType === 'TP Partial' && <span className="text-ink-muted">{ex.PercentSold}%</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink-faint">Belum ada exit.</p>
                )}
              </div>

              {activeAction === null && (journal.Status === 'TP' || journal.Status === 'CL') && (
                <p className="border-t border-border pt-4 text-sm text-ink-faint">Posisi sudah ditutup.</p>
              )}

              {activeAction === null && journal.Status !== 'TP' && journal.Status !== 'CL' && (
                <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                  {journal.Status === 'Pending' && (
                    <Button variant="secondary" size="sm" onClick={markNoEntry} disabled={statusMutation.isPending}>
                      Tandai Tidak Entry
                    </Button>
                  )}
                  {CAN_ENTRY_STATUSES.includes(journal.Status) && (
                    <Button size="sm" onClick={() => setActiveAction('entry')}>
                      {journal.Status === 'Entry' || journal.Status === 'TP Partial' ? 'Tambah Posisi' : 'Catat Entry'}
                    </Button>
                  )}
                  {CAN_EXIT_STATUSES.includes(journal.Status) && (
                    <>
                      <Button variant="secondary" size="sm" onClick={() => setActiveAction('tp-partial')}>
                        Take Profit Partial
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => setActiveAction('tp')}>
                        Take Profit
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => setActiveAction('cl')}>
                        Cut Loss
                      </Button>
                    </>
                  )}
                </div>
              )}

              {activeAction === 'entry' && (
                <form onSubmit={submitEntry} className="space-y-3 border-t border-border pt-4">
                  <p className="label-caps">Catat Entry</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="entryPrice">Harga Masuk</Label>
                      <Input
                        id="entryPrice"
                        type="number"
                        required
                        value={actionForm.price}
                        onChange={(e) => setActionForm({ ...actionForm, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="entryNominal">Nominal (Rp)</Label>
                      <Input
                        id="entryNominal"
                        type="number"
                        required
                        value={actionForm.nominal}
                        onChange={(e) => setActionForm({ ...actionForm, nominal: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setActiveAction(null)}>
                      Batal
                    </Button>
                    <Button type="submit" size="sm" disabled={entryMutation.isPending}>
                      Simpan
                    </Button>
                  </div>
                </form>
              )}

              {(activeAction === 'tp' || activeAction === 'cl') && (
                <form
                  onSubmit={submitExit(activeAction === 'tp' ? 'TP' : 'CL')}
                  className="space-y-3 border-t border-border pt-4"
                >
                  <p className="label-caps">{activeAction === 'tp' ? 'Catat Take Profit' : 'Catat Cut Loss'}</p>
                  <div>
                    <Label htmlFor="exitPrice">Harga Jual</Label>
                    <Input
                      id="exitPrice"
                      type="number"
                      required
                      value={actionForm.price}
                      onChange={(e) => setActionForm({ ...actionForm, price: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setActiveAction(null)}>
                      Batal
                    </Button>
                    <Button type="submit" size="sm" disabled={exitMutation.isPending}>
                      Simpan
                    </Button>
                  </div>
                </form>
              )}

              {activeAction === 'tp-partial' && (
                <form onSubmit={submitExit('TP Partial')} className="space-y-3 border-t border-border pt-4">
                  <p className="label-caps">Catat Take Profit Partial</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="exitPricePartial">Harga Jual</Label>
                      <Input
                        id="exitPricePartial"
                        type="number"
                        required
                        value={actionForm.price}
                        onChange={(e) => setActionForm({ ...actionForm, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="exitPercent">% Portofolio Terjual</Label>
                      <Input
                        id="exitPercent"
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={actionForm.percent}
                        onChange={(e) => setActionForm({ ...actionForm, percent: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setActiveAction(null)}>
                      Batal
                    </Button>
                    <Button type="submit" size="sm" disabled={exitMutation.isPending}>
                      Simpan
                    </Button>
                  </div>
                </form>
              )}

              {(statusMutation.isError || entryMutation.isError || exitMutation.isError) && (
                <p className="text-sm text-red-600">
                  {(statusMutation.error || entryMutation.error || exitMutation.error)?.message}
                </p>
              )}
            </>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
