import type { RequestHeader } from '@/types';
import { KeyValueEditor } from '@/components/KeyValueEditor/KeyValueEditor';

interface HeadersEditorProps {
  headers: RequestHeader[];
  onChange: (headers: RequestHeader[]) => void;
}

/** Request-header editor. */
export function HeadersEditor({ headers, onChange }: HeadersEditorProps) {
  return (
    <KeyValueEditor
      pairs={headers}
      onChange={onChange}
      keyPlaceholder="Header"
      valuePlaceholder="Value"
      addLabel="Add header"
    />
  );
}
