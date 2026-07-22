export interface JsonValidationResult {
  valid: boolean;
  error: string | null;
}

/** Validates that a string is parseable JSON. Empty strings are considered valid (no body). */
export function validateJson(raw: string): JsonValidationResult {
  const text = raw.trim();
  if (text.length === 0) {
    return { valid: true, error: null };
  }
  try {
    JSON.parse(text);
    return { valid: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid JSON';
    return { valid: false, error: message };
  }
}

/** Pretty-prints a JSON string with 2-space indentation. Returns the input unchanged if it is not JSON. */
export function prettyPrintJson(raw: string): string {
  try {
    const parsed: unknown = JSON.parse(raw);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return raw;
  }
}

/** Returns true if a string can be parsed as JSON. */
export function isJsonString(raw: string): boolean {
  const text = raw.trim();
  if (text.length === 0) return false;
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}
