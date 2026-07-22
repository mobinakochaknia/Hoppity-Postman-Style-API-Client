import { createId } from '@/utils/id';
import type {
  HttpMethod,
  KeyValuePair,
  RequestTab,
  SavedRequest,
} from '@/types';

/** Creates an empty, enabled key/value pair. */
export function createKeyValuePair(): KeyValuePair {
  return { id: createId(), key: '', value: '', enabled: true };
}

/** Creates a fresh, empty request tab. */
export function createEmptyTab(): RequestTab {
  return {
    tabId: createId(),
    name: 'Untitled Request',
    method: 'GET',
    url: '',
    params: [],
    headers: [],
    bodyMode: 'none',
    body: '',
    response: null,
    error: null,
    loading: false,
  };
}

/** Builds a tab from a saved request (used when loading from a collection or history). */
export function tabFromSavedRequest(saved: SavedRequest): RequestTab {
  return {
    tabId: createId(),
    name: saved.name,
    method: saved.method,
    url: saved.url,
    params: saved.params.map((p) => ({ ...p, id: createId() })),
    headers: saved.headers.map((h) => ({ ...h, id: createId() })),
    bodyMode: saved.bodyMode,
    body: saved.body,
    response: null,
    error: null,
    loading: false,
  };
}

/** Converts a tab into a saveable request. */
export function savedRequestFromTab(tab: RequestTab, name: string): SavedRequest {
  return {
    id: createId(),
    name,
    method: tab.method,
    url: tab.url,
    headers: tab.headers.map((h) => ({ ...h })),
    params: tab.params.map((p) => ({ ...p })),
    bodyMode: tab.bodyMode,
    body: tab.body,
  };
}

/** Builds a minimal tab from a method + url (used when reopening from history). */
export function tabFromHistory(method: HttpMethod, url: string): RequestTab {
  return {
    ...createEmptyTab(),
    method,
    url,
    name: url || 'Untitled Request',
  };
}
