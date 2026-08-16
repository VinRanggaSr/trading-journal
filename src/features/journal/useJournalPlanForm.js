import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../lib/api';

const emptyForm = {
  ticker: '',
  planPrice: '',
  tp: '',
  cl: '',
  riskReward: '',
  notes: '',
  additionalNotes: ''
};

export function useJournalPlanForm({ onSuccess, active = true } = {}) {
  const queryClient = useQueryClient();

  const { data: checklistConfig = [] } = useQuery({
    queryKey: ['checklistConfig'],
    queryFn: api.getChecklistConfig,
    enabled: active
  });

  const [form, setForm] = useState(emptyForm);
  const [checkedItems, setCheckedItems] = useState({});

  const createMutation = useMutation({
    mutationFn: api.createJournal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      onSuccess?.();
    }
  });

  function toggleItem(id) {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function reset() {
    setForm(emptyForm);
    setCheckedItems({});
  }

  function handleSubmit(e) {
    e.preventDefault();
    const items = checklistConfig.map((c) => ({
      text: c.CriteriaText,
      checked: Boolean(checkedItems[c.ChecklistID])
    }));

    createMutation.mutate({
      ticker: form.ticker.toUpperCase(),
      planPrice: Number(form.planPrice),
      tp: Number(form.tp),
      cl: Number(form.cl),
      riskReward: form.riskReward,
      checklist: { items, additionalNotes: form.additionalNotes },
      notes: form.notes
    });
  }

  return { form, setForm, checkedItems, toggleItem, checklistConfig, handleSubmit, createMutation, reset };
}
