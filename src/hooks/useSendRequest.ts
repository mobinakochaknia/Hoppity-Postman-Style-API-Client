import { useCallback } from 'react';
import type { RequestError, RequestTab } from '@/types';
import { sendRequest } from '@/services/httpClient';
import { buildUrlWithParams, validateUrl } from '@/utils/url';
import { useTabs } from '@/hooks/useTabs';
import { useHistory } from '@/hooks/useHistory';

/** Narrows an unknown thrown value to our structured RequestError. */
function isRequestError(value: unknown): value is RequestError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'kind' in value &&
    'message' in value
  );
}

/**
 * Returns a function that sends the request for a given tab, managing
 * loading state, response/error storage, and history recording.
 */
export function useSendRequest() {
  const { updateTab } = useTabs();
  const { addHistory } = useHistory();

  const send = useCallback(
    async (tab: RequestTab) => {
      // Guard: validate URL before doing anything.
      const validation = validateUrl(tab.url);
      if (!validation.valid) {
        updateTab(tab.tabId, {
          error: { kind: 'invalid-url', message: validation.error ?? 'Invalid URL.' },
          response: null,
        });
        return;
      }

      const finalUrl = buildUrlWithParams(tab.url, tab.params);
      const hasBody = tab.bodyMode !== 'none' && tab.body.trim().length > 0;

      updateTab(tab.tabId, { loading: true, error: null });

      try {
        const response = await sendRequest({
          method: tab.method,
          url: finalUrl,
          headers: tab.headers,
          body: hasBody ? tab.body : null,
        });

        updateTab(tab.tabId, { response, error: null, loading: false });
        addHistory({ method: tab.method, url: finalUrl, status: response.status });
      } catch (err) {
        // sendRequest already throws a structured RequestError — use it directly
        // instead of re-converting it (which was hiding the real error).
        const error: RequestError = isRequestError(err)
          ? err
          : { kind: 'unknown', message: 'An unexpected error occurred.' };
        updateTab(tab.tabId, { error, response: null, loading: false });
      }
    },
    [updateTab, addHistory],
  );

  return send;
}