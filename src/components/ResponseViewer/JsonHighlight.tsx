import { Fragment, type ReactNode } from 'react';

/**
 * Tokenises a (pretty-printed) JSON string into highlighted React spans.
 * This is rendered as React nodes (not dangerouslySetInnerHTML) for safety.
 */
const TOKEN_REGEX =
  /("(?:\\.|[^"\\])*"\s*:)|("(?:\\.|[^"\\])*")|(\b-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(\btrue\b|\bfalse\b)|(\bnull\b)/g;

function classForMatch(match: RegExpExecArray): string {
  if (match[1] !== undefined) return 'tok-key';
  if (match[2] !== undefined) return 'tok-string';
  if (match[3] !== undefined) return 'tok-number';
  if (match[4] !== undefined) return 'tok-boolean';
  if (match[5] !== undefined) return 'tok-null';
  return '';
}

export function JsonHighlight({ json }: { json: string }) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  // Reset regex state for each render.
  TOKEN_REGEX.lastIndex = 0;

  while ((match = TOKEN_REGEX.exec(json)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <Fragment key={key++}>{json.slice(lastIndex, match.index)}</Fragment>,
      );
    }
    nodes.push(
      <span className={classForMatch(match)} key={key++}>
        {match[0]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < json.length) {
    nodes.push(<Fragment key={key++}>{json.slice(lastIndex)}</Fragment>);
  }

  return <pre className="code-block">{nodes}</pre>;
}
