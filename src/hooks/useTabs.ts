import { useContext } from 'react';
import { TabsContext } from '@/context/TabsContext';

export function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return ctx;
}
