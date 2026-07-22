interface SpinnerProps {
  large?: boolean;
}

/** A simple CSS spinner that inherits the current text color. */
export function Spinner({ large = false }: SpinnerProps) {
  return <span className={large ? 'spinner spinner--lg' : 'spinner'} aria-hidden />;
}
