import React from 'react';

/**
 * Gorda text input — Soft UI field with label and magenta focus glow. Respects dark theme.
 */
export function Input({
  label, value, onChange, placeholder, type = 'text',
  icon, error, disabled = false, id, style = {}, ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || `inp-${Math.random().toString(36).slice(2, 8)}`;

  const wrap = { display: 'flex', flexDirection: 'column', fontFamily: "'Open Sans', sans-serif" };
  const lab = {
    fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-heading)',
    marginBottom: '0.5rem', marginLeft: '0.25rem',
  };
  const field = {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: disabled ? 'var(--surface-disabled)' : 'var(--surface-input)',
    border: `1px solid ${error ? '#ea0606' : focus ? '#e293d3' : 'var(--border-color)'}`,
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    boxShadow: focus ? '0 0 0 2px #e9aede' : 'none',
    transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
  };
  const inp = {
    border: 'none', outline: 'none', background: 'transparent',
    fontFamily: 'inherit', fontSize: '0.875rem', color: 'var(--text-body)',
    width: '100%', padding: 0,
  };

  return (
    <div style={{ ...wrap, ...style }}>
      {label && <label htmlFor={inputId} style={lab}>{label}</label>}
      <div style={field}>
        {icon && <em className={icon} style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }} />}
        <input
          id={inputId} type={type} value={value} onChange={onChange}
          placeholder={placeholder} disabled={disabled}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={inp} {...rest}
        />
      </div>
      {error && <span style={{ color: '#ea0606', fontSize: '0.75rem', marginTop: '0.35rem', marginLeft: '0.25rem' }}>{error}</span>}
    </div>
  );
}
