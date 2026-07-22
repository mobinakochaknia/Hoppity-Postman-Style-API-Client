import { useTabs } from '@/hooks/useTabs';
import { CloseIcon, PlusIcon } from '@/components/UI/Icons';
import { methodColor } from '@/components/UI/MethodBadge';

/** The horizontal bar of request tabs above the workspace. */
export function TabBar() {
  const { tabs, activeTabId, openTab, closeTab, switchTab } = useTabs();

  return (
    <div className="tabbar" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.tabId === activeTabId;
        const label = tab.name.trim() || tab.url.trim() || 'Untitled';
        return (
          <div
            key={tab.tabId}
            className={`tabbar__tab ${isActive ? 'tabbar__tab--active' : ''}`}
            onClick={() => switchTab(tab.tabId)}
            role="tab"
            aria-selected={isActive}
          >
            <span className="tabbar__method" style={{ color: methodColor(tab.method) }}>
              {tab.method}
            </span>
            <span className="tabbar__label">{label}</span>
            <button
              className="tabbar__close"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.tabId);
              }}
              aria-label="Close tab"
            >
              <CloseIcon size={13} />
            </button>
          </div>
        );
      })}
      <button className="tabbar__add" onClick={() => openTab()} aria-label="New tab">
        <PlusIcon size={16} />
      </button>
    </div>
  );
}
