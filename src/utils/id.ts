/**
 * Generates a reasonably unique id.
 * Uses crypto.randomUUID when available, with a fallback for older environments.
 */
export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback: timestamp + random suffix.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
