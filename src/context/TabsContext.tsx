import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { RequestTab } from '@/types';
import { loadTabs, saveTabs } from '@/storage';
import { createEmptyTab } from '@/utils/request';

interface TabsContextValue {
  tabs: RequestTab[];
  activeTabId: string;
  activeTab: RequestTab;
  /** Opens a brand-new empty tab and activates it. */
  openTab: (tab?: RequestTab) => void;
  /** Closes a tab. Closing the active tab activates a neighbour. */
  closeTab: (tabId: string) => void;
  /** Switches the active tab. */
  switchTab: (tabId: string) => void;
  /** Updates a tab by id with a partial patch. */
  updateTab: (tabId: string, patch: Partial<RequestTab>) => void;
  /** Convenience: updates the currently active tab. */
  updateActiveTab: (patch: Partial<RequestTab>) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const TabsContext = createContext<TabsContextValue | null>(null);

/** Loads persisted tabs, guaranteeing at least one tab always exists. */
function getInitialTabs(): RequestTab[] {
  const stored = loadTabs();
  if (stored.length > 0) return stored;
  return [createEmptyTab()];
}

export function TabsProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<RequestTab[]>(getInitialTabs);
  const [activeTabId, setActiveTabId] = useState<string>(() => tabs[0].tabId);

  // Persist tabs whenever they change (transient fields are stripped in storage layer).
  useEffect(() => {
    saveTabs(tabs);
  }, [tabs]);

  const openTab = useCallback((tab?: RequestTab) => {
    const newTab = tab ?? createEmptyTab();
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.tabId);
  }, []);

  // Keep a ref to the latest tabs for the close handler's neighbour logic.
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;
  const activeRef = useRef(activeTabId);
  activeRef.current = activeTabId;

  const closeTab = useCallback((tabId: string) => {
    setTabs((prev) => {
      // Never allow zero tabs — closing the last one resets it to a fresh tab.
      if (prev.length === 1) {
        const fresh = createEmptyTab();
        setActiveTabId(fresh.tabId);
        return [fresh];
      }

      const index = prev.findIndex((t) => t.tabId === tabId);
      const next = prev.filter((t) => t.tabId !== tabId);

      // If we closed the active tab, activate the nearest neighbour.
      if (activeRef.current === tabId) {
        const neighbour = next[Math.max(0, index - 1)];
        setActiveTabId(neighbour.tabId);
      }
      return next;
    });
  }, []);

  const switchTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const updateTab = useCallback((tabId: string, patch: Partial<RequestTab>) => {
    setTabs((prev) =>
      prev.map((tab) => (tab.tabId === tabId ? { ...tab, ...patch } : tab)),
    );
  }, []);

  const updateActiveTab = useCallback(
    (patch: Partial<RequestTab>) => {
      updateTab(activeRef.current, patch);
    },
    [updateTab],
  );

  // Derive the active tab; fall back to the first if the id ever goes stale.
  const activeTab = useMemo(
    () => tabs.find((t) => t.tabId === activeTabId) ?? tabs[0],
    [tabs, activeTabId],
  );

  const value = useMemo<TabsContextValue>(
    () => ({
      tabs,
      activeTabId: activeTab.tabId,
      activeTab,
      openTab,
      closeTab,
      switchTab,
      updateTab,
      updateActiveTab,
    }),
    [tabs, activeTab, openTab, closeTab, switchTab, updateTab, updateActiveTab],
  );

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}
