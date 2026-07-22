import type { RequestParam } from '@/types';

export interface UrlValidationResult {
  valid: boolean;
  error: string | null;
}

/**
 * Validates a request URL.
 * Rules: cannot be empty, must start with http:// or https://, and must parse.
 */
export function validateUrl(rawUrl: string): UrlValidationResult {
  const url = rawUrl.trim();

  if (url.length === 0) {
    return { valid: false, error: 'URL cannot be empty.' };
  }

  if (!/^https?:\/\//i.test(url)) {
    return { valid: false, error: 'URL must start with http:// or https://' };
  }

  try {
    // eslint-disable-next-line no-new
    new URL(url);
  } catch {
    return { valid: false, error: 'URL is not valid.' };
  }

  return { valid: true, error: null };
}

/**
 * Builds the final URL by appending enabled params as a query string.
 * Any existing query string on the base URL is preserved and merged.
 *
 * Example:
 *   buildUrlWithParams('https://api.com/users', [{key:'name',value:'ali'}, {key:'age',value:'22'}])
 *   => 'https://api.com/users?name=ali&age=22'
 */
export function buildUrlWithParams(baseUrl: string, params: RequestParam[]): string {
  const trimmed = baseUrl.trim();
  const activeParams = params.filter((p) => p.enabled && p.key.trim().length > 0);

  if (activeParams.length === 0) {
    return trimmed;
  }

  // Separate any existing hash so it stays at the end.
  const [withoutHash, hash] = splitOnce(trimmed, '#');
  const [base, existingQuery] = splitOnce(withoutHash, '?');

  const search = new URLSearchParams(existingQuery);
  for (const param of activeParams) {
    search.append(param.key, param.value);
  }

  const queryString = search.toString();
  const result = queryString.length > 0 ? `${base}?${queryString}` : base;
  return hash.length > 0 ? `${result}#${hash}` : result;
}

/** Splits a string on the first occurrence of a separator. */
function splitOnce(input: string, separator: string): [string, string] {
  const index = input.indexOf(separator);
  if (index === -1) {
    return [input, ''];
  }
  return [input.slice(0, index), input.slice(index + 1)];
}
