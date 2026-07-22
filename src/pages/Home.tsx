import { useCallback, useState } from 'react';
import { useCollections } from '@/hooks/useCollections';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { TabBar } from '@/components/Tabs/TabBar';
import { RequestBuilder } from '@/components/RequestBuilder/RequestBuilder';
import { ThemeToggle } from '@/components/UI/ThemeToggle';
import { MenuIcon } from '@/components/UI/Icons';

/** The top-level page composing the entire application UI. */
export function Home() {
  const { importCollections } = useCollections();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2000);
  }, []);

  // Drag & drop import of collection JSON files (bonus).
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          importCollections(String(reader.result));
          showToast('Collections imported successfully');
        } catch (err) {
          showToast(err instanceof Error ? err.message : 'Import failed');
        }
      };
      reader.readAsText(file);
    },
    [importCollections, showToast],
  );

  return (
    <div
      className={`app ${dragging ? 'dropzone-active' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!dragging) setDragging(true);
      }}
      onDragLeave={(e) => {
        // Only clear when leaving the window, not entering a child.
        if (e.relatedTarget === null) setDragging(false);
      }}
      onDrop={handleDrop}
    >
      <header className="app__topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn btn--subtle btn--icon sidebar-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle sidebar"
          >
            <MenuIcon size={18} />
          </button>
          <div className="brand">
            <span className="brand__mark">H</span>
            <span>Hoppity</span>
            <span className="brand__sub">api client</span>
          </div>
        </div>
        <div className="topbar__actions">
          <ThemeToggle />
        </div>
      </header>

      <div className="app__body">
        {sidebarOpen && (
          <div className="scrim" onClick={() => setSidebarOpen(false)} />
        )}
        <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        <main className="main">
          <TabBar />
          <RequestBuilder />
        </main>
      </div>

      {toast && <div className="copy-toast">{toast}</div>}
    </div>
  );
}
