// Perhitungan statistik dari data journal - dipakai di Dashboard.

export function computeFunnelStats(journals) {
  const total = journals.length;
  const counts = { success: 0, fail: 0, inProgress: 0, notQualified: 0 };

  journals.forEach((j) => {
    if (j.Status === 'TP') counts.success += 1;
    else if (j.Status === 'CL') counts.fail += 1;
    else if (j.Status === 'Entry' || j.Status === 'TP Partial') counts.inProgress += 1;
    else counts.notQualified += 1; // Pending, No Entry
  });

  const pct = (n) => (total === 0 ? 0 : Math.round((n / total) * 1000) / 10);

  return {
    total,
    success: counts.success,
    fail: counts.fail,
    inProgress: counts.inProgress,
    notQualified: counts.notQualified,
    successPct: pct(counts.success),
    failPct: pct(counts.fail),
    inProgressPct: pct(counts.inProgress),
    notQualifiedPct: pct(counts.notQualified)
  };
}

const toTime = (v) => {
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? 0 : t;
};

/**
 * Replay entry & exit satu journal secara kronologis (moving-average cost).
 *
 * Exit dicatat dalam NOMINAL Rp modal yang dijual (ex.NominalSold), jadi nilainya
 * tetap walau setelah itu ada tambah posisi. Data lama yang cuma punya PercentSold
 * dikonversi ke nominal pakai total modal masuk SAMPAI saat exit itu terjadi.
 * Tiap exit dibatasi sebesar sisa modal saat itu supaya data rusak nggak dobel-hitung.
 */
export function replayPosition(journal) {
  const entries = journal.entries || [];
  const exits = journal.exits || [];

  const events = [
    ...entries.map((e) => ({ kind: 'entry', t: toTime(e.EntryDate), e })),
    ...exits.map((x) => ({ kind: 'exit', t: toTime(x.ExitDate), x }))
  ].sort((a, b) => a.t - b.t || (a.kind === b.kind ? 0 : a.kind === 'entry' ? -1 : 1));

  let capitalIn = 0;
  let remaining = 0;
  let shares = 0;
  let realizedValue = 0;
  const exitRows = {};

  events.forEach((ev) => {
    if (ev.kind === 'entry') {
      const n = Number(ev.e.Nominal || 0);
      const p = Number(ev.e.EntryPrice || 0);
      if (n <= 0) return;
      capitalIn += n;
      remaining += n;
      if (p > 0) shares += n / p;
      return;
    }

    const ex = ev.x;
    const avg = shares > 0 ? remaining / shares : 0;
    const hasNominal = ex.NominalSold !== undefined && ex.NominalSold !== null && ex.NominalSold !== '';
    const requested = hasNominal
      ? Number(ex.NominalSold || 0)
      : (Number(ex.PercentSold || 0) / 100) * capitalIn;
    const effective = Math.min(Math.max(requested, 0), remaining);

    if (avg > 0) {
      realizedValue += effective * (Number(ex.ExitPrice || 0) / avg);
      shares -= effective / avg;
    }
    remaining -= effective;
    if (remaining < 1) {
      remaining = 0;
      shares = 0;
    }
    exitRows[ex.ExitID] = { nominal: effective, capitalInAtExit: capitalIn };
  });

  const allShares = entries.reduce((sum, e) => {
    const p = Number(e.EntryPrice || 0);
    return p > 0 ? sum + Number(e.Nominal || 0) / p : sum;
  }, 0);
  const avgEntryPrice = shares > 0 ? remaining / shares : allShares > 0 ? capitalIn / allShares : 0;

  return { capitalIn, remainingNominal: remaining, avgEntryPrice, realizedValue, exitRows };
}

export function computePosition(journal) {
  if ((journal.entries || []).length === 0) return null;

  const { capitalIn, remainingNominal, avgEntryPrice, realizedValue } = replayPosition(journal);

  return {
    journalId: journal.JournalID,
    ticker: journal.Ticker,
    status: journal.Status,
    totalNominalIn: capitalIn,
    avgEntryPrice,
    remainingNominal,
    realizedValue,
    isOpen: remainingNominal >= 1
  };
}
