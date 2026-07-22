/**
 * Central type definitions for the application.
 * No `any` types are used anywhere in the codebase.
 */

/** Supported HTTP methods. */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const HTTP_METHODS: readonly HttpMethod[] = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
] as const;

/** Theme options. */
export type Theme = 'light' | 'dark';

/** Body content mode for requests that support a body. */
export type BodyMode = 'none' | 'raw' | 'json';

/** A single editable key/value pair (used for both params and headers). */
export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  /** Whether this pair is active / included in the request. */
  enabled: boolean;
}

/** Query parameter — alias of KeyValuePair for semantic clarity. */
export type RequestParam = KeyValuePair;

/** Request header — alias of KeyValuePair for semantic clarity. */
export type RequestHeader = KeyValuePair;

/** Full editable state of a single request tab. */
export interface RequestTab {
  tabId: string;
  name: string;
  method: HttpMethod;
  url: string;
  params: RequestParam[];
  headers: RequestHeader[];
  bodyMode: BodyMode;
  body: string;
  /** The last response received in this tab (not persisted between sessions). */
  response: ResponseData | null;
  /** The last error received in this tab. */
  error: RequestError | null;
  /** Whether a request is currently in flight for this tab. */
  loading: boolean;
}

/** A request saved inside a collection. */
export interface SavedRequest {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers: RequestHeader[];
  params: RequestParam[];
  bodyMode: BodyMode;
  body: string;
}

/** A named group of saved requests. */
export interface Collection {
  id: string;
  name: string;
  requests: SavedRequest[];
}

/** The shape of an exported / imported collections file. */
export interface CollectionsFile {
  collections: Collection[];
}

/** An entry in the request history. */
export interface HistoryItem {
  id: string;
  method: HttpMethod;
  url: string;
  timestamp: number;
  status: number | null;
}

/** A successfully received HTTP response. */
export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  /** Raw response body as text. */
  data: string;
  /** Time taken for the round trip, in milliseconds. */
  timeMs: number;
  /** Approximate size of the response body, in bytes. */
  sizeBytes: number;
}

/** Category of a request failure. */
export type RequestErrorKind =
  | 'network'
  | 'timeout'
  | 'invalid-url'
  | 'client'
  | 'server'
  | 'unknown';

/** A friendly, structured request error. */
export interface RequestError {
  kind: RequestErrorKind;
  message: string;
  /** HTTP status, if a response was received (e.g. for 4xx/5xx). */
  status?: number;
}
