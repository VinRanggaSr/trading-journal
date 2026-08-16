import { Input, Label } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';

export function JournalPlanFields({ form, setForm, checklistConfig, checkedItems, toggleItem }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="ticker">Ticker</Label>
          <Input
            id="ticker"
            required
            value={form.ticker}
            onChange={(e) => setForm({ ...form, ticker: e.target.value })}
            placeholder="BBCA"
          />
        </div>
        <div>
          <Label htmlFor="planPrice">Harga Rencana/Plan</Label>
          <Input
            id="planPrice"
            type="number"
            required
            value={form.planPrice}
            onChange={(e) => setForm({ ...form, planPrice: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="riskReward">Risk : Reward</Label>
          <Input
            id="riskReward"
            required
            value={form.riskReward}
            onChange={(e) => setForm({ ...form, riskReward: e.target.value })}
            placeholder="1:2"
          />
        </div>
        <div>
          <Label htmlFor="tp">Take Profit</Label>
          <Input
            id="tp"
            type="number"
            required
            value={form.tp}
            onChange={(e) => setForm({ ...form, tp: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="cl">Cut Loss</Label>
          <Input
            id="cl"
            type="number"
            required
            value={form.cl}
            onChange={(e) => setForm({ ...form, cl: e.target.value })}
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
                checked={Boolean(checkedItems[item.ChecklistID])}
                onChange={() => toggleItem(item.ChecklistID)}
              />
              {item.CriteriaText}
            </label>
          ))}
        </div>
        <Textarea
          className="mt-2"
          rows={2}
          placeholder="Catatan tambahan soal syarat entry (opsional)"
          value={form.additionalNotes}
          onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes / Alasan Detail</Label>
        <Textarea
          id="notes"
          rows={3}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Kenapa saham ini menarik, konteks tambahan, dll"
        />
      </div>
    </div>
  );
}
