import axios, { AxiosError, type AxiosResponse, type Method } from 'axios';
import type {
  HttpMethod,
  RequestError,
  RequestHeader,
  ResponseData,
} from '@/types';

/** Options describing a request to send. */
export interface SendRequestOptions {
  method: HttpMethod;
  /** The final URL, already including any query string. */
  url: string;
  headers: RequestHeader[];
  /** Raw body string, or null if no body should be sent. */
  body: string | null;
  /** Timeout in milliseconds. */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT = 30_000;

/** Converts a list of header pairs into a plain object, ignoring empty/disabled entries. */
function buildHeaders(headers: RequestHeader[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const header of headers) {
    if (header.enabled && header.key.trim().length > 0) {
      result[header.key.trim()] = header.value;
    }
  }
  return result;
}

/** Normalises Axios response headers into a flat string record. */
function normaliseResponseHeaders(raw: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (raw && typeof raw === 'object') {
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      result[key] = Array.isArray(value) ? value.join(', ') : String(value);
    }
  }
  return result;
}

/** Converts response data into a raw text string. */
function stringifyResponseData(data: unknown): string {
  if (typeof data === 'string') return data;
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

/** Estimates the byte size of a UTF-8 string. */
function byteSize(text: string): number {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(text).length;
  }
  return text.length;
}

/**
 * Sends an HTTP request using Axios and returns a normalised ResponseData.
 * Throws a structured RequestError on failure — the application never crashes.
 */
export async function sendRequest(options: SendRequestOptions): Promise<ResponseData> {
  const { method, url, headers, body, timeoutMs = DEFAULT_TIMEOUT } = options;
  const start = performance.now();

  try {
    const response: AxiosResponse = await axios.request({
      url,
      method: method as Method,
      headers: buildHeaders(headers),
      data: body ?? undefined,
      timeout: timeoutMs,
      // Treat all status codes as resolved so we can display 4xx/5xx bodies.
      validateStatus: () => true,
      // Always receive the body as text so we control parsing/pretty-printing.
      transformResponse: [(value: unknown) => value],
      responseType: 'text',
    });

    const elapsed = performance.now() - start;
    const dataText = stringifyResponseData(response.data);

    return {
      status: response.status,
      statusText: response.statusText,
      headers: normaliseResponseHeaders(response.headers),
      data: dataText,
      timeMs: elapsed,
      sizeBytes: byteSize(dataText),
    };
  } catch (err) {
    throw toRequestError(err);
  }
}

/** Maps an unknown thrown value into a friendly, structured RequestError. */
export function toRequestError(err: unknown): RequestError {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError;

    if (axiosErr.code === 'ECONNABORTED') {
      return {
        kind: 'timeout',
        message: 'The request timed out. The server took too long to respond.',
      };
    }

    if (axiosErr.code === 'ERR_INVALID_URL') {
      return { kind: 'invalid-url', message: 'The request URL is invalid.' };
    }

    if (axiosErr.response) {
      const status = axiosErr.response.status;
      const kind = status >= 500 ? 'server' : 'client';
      return {
        kind,
        status,
        message: `Request failed with status ${status}.`,
      };
    }

    // No response received — almost always a network/CORS issue.
    return {
      kind: 'network',
      message:
        'Network error: could not reach the server. Check your connection, ' +
        'the URL, or whether the server allows cross-origin requests (CORS).',
    };
  }

  const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
  return { kind: 'unknown', message };
}
