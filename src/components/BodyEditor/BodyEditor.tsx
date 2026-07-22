import { useMemo } from 'react';
import type { BodyMode } from '@/types';
import { prettyPrintJson, validateJson } from '@/utils/json';
import { Button } from '@/components/UI/Button';

interface BodyEditorProps {
  mode: BodyMode;
  body: string;
  onModeChange: (mode: BodyMode) => void;
  onBodyChange: (body: string) => void;
}

const MODES: { value: BodyMode; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'raw', label: 'Raw' },
  { value: 'json', label: 'JSON' },
];

/** Editor for the request body, supporting raw text and validated JSON. */
export function BodyEditor({ mode, body, onModeChange, onBodyChange }: BodyEditorProps) {
  const jsonValidation = useMemo(
    () => (mode === 'json' ? validateJson(body) : { valid: true, error: null }),
    [mode, body],
  );

  const handleFormat = () => {
    if (jsonValidation.valid) {
      onBodyChange(prettyPrintJson(body));
    }
  };

  return (
    <div className="body-editor">
      <div className="body-editor__modes">
        {MODES.map((m) => (
          <button
            key={m.value}
            className={`mode-pill ${mode === m.value ? 'mode-pill--active' : ''}`}
            onClick={() => onModeChange(m.value)}
          >
            {m.label}
          </button>
        ))}
        {mode === 'json' && (
          <Button
            variant="subtle"
            size="sm"
            onClick={handleFormat}
            disabled={!jsonValidation.valid || body.trim().length === 0}
            style={{ marginLeft: 'auto' }}
          >
            Beautify
          </Button>
        )}
      </div>

      {mode === 'none' ? (
        <p className="empty-state">This request has no body.</p>
      ) : (
        <>
          <textarea
            className={`code-area ${
              mode === 'json' && !jsonValidation.valid ? 'code-area--error' : ''
            }`}
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            placeholder={mode === 'json' ? '{\n  "name": "Ali"\n}' : 'hello world'}
            spellCheck={false}
          />
          {mode === 'json' && body.trim().length > 0 && (
            <div
              className={`json-status ${
                jsonValidation.valid ? 'json-status--ok' : 'json-status--err'
              }`}
            >
              {jsonValidation.valid
                ? '● Valid JSON'
                : `● ${jsonValidation.error ?? 'Invalid JSON'}`}
            </div>
          )}
        </>
      )}
    </div>
  );
}
