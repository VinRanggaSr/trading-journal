/**
 * Semua request ke backend (Netlify Functions) lewat sini.
 * credentials: 'include' penting - biar cookie session ikut terkirim.
 */

async function request(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  if (!res.ok) {
    const message = (data && data.error) || `Request gagal (${res.status})`;
    throw new Error(message);
  }

  return data;
}

// ====== AUTH ======

export function checkAuth() {
  return request('/api/auth', { method: 'GET' });
}

export function login(password) {
  return request('/api/auth', {
    method: 'POST',
    body: JSON.stringify({ password })
  });
}

export function logout() {
  return request('/api/auth', { method: 'DELETE' });
}

// ====== SHEETS (journal / entries / exits / stock analysis / checklist) ======

export function sheetsGet(action, params = {}) {
  const query = new URLSearchParams({ action, ...params }).toString();
  return request(`/api/sheets?${query}`, { method: 'GET' });
}

export function sheetsPost(action, payload = {}) {
  return request('/api/sheets', {
    method: 'POST',
    body: JSON.stringify({ action, payload })
  });
}

export const getJournals = () => sheetsGet('getJournals');
export const getJournalDetail = (journalId) => sheetsGet('getJournalDetail', { journalId });
export const createJournal = (payload) => sheetsPost('createJournal', payload);
export const updateJournalPlan = (payload) => sheetsPost('updateJournalPlan', payload);
export const updateJournalStatus = (payload) => sheetsPost('updateJournalStatus', payload);
export const addEntry = (payload) => sheetsPost('addEntry', payload);
export const addExit = (payload) => sheetsPost('addExit', payload);
export const deleteJournal = (payload) => sheetsPost('deleteJournal', payload);

export const getStockAnalysis = () => sheetsGet('getStockAnalysis');
export const createStockAnalysis = (payload) => sheetsPost('createStockAnalysis', payload);
export const updateStockAnalysis = (payload) => sheetsPost('updateStockAnalysis', payload);
export const deleteStockAnalysis = (payload) => sheetsPost('deleteStockAnalysis', payload);

export const getChecklistConfig = () => sheetsGet('getChecklistConfig');
export const addChecklistItem = (payload) => sheetsPost('addChecklistItem', payload);
export const updateChecklistItem = (payload) => sheetsPost('updateChecklistItem', payload);

// ====== PRICE ======

export function getPrice(ticker) {
  return request(`/api/price?ticker=${encodeURIComponent(ticker)}`, { method: 'GET' });
}
