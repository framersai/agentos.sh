import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * LinkButton - Button-styled Link component
 * Uses same visual treatment as Button but navigates instead of submitting
 */

type LinkButtonVariant = 'primary' | 'secondary' | 'ghost';
type LinkButtonSize = 'sm' | 'md' | 'lg';

interface LinkButtonProps extends React.ComponentProps<typeof Link> {
  variant?: LinkButtonVariant;
  size?: LinkButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<LinkButtonVariant, string> = {
  primary: `
    relative overflow-hidden
    bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]
    text-[var(--color-text-on-accent)]
    shadow-lg shadow-[var(--color-accent-primary)]/20
    hover:shadow-xl hover:shadow-[var(--color-accent-primary)]/30
    hover:brightness-110
    active:scale-[0.98]
    transition-all duration-[var(--duration-fast)]
  `,
  
  secondary: `
    relative
    bg-[var(--color-background-glass)]
    backdrop-blur-xl
    border border-[var(--color-border-subtle)]
    text-[var(--color-text-primary)]
    hover:bg-[var(--color-accent-primary)]/10
    hover:border-[var(--color-border-interactive)]
    active:scale-[0.98]
    transition-all duration-[var(--duration-fast)]
  `,
  
  ghost: `
    relative
    text-[var(--color-accent-primary)]
    hover:text-[var(--color-accent-secondary)]
    hover:underline underline-offset-4
    transition-all duration-[var(--duration-fast)]
  `
};

const sizeStyles: Record<LinkButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm font-medium',
  md: 'px-5 py-2.5 text-base font-semibold',
  lg: 'px-6 py-3 text-lg font-semibold'
};

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'rounded-lg',
          'font-[family-name:var(--font-grotesk)]',
          'transition-all',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[var(--color-accent-primary)]',
          'focus-visible:ring-offset-2',
          'no-underline',
          
          // Variant styles
          variantStyles[variant],
          
          // Size styles
          sizeStyles[size],
          
          // Custom classes
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

LinkButton.displayName = 'LinkButton';

