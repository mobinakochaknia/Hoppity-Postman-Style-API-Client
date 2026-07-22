import { useEffect } from 'react';

export interface ShortcutHandlers {
  onSend?: () => void;
  onNewTab?: () => void;
  onCloseTab?: () => void;
  onSave?: () => void;
}

/**
 * Registers global keyboard shortcuts:
 *   - Ctrl/Cmd + Enter : send request
 *   - Ctrl/Cmd + T     : new tab
 *   - Ctrl/Cmd + W     : close tab
 *   - Ctrl/Cmd + S     : save request
 */
export function useKeyboardShortcuts(handlers: ShortcutHandlers): void {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey;
      if (!mod) return;

      switch (event.key.toLowerCase()) {
        case 'enter':
          event.preventDefault();
          handlers.onSend?.();
          break;
        case 't':
          event.preventDefault();
          handlers.onNewTab?.();
          break;
        case 'w':
          // Only intercept when we have a handler; otherwise let the browser act.
          if (handlers.onCloseTab) {
            event.preventDefault();
            handlers.onCloseTab();
          }
          break;
        case 's':
          event.preventDefault();
          handlers.onSave?.();
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlers]);
}
