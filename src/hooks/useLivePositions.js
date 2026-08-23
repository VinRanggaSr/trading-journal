import { useQueries } from '@tanstack/react-query';
import * as api from '../lib/api';
import { computePosition } from '../lib/journalStats';

/**
 * Hitung posisi tiap journal (modal aktif, nilai aktif, growth) dengan harga live,
 * dipakai bareng oleh Dashboard (PortfolioSection) dan halaman Alokasi Portfolio.
 */
export function useLivePositions(journals) {
  const positions = journals.map(computePosition).filter(Boolean);
  const openTickers = [...new Set(positions.filter((p) => p.isOpen).map((p) => p.ticker))];

  const priceQueries = useQueries({
    queries: openTickers.map((ticker) => ({
      queryKey: ['price', ticker],
      queryFn: () => api.getPrice(ticker),
      staleTime: 60 * 1000
    }))
  });

  const priceMap = {};
  openTickers.forEach((ticker, idx) => {
    const q = priceQueries[idx];
    if (q.data) priceMap[ticker] = q.data.price;
  });

  const rows = positions.map((p) => {
    // Modal yang masih "nyangkut" di posisi ini - berkurang seiring exit partial,
    // dan jadi 0 begitu posisi ditutup penuh (remainingPercent = 0).
    const modalRemaining = (p.remainingPercent / 100) * p.totalNominalIn;
    let currentValueRemaining = 0;

    if (p.isOpen) {
      const livePrice = priceMap[p.ticker];
      if (livePrice && p.avgEntryPrice > 0) {
        currentValueRemaining = modalRemaining * (livePrice / p.avgEntryPrice);
      } else {
        // Harga live belum termuat - fallback sementara pakai nilai modal apa adanya
        currentValueRemaining = modalRemaining;
      }
    }

    const totalValue = p.realizedValue + currentValueRemaining;
    const growthPct = p.totalNominalIn > 0 ? ((totalValue - p.totalNominalIn) / p.totalNominalIn) * 100 : 0;

    // Growth aktif: untung/rugi murni dari posisi yang MASIH terbuka (modal aktif vs nilai
    // aktif) - beda dari growthPct di atas yang menghitung total lifetime (realized +
    // unrealized dari modal awal). null kalau posisi sudah ditutup penuh.
    const growthActiveRp = modalRemaining > 0 ? currentValueRemaining - modalRemaining : null;
    const growthActivePct = modalRemaining > 0 ? (growthActiveRp / modalRemaining) * 100 : null;

    return { ...p, totalValue, growthPct, modalRemaining, currentValueRemaining, growthActiveRp, growthActivePct };
  });

  const isLoadingPrices = priceQueries.some((q) => q.isLoading);

  return { rows, isLoadingPrices };
}
