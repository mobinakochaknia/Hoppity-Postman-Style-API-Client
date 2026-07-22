import type { KeyValuePair } from '@/types';
import { createKeyValuePair } from '@/utils/request';
import { Button } from '@/components/UI/Button';
import { PlusIcon, TrashIcon } from '@/components/UI/Icons';

interface KeyValueEditorProps {
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addLabel?: string;
}

/**
 * A generic editor for a list of enabled key/value pairs.
 * Supports add, edit (key/value/enabled) and delete — shared by params & headers.
 */
export function KeyValueEditor({
  pairs,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  addLabel = 'Add',
}: KeyValueEditorProps) {
  const update = (id: string, patch: Partial<KeyValuePair>) => {
    onChange(pairs.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const remove = (id: string) => {
    onChange(pairs.filter((p) => p.id !== id));
  };

  const add = () => {
    onChange([...pairs, createKeyValuePair()]);
  };

  return (
    <div className="kv">
      {pairs.length === 0 && (
        <p className="empty-state" style={{ padding: '12px 0' }}>
          No entries yet.
        </p>
      )}

      {pairs.map((pair) => (
        <div className="kv__row" key={pair.id}>
          <span className="kv__check">
            <input
              type="checkbox"
              checked={pair.enabled}
              onChange={(e) => update(pair.id, { enabled: e.target.checked })}
              aria-label="Enabled"
            />
          </span>
          <input
            className="kv__input"
            placeholder={keyPlaceholder}
            value={pair.key}
            onChange={(e) => update(pair.id, { key: e.target.value })}
          />
          <input
            className="kv__input"
            placeholder={valuePlaceholder}
            value={pair.value}
            onChange={(e) => update(pair.id, { value: e.target.value })}
          />
          <button
            className="kv__delete"
            onClick={() => remove(pair.id)}
            aria-label="Delete entry"
          >
            <TrashIcon size={15} />
          </button>
        </div>
      ))}

      <Button variant="subtle" size="sm" className="kv__add" onClick={add}>
        <PlusIcon size={15} />
        {addLabel}
      </Button>
    </div>
  );
}
