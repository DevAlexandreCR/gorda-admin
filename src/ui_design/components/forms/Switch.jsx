import React from 'react';

/** Gorda toggle switch — magenta when on, adapts to dark theme. */
export function Switch({ checked = false, onChange, label, disabled = false, id, style = {} }) {
  const switchId = id || `sw-${Math.random().toString(36).slice(2, 8)}`;
  const track = {
    position: 'relative',
    width: '2.5rem', height: '1.4rem',
    borderRadius: '50rem',
    background: checked ? '#cb0c9f' : 'var(--border-subtle)',
    border: '1px solid ' + (checked ? '#cb0c9f' : 'var(--border-color)'),
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.25s ease, border-color 0.25s ease',
    flex: 'none',
  };
  const knob = {
    position: 'absolute', top: '50%',
    left: checked ? 'calc(100% - 1.15rem)' : '0.15rem',
    transform: 'translateY(-50%)',
    width: '1rem', height: '1rem', borderRadius: '50%',
    background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'left 0.25s ease',
  };
  return (
    <label htmlFor={switchId} style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      fontFamily: "'Open Sans', sans-serif",
      ...style,
    }}>
      <span style={track} onClick={() => !disabled && onChange && onChange(!checked)}>
        <span style={knob} />
      </span>
      <input id={switchId} type="checkbox" checked={checked} onChange={() => {}} style={{ display: 'none' }} />
      {label && <span style={{ fontSize: '0.875rem', color: 'var(--text-body)' }}>{label}</span>}
    </label>
  );
}
