import React from 'react';

/** Gorda select — Soft UI styled native dropdown. Respects dark theme. */
export function Select({ label, value, onChange, options = [], placeholder, disabled = false, id, style = {} }) {
  const [focus, setFocus] = React.useState(false);
  const selId = id || `sel-${Math.random().toString(36).slice(2, 8)}`;
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: "'Open Sans', sans-serif", ...style }}>
      {label && (
        <label htmlFor={selId} style={{
          fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-heading)',
          marginBottom: '0.5rem', marginLeft: '0.25rem',
        }}>{label}</label>
      )}
      <select
        id={selId} value={value} onChange={onChange} disabled={disabled}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          appearance: 'none', WebkitAppearance: 'none',
          backgroundColor: disabled ? 'var(--surface-disabled)' : 'var(--surface-input)',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238392ab' viewBox='0 0 16 16'%3E%3Cpath d='M3 6l5 5 5-5'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.85rem center',
          border: `1px solid ${focus ? '#e293d3' : 'var(--border-color)'}`,
          borderRadius: '0.5rem',
          padding: '0.5rem 2rem 0.5rem 0.75rem',
          fontFamily: 'inherit', fontSize: '0.875rem', color: 'var(--text-body)',
          boxShadow: focus ? '0 0 0 2px #e9aede' : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
        }}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
