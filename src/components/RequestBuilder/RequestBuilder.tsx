import { useMemo, useState } from 'react';
import type { BodyMode, HttpMethod, RequestHeader, RequestParam } from '@/types';
import { useTabs } from '@/hooks/useTabs';
import { useSendRequest } from '@/hooks/useSendRequest';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { validateUrl } from '@/utils/url';
import { MethodSelect } from '@/components/RequestBuilder/MethodSelect';
import { ParamsEditor } from '@/components/ParamsEditor/ParamsEditor';
import { HeadersEditor } from '@/components/HeadersEditor/HeadersEditor';
import { BodyEditor } from '@/components/BodyEditor/BodyEditor';
import { ResponseViewer } from '@/components/ResponseViewer/ResponseViewer';
import { SaveRequestModal } from '@/components/Collections/SaveRequestModal';
import { Button } from '@/components/UI/Button';
import { Spinner } from '@/components/UI/Spinner';
import { RefreshIcon, SaveIcon, SendIcon } from '@/components/UI/Icons';

type ConfigTab = 'params' | 'headers' | 'body';

/** Methods that support a request body. */
const BODY_METHODS: HttpMethod[] = ['POST', 'PUT', 'PATCH'];

/** The main request-building workspace for the active tab. */
export function RequestBuilder() {
  const { activeTab, updateActiveTab, updateTab, openTab, closeTab, activeTabId } =
    useTabs();
  const send = useSendRequest();

  const [configTab, setConfigTab] = useState<ConfigTab>('params');
  const [touched, setTouched] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);

  const supportsBody = BODY_METHODS.includes(activeTab.method);
  const validation = useMemo(() => validateUrl(activeTab.url), [activeTab.url]);
  const showUrlError = touched && !validation.valid;

  const activeParamCount = activeTab.params.filter((p) => p.key.trim()).length;
  const activeHeaderCount = activeTab.headers.filter((h) => h.key.trim()).length;

  const handleSend = () => {
    setTouched(true);
    if (!validation.valid) return;
    void send(activeTab);
  };

  const handleClear = () => {
    // Reset everything in place but keep the same tab id so the tab stays open.
    updateTab(activeTab.tabId, {
      method: 'GET',
      url: '',
      name: 'Untitled Request',
      params: [],
      headers: [],
      bodyMode: 'none',
      body: '',
      response: null,
      error: null,
      loading: false,
    });
    setTouched(false);
    setConfigTab('params');
  };

  // Keyboard shortcuts scoped to the workspace.
  useKeyboardShortcuts({
    onSend: handleSend,
    onNewTab: () => openTab(),
    onCloseTab: () => closeTab(activeTabId),
    onSave: () => setSaveOpen(true),
  });

  // Switch away from body tab if the method no longer supports it (derived, no render-time setState).
  const effectiveConfigTab: ConfigTab =
    !supportsBody && configTab === 'body' ? 'params' : configTab;

  const setParams = (params: RequestParam[]) => updateActiveTab({ params });
  const setHeaders = (headers: RequestHeader[]) => updateActiveTab({ headers });
  const setBodyMode = (bodyMode: BodyMode) => updateActiveTab({ bodyMode });
  const setBody = (body: string) => updateActiveTab({ body });

  return (
    <div className="workspace">
      {/* URL + method bar */}
      <div className="request-bar">
        <MethodSelect
          value={activeTab.method}
          onChange={(method) => updateActiveTab({ method })}
        />
        <div className="url-input-wrap">
          <input
            className={`url-input ${showUrlError ? 'url-input--error' : ''}`}
            value={activeTab.url}
            placeholder="https://api.example.com/users"
            spellCheck={false}
            onChange={(e) => updateActiveTab({ url: e.target.value })}
            onBlur={() => setTouched(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          {showUrlError && <span className="field-error">{validation.error}</span>}
        </div>
        <Button
          variant="primary"
          className="btn--send"
          onClick={handleSend}
          disabled={activeTab.loading}
        >
          {activeTab.loading ? (
            <>
              <Spinner />
              Sending…
            </>
          ) : (
            <>
              <SendIcon size={16} />
              Send
            </>
          )}
        </Button>
        <Button variant="ghost" onClick={() => setSaveOpen(true)} title="Save (Ctrl+S)">
          <SaveIcon size={16} />
          Save
        </Button>
        <Button variant="ghost" size="icon" onClick={handleClear} title="Clear request">
          <RefreshIcon size={16} />
        </Button>
      </div>

      {/* Request config */}
      <div className="config">
        <div className="config__tabs">
          <button
            className={`config__tab ${effectiveConfigTab === 'params' ? 'config__tab--active' : ''}`}
            onClick={() => setConfigTab('params')}
          >
            Params
            {activeParamCount > 0 && (
              <span className="config__badge">{activeParamCount}</span>
            )}
          </button>
          <button
            className={`config__tab ${effectiveConfigTab === 'headers' ? 'config__tab--active' : ''}`}
            onClick={() => setConfigTab('headers')}
          >
            Headers
            {activeHeaderCount > 0 && (
              <span className="config__badge">{activeHeaderCount}</span>
            )}
          </button>
          {supportsBody && (
            <button
              className={`config__tab ${effectiveConfigTab === 'body' ? 'config__tab--active' : ''}`}
              onClick={() => setConfigTab('body')}
            >
              Body
              {activeTab.bodyMode !== 'none' && (
                <span className="config__badge">{activeTab.bodyMode}</span>
              )}
            </button>
          )}
        </div>

        <div className="config__panel">
          {effectiveConfigTab === 'params' && (
            <ParamsEditor params={activeTab.params} onChange={setParams} />
          )}
          {effectiveConfigTab === 'headers' && (
            <HeadersEditor headers={activeTab.headers} onChange={setHeaders} />
          )}
          {effectiveConfigTab === 'body' && supportsBody && (
            <BodyEditor
              mode={activeTab.bodyMode}
              body={activeTab.body}
              onModeChange={setBodyMode}
              onBodyChange={setBody}
            />
          )}
        </div>
      </div>

      {/* Response */}
      <ResponseViewer
        response={activeTab.response}
        error={activeTab.error}
        loading={activeTab.loading}
      />

      <SaveRequestModal
        open={saveOpen}
        tab={activeTab}
        onClose={() => setSaveOpen(false)}
      />
    </div>
  );
}
