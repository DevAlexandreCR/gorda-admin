import React from 'react';

const SOLID = {
  primary: '#cb0c9f', secondary: '#8392ab', info: '#17c1e8', success: '#82d616',
  warning: '#fbcf33', danger: '#ea0606', dark: '#344767', light: '#e9ecef',
};

/**
 * Gorda badge — small uppercase pill.
 * Solid variant: fixed brand colors.
 * Soft variant: reads --badge-{color}-bg/fg CSS vars → auto dark-mode aware.
 */
export function Badge({ color = 'primary', variant = 'soft', rounded = false, children, style = {} }) {
  const isSolid = variant === 'solid';
  const isLight = color === 'light' || color === 'warning';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.65rem', fontWeight: 700, lineHeight: 1,
      textTransform: 'uppercase', letterSpacing: '0.02rem',
      padding: '0.4em 0.65em',
      borderRadius: rounded ? '50rem' : '0.45rem',
      background: isSolid ? (SOLID[color] || SOLID.primary) : `var(--badge-${color}-bg, #eef1f6)`,
      color: isSolid
        ? (isLight ? '#344767' : '#fff')
        : `var(--badge-${color}-fg, #5b6b8c)`,
      ...style,
    }}>
      {children}
    </span>
  );
}
