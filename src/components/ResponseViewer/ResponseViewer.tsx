import { useState } from 'react';
import type { RequestError, ResponseData } from '@/types';
import { isJsonString, prettyPrintJson } from '@/utils/json';
import { formatBytes, formatDuration, statusCategory } from '@/utils/format';
import { JsonHighlight } from '@/components/ResponseViewer/JsonHighlight';
import { Button } from '@/components/UI/Button';
import { Spinner } from '@/components/UI/Spinner';
import { CopyIcon } from '@/components/UI/Icons';

interface ResponseViewerProps {
  response: ResponseData | null;
  error: RequestError | null;
  loading: boolean;
}

type BodyTab = 'body' | 'headers';

const STATUS_COLORS: Record<ReturnType<typeof statusCategory>, string> = {
  success: 'var(--status-success)',
  redirect: 'var(--status-redirect)',
  'client-error': 'var(--status-client)',
  'server-error': 'var(--status-server)',
  info: 'var(--status-info)',
};

/** Renders the response, loading state, or error in a friendly way. */
export function ResponseViewer({ response, error, loading }: ResponseViewerProps) {
  const [tab, setTab] = useState<BodyTab>('body');
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="response">
        <div className="loading-state">
          <Spinner large />
          <span>Sending Request…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="response">
        <div className="error-card">
          <div className="error-card__icon">⚠️</div>
          <div>
            <div className="error-card__title">{error.kind.replace('-', ' ')} error</div>
            <div className="error-card__message">{error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="response">
        <div className="placeholder">
          <div className="placeholder__inner">
            <div className="placeholder__icon">⚡</div>
            <p>Send a request to see the response here.</p>
          </div>
        </div>
      </div>
    );
  }

  const category = statusCategory(response.status);
  const color = STATUS_COLORS[category];
  const headerEntries = Object.entries(response.headers);
  const isJson = isJsonString(response.data);
  const prettyBody = isJson ? prettyPrintJson(response.data) : response.data;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prettyBody);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable; ignore silently.
    }
  };

  return (
    <div className="response">
      <div className="response__meta">
        <span
          className="status-pill"
          style={{ color, background: 'color-mix(in srgb, currentColor 14%, transparent)' }}
        >
          ● {response.status} {response.statusText}
        </span>
        <span className="meta-stat">
          Time <strong>{formatDuration(response.timeMs)}</strong>
        </span>
        <span className="meta-stat">
          Size <strong>{formatBytes(response.sizeBytes)}</strong>
        </span>
        <Button
          variant="subtle"
          size="sm"
          onClick={handleCopy}
          style={{ marginLeft: 'auto' }}
        >
          <CopyIcon size={14} />
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>

      <div className="response__tabs">
        <button
          className={`config__tab ${tab === 'body' ? 'config__tab--active' : ''}`}
          onClick={() => setTab('body')}
        >
          Body
        </button>
        <button
          className={`config__tab ${tab === 'headers' ? 'config__tab--active' : ''}`}
          onClick={() => setTab('headers')}
        >
          Headers
          {headerEntries.length > 0 && (
            <span className="config__badge">{headerEntries.length}</span>
          )}
        </button>
      </div>

      <div className="response__body">
        {tab === 'body' ? (
          isJson ? (
            <JsonHighlight json={prettyBody} />
          ) : (
            <pre className="code-block">{prettyBody || '(empty response body)'}</pre>
          )
        ) : (
          <table className="resp-headers">
            <tbody>
              {headerEntries.length === 0 ? (
                <tr>
                  <td colSpan={2} style={{ color: 'var(--text-faint)' }}>
                    No headers returned.
                  </td>
                </tr>
              ) : (
                headerEntries.map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
