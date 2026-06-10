/**
 * Design System Tokens
 * Centralized configuration for colors, spacing, typography, and transitions
 */

export const designSystem = {
  colors: {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    neoPink: 'var(--color-neo-pink)',
    bg: 'var(--color-bg)',
    fg: 'var(--color-fg)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    display: 'var(--font-display)',
    body: 'var(--font-body)',
    script: 'var(--font-script)',
  },
  transitions: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
};

export type DesignSystem = typeof designSystem;
