import { useEffect, useRef, useState } from 'react';
import type { HttpMethod } from '@/types';
import { HTTP_METHODS } from '@/types';
import { ChevronDownIcon } from '@/components/UI/Icons';
import { methodColor } from '@/components/UI/MethodBadge';

interface MethodSelectProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
}

/** A custom dropdown for choosing the HTTP method, with color-coded options. */
export function MethodSelect({ value, onChange }: MethodSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="method-select" ref={ref}>
      <button
        className="method-select__button"
        onClick={() => setOpen((o) => !o)}
        style={{ color: methodColor(value) }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value}</span>
        <ChevronDownIcon size={15} style={{ color: 'var(--text-muted)' }} />
      </button>
      {open && (
        <div className="method-select__menu" role="listbox">
          {HTTP_METHODS.map((method) => (
            <button
              key={method}
              className="method-select__option"
              style={{ color: methodColor(method) }}
              role="option"
              aria-selected={method === value}
              onClick={() => {
                onChange(method);
                setOpen(false);
              }}
            >
              <span className="method-dot" style={{ background: methodColor(method) }} />
              {method}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
