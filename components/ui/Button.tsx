import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Enterprise-grade Button Component
 * 
 * Variants:
 * - primary: Gradient background, high contrast
 * - secondary: Glass morphism with border
 * - ghost: Transparent with hover underline
 * 
 * All variants respect light/dark mode and include proper focus states
 */

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    relative overflow-hidden
    bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)]
    text-[var(--color-text-contrast)]
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

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm font-medium',
  md: 'px-5 py-2.5 text-base font-semibold',
  lg: 'px-6 py-3 text-lg font-semibold'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
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
          'disabled:opacity-50',
          'disabled:cursor-not-allowed',
          'disabled:pointer-events-none',
          
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
      </button>
    );
  }
);

Button.displayName = 'Button';

