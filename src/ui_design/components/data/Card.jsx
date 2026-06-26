import React from 'react';

/** Gorda card — rounded surface with signature soft shadow. Respects dark theme via CSS vars. */
export function Card({ children, header, footer, padding = '1.5rem', style = {}, bodyStyle = {} }) {
  return (
    <div style={{
      background: 'var(--surface-card)',
      borderRadius: '1rem',
      boxShadow: 'var(--shadow-card)',
      fontFamily: "'Open Sans', sans-serif",
      overflow: 'hidden',
      ...style,
    }}>
      {header && (
        <div style={{ padding: `1.25rem ${padding} 0` }}>
          {typeof header === 'string'
            ? <h6 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)' }}>{header}</h6>
            : header}
        </div>
      )}
      <div style={{ padding, ...bodyStyle }}>{children}</div>
      {footer && <div style={{ padding: `0 ${padding} 1.25rem`, color: 'var(--text-body)' }}>{footer}</div>}
    </div>
  );
}
