import { useHistory } from '@/hooks/useHistory';
import { useTabs } from '@/hooks/useTabs';
import { formatRelativeTime } from '@/utils/format';
import { tabFromHistory } from '@/utils/request';
import { methodColor } from '@/components/UI/MethodBadge';
import { Button } from '@/components/UI/Button';
import { TrashIcon } from '@/components/UI/Icons';

/** Sidebar panel listing past requests. */
export function History() {
  const { history, removeHistory, clearHistory } = useHistory();
  const { openTab } = useTabs();

  return (
    <div>
      <div className="sidebar__section-head">
        <span className="sidebar__section-title">History</span>
        {history.length > 0 && (
          <Button variant="subtle" size="sm" onClick={clearHistory}>
            Clear all
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="empty-state">
          No requests yet.
          <br />
          Sent requests will appear here.
        </p>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            className="list-item"
            onClick={() => openTab(tabFromHistory(item.method, item.url))}
            title="Reopen request"
          >
            <span
              className="list-item__method"
              style={{ color: methodColor(item.method) }}
            >
              {item.method}
            </span>
            <div className="list-item__main">
              <div className="list-item__title">{item.url}</div>
              <div className="list-item__sub">
                {item.status !== null ? `${item.status} · ` : ''}
                {formatRelativeTime(item.timestamp)}
              </div>
            </div>
            <div className="list-item__actions">
              <button
                className="icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeHistory(item.id);
                }}
                aria-label="Delete history item"
              >
                <TrashIcon size={14} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
