import type { HttpMethod } from '@/types';

/** Maps an HTTP method to its themed CSS color variable. */
export function methodColor(method: HttpMethod): string {
  switch (method) {
    case 'GET':
      return 'var(--method-get)';
    case 'POST':
      return 'var(--method-post)';
    case 'PUT':
      return 'var(--method-put)';
    case 'PATCH':
      return 'var(--method-patch)';
    case 'DELETE':
      return 'var(--method-delete)';
    default:
      return 'var(--text-muted)';
  }
}

/** A small colored method label. */
export function MethodBadge({
  method,
  className = '',
}: {
  method: HttpMethod;
  className?: string;
}) {
  return (
    <span className={className} style={{ color: methodColor(method) }}>
      {method}
    </span>
  );
}
