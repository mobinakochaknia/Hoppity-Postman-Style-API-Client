import { useState } from 'react';
import { Collections } from '@/components/Collections/Collections';
import { History } from '@/components/History/History';
import { FolderIcon, HistoryIcon } from '@/components/UI/Icons';

type SidebarView = 'collections' | 'history';

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

/** The left sidebar containing collections and history. */
export function Sidebar({ open, onNavigate }: SidebarProps) {
  const [view, setView] = useState<SidebarView>('collections');

  return (
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="sidebar__tabs">
        <button
          className={`sidebar__tab ${view === 'collections' ? 'sidebar__tab--active' : ''}`}
          onClick={() => setView('collections')}
        >
          <FolderIcon size={15} />
          Collections
        </button>
        <button
          className={`sidebar__tab ${view === 'history' ? 'sidebar__tab--active' : ''}`}
          onClick={() => setView('history')}
        >
          <HistoryIcon size={15} />
          History
        </button>
      </div>
      <div className="sidebar__content" onClick={onNavigate}>
        {view === 'collections' ? <Collections /> : <History />}
      </div>
    </aside>
  );
}
