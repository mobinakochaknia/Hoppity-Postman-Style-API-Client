import type { Collection, HistoryItem, RequestTab, Theme } from '@/types';

/** Storage keys used throughout the application. */
const KEYS = {
  history: 'postman-clone:history',
  collections: 'postman-clone:collections',
  theme: 'postman-clone:theme',
  tabs: 'postman-clone:tabs',
} as const;

/**
 * Safely reads and parses a JSON value from localStorage.
 * Returns the fallback if the key is missing, parsing fails, or storage is unavailable.
 */
function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Safely writes a JSON value to localStorage. Silently ignores quota/availability errors. */
function writeJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be full or unavailable (e.g. private mode); fail gracefully.
  }
}

/* ----------------------------- History ----------------------------- */

export function saveHistory(history: HistoryItem[]): void {
  writeJson(KEYS.history, history);
}

export function loadHistory(): HistoryItem[] {
  return readJson<HistoryItem[]>(KEYS.history, []);
}

/* --------------------------- Collections --------------------------- */

export function saveCollections(collections: Collection[]): void {
  writeJson(KEYS.collections, collections);
}

export function loadCollections(): Collection[] {
  return readJson<Collection[]>(KEYS.collections, []);
}

/* ------------------------------ Theme ------------------------------ */

export function saveTheme(theme: Theme): void {
  writeJson(KEYS.theme, theme);
}

export function loadTheme(): Theme | null {
  return readJson<Theme | null>(KEYS.theme, null);
}

/* ------------------------------ Tabs ------------------------------- */

/**
 * Persists tabs. The transient `response`, `error` and `loading` fields are
 * stripped before saving since they are not meaningful across sessions.
 */
export function saveTabs(tabs: RequestTab[]): void {
  const sanitized = tabs.map((tab) => ({
    ...tab,
    response: null,
    error: null,
    loading: false,
  }));
  writeJson(KEYS.tabs, sanitized);
}

export function loadTabs(): RequestTab[] {
  return readJson<RequestTab[]>(KEYS.tabs, []);
}
