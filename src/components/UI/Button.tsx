import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'subtle';
type Size = 'md' | 'sm' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary: 'btn--primary',
  ghost: 'btn--ghost',
  subtle: 'btn--subtle',
};

const sizeClass: Record<Size, string> = {
  md: '',
  sm: 'btn--sm',
  icon: 'btn--icon',
};

/** A small, themeable button primitive. */
export function Button({
  variant = 'ghost',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = ['btn', variantClass[variant], sizeClass[size], className]
    .filter(Boolean)
    .join(' ');
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
