import { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../lib/api';

const STORAGE_KEY = 'hideNominal';
const NominalVisibilityContext = createContext(null);

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch (e) {
    return false;
  }
}

function writeStored(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  } catch (e) {
    // ignore
  }
}

export function NominalVisibilityProvider({ children }) {
  const [hidden, setHidden] = useState(readStored);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const hide = useCallback(() => {
    setError(null);
    setHidden(true);
    writeStored(true);
  }, []);

  const unlock = useCallback(async (password) => {
    setError(null);
    setVerifying(true);
    try {
      await api.login(password);
      setHidden(false);
      writeStored(false);
      return true;
    } catch (err) {
      setError(err.message || 'Password salah');
      return false;
    } finally {
      setVerifying(false);
    }
  }, []);

  return (
    <NominalVisibilityContext.Provider value={{ hidden, hide, unlock, error, verifying }}>
      {children}
    </NominalVisibilityContext.Provider>
  );
}

export function useNominalVisibility() {
  const ctx = useContext(NominalVisibilityContext);
  if (!ctx) throw new Error('useNominalVisibility harus dipakai di dalam <NominalVisibilityProvider>');
  return ctx;
}
