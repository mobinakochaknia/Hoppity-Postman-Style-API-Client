import type { RequestParam } from '@/types';
import { KeyValueEditor } from '@/components/KeyValueEditor/KeyValueEditor';

interface ParamsEditorProps {
  params: RequestParam[];
  onChange: (params: RequestParam[]) => void;
}

/** Query-parameter editor. The final URL is generated from these in the send hook. */
export function ParamsEditor({ params, onChange }: ParamsEditorProps) {
  return (
    <KeyValueEditor
      pairs={params}
      onChange={onChange}
      keyPlaceholder="Parameter"
      valuePlaceholder="Value"
      addLabel="Add parameter"
    />
  );
}
