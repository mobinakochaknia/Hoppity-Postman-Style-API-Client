import type {
  BodyMode,
  Collection,
  CollectionsFile,
  HttpMethod,
  KeyValuePair,
  SavedRequest,
} from '@/types';
import { HTTP_METHODS } from '@/types';

/* ---------------------------- Type guards ----------------------------- */

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isHttpMethod(value: unknown): value is HttpMethod {
  return typeof value === 'string' && (HTTP_METHODS as readonly string[]).includes(value);
}

function isBodyMode(value: unknown): value is BodyMode {
  return value === 'none' || value === 'raw' || value === 'json';
}

function coerceKeyValuePairs(value: unknown): KeyValuePair[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isObject)
    .map((item) => ({
      id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
      key: typeof item.key === 'string' ? item.key : '',
      value: typeof item.value === 'string' ? item.value : '',
      enabled: typeof item.enabled === 'boolean' ? item.enabled : true,
    }));
}

function validateSavedRequest(value: unknown, index: number): SavedRequest {
  if (!isObject(value)) {
    throw new Error(`Request #${index + 1} is not an object.`);
  }
  if (!isHttpMethod(value.method)) {
    throw new Error(`Request #${index + 1} has an invalid HTTP method.`);
  }
  if (typeof value.url !== 'string') {
    throw new Error(`Request #${index + 1} is missing a valid url.`);
  }

  return {
    id: typeof value.id === 'string' ? value.id : crypto.randomUUID(),
    name: typeof value.name === 'string' ? value.name : value.url,
    method: value.method,
    url: value.url,
    headers: coerceKeyValuePairs(value.headers),
    params: coerceKeyValuePairs(value.params),
    bodyMode: isBodyMode(value.bodyMode) ? value.bodyMode : 'none',
    body: typeof value.body === 'string' ? value.body : '',
  };
}

function validateCollection(value: unknown, index: number): Collection {
  if (!isObject(value)) {
    throw new Error(`Collection #${index + 1} is not an object.`);
  }
  if (typeof value.name !== 'string') {
    throw new Error(`Collection #${index + 1} is missing a name.`);
  }
  if (!Array.isArray(value.requests)) {
    throw new Error(`Collection "${value.name}" is missing a requests array.`);
  }

  return {
    id: typeof value.id === 'string' ? value.id : crypto.randomUUID(),
    name: value.name,
    requests: value.requests.map((r, i) => validateSavedRequest(r, i)),
  };
}

/**
 * Parses and validates a collections file string.
 * Throws an Error with a friendly message if the structure is invalid.
 */
export function validateCollectionsFile(raw: string): CollectionsFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('File is not valid JSON.');
  }

  if (!isObject(parsed)) {
    throw new Error('Root of the file must be an object.');
  }
  if (!Array.isArray(parsed.collections)) {
    throw new Error('File must contain a "collections" array.');
  }

  const collections = parsed.collections.map((c, i) => validateCollection(c, i));
  return { collections };
}

/* ------------------------------ Export -------------------------------- */

/** Triggers a browser download of the given collection(s) as a JSON file. */
export function downloadCollection(collection: Collection): void {
  const payload: CollectionsFile = { collections: [collection] };
  const safeName = collection.name.replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
  triggerDownload(`${safeName || 'collection'}.json`, JSON.stringify(payload, null, 2));
}

/** Triggers a browser download of all collections. */
export function downloadAllCollections(collections: Collection[]): void {
  const payload: CollectionsFile = { collections };
  triggerDownload('collections.json', JSON.stringify(payload, null, 2));
}

function triggerDownload(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
