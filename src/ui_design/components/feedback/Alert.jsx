import React from 'react';

const GRAD = {
  primary: 'linear-gradient(310deg, #7928ca, #ff0080)',
  info: 'linear-gradient(310deg, #2152ff, #21d4fd)',
  success: 'linear-gradient(310deg, #17ad37, #98ec2d)',
  warning: 'linear-gradient(310deg, #f53939, #fbcf33)',
  danger: 'linear-gradient(310deg, #d60808, #ff6690)',
  dark: 'linear-gradient(310deg, #141727, #3a416f)',
};
const ICON = { info: 'fas fa-circle-info', success: 'fas fa-circle-check', warning: 'fas fa-triangle-exclamation', danger: 'fas fa-circle-exclamation', primary: 'fas fa-bell', dark: 'fas fa-circle-info' };

/** Gorda alert banner — gradient fill, optional dismiss, used for form errors & toasts-in-page. */
export function Alert({ color = 'info', title, children, icon, onClose, style = {} }) {
  return (
    <div role="alert" style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      fontFamily: "'Open Sans', sans-serif",
      background: GRAD[color] || GRAD.info, color: '#fff',
      borderRadius: '0.5rem', padding: '1rem 1.25rem',
      boxShadow: '0 4px 7px -1px rgba(0,0,0,0.11)', ...style,
    }}>
      <em className={icon || ICON[color]} style={{ marginTop: '0.15rem', fontSize: '1rem' }} />
      <div style={{ flex: 1 }}>
        {title && <strong style={{ display: 'block', fontWeight: 700 }}>{title}</strong>}
        {children && <span style={{ display: 'block', marginTop: title ? '0.2rem' : 0, fontSize: '0.875rem', opacity: 0.95 }}>{children}</span>}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 'none', color: '#fff', opacity: 0.85, cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>×</button>
      )}
    </div>
  );
}
