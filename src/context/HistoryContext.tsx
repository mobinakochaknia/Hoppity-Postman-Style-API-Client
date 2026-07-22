import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { HistoryItem, HttpMethod } from '@/types';
import { loadHistory, saveHistory } from '@/storage';
import { createId } from '@/utils/id';

const MAX_HISTORY = 100;

interface HistoryContextValue {
  history: HistoryItem[];
  addHistory: (entry: { method: HttpMethod; url: string; status: number | null }) => void;
  removeHistory: (id: string) => void;
  clearHistory: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>(loadHistory);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addHistory = useCallback(
    (entry: { method: HttpMethod; url: string; status: number | null }) => {
      const item: HistoryItem = {
        id: createId(),
        method: entry.method,
        url: entry.url,
        status: entry.status,
        timestamp: Date.now(),
      };
      // Prepend newest first and cap the list length.
      setHistory((prev) => [item, ...prev].slice(0, MAX_HISTORY));
    },
    [],
  );

  const removeHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const value = useMemo<HistoryContextValue>(
    () => ({ history, addHistory, removeHistory, clearHistory }),
    [history, addHistory, removeHistory, clearHistory],
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}
