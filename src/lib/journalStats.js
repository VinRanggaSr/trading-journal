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

/**
 * Hitung posisi dari satu journal: total modal masuk, harga rata-rata entry
 * (weighted by nominal), sisa % yang belum di-exit, dan nilai yang sudah
 * direalisasi dari exit yang sudah tercatat.
 *
 * CATATAN: ini estimasi. Perhitungan cost-basis yang presisi untuk partial
 * sell berurutan itu kompleks - di sini disederhanakan dengan asumsi setiap
 * % exit dihitung dari total modal awal, bukan dari sisa modal terkini.
 * Cukup akurat untuk journal personal, tapi bukan pembukuan akuntansi resmi.
 */
export function computePosition(journal) {
  const entries = journal.entries || [];
  const exits = journal.exits || [];

  if (entries.length === 0) return null;

  const totalNominalIn = entries.reduce((sum, e) => sum + Number(e.Nominal || 0), 0);
  const totalShares = entries.reduce((sum, e) => {
    const price = Number(e.EntryPrice || 0);
    return price > 0 ? sum + Number(e.Nominal || 0) / price : sum;
  }, 0);
  const avgEntryPrice = totalShares > 0 ? totalNominalIn / totalShares : 0;

  const percentSoldTotal = exits.reduce((sum, ex) => sum + Number(ex.PercentSold || 0), 0);
  const remainingPercent = Math.max(0, 100 - percentSoldTotal);

  const realizedValue = exits.reduce((sum, ex) => {
    const portionValue = (Number(ex.PercentSold || 0) / 100) * totalNominalIn;
    const priceRatio = avgEntryPrice > 0 ? Number(ex.ExitPrice || 0) / avgEntryPrice : 0;
    return sum + portionValue * priceRatio;
  }, 0);

  return {
    journalId: journal.JournalID,
    ticker: journal.Ticker,
    status: journal.Status,
    totalNominalIn,
    avgEntryPrice,
    remainingPercent,
    realizedValue,
    isOpen: remainingPercent > 0
  };
}
