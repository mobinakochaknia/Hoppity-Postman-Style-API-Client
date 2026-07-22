import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A generic hook that keeps a piece of state in sync with localStorage.
 * Accepts custom read/write functions so callers can reuse the typed storage layer.
 */
export function useLocalStorage<T>(
  read: () => T,
  write: (value: T) => void,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(read);
  const writeRef = useRef(write);
  writeRef.current = write;

  // Persist whenever state changes.
  useEffect(() => {
    writeRef.current(state);
  }, [state]);

  const set = useCallback((value: T | ((prev: T) => T)) => {
    setState(value);
  }, []);

  return [state, set];
}
