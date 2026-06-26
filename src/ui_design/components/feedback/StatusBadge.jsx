import React from 'react';

const MAP = {
  pending:     { color: 'warning', label: 'Pending' },
  in_progress: { color: 'info',    label: 'In progress' },
  terminated:  { color: 'success', label: 'Completed' },
  completed:   { color: 'success', label: 'Completed' },
  canceled:    { color: 'danger',  label: 'Canceled' },
};

/**
 * Service lifecycle badge — maps a service status to its Gorda color & label.
 * Reads --badge-{color}-bg/fg CSS vars → auto dark-mode aware.
 */
export function StatusBadge({ status = 'pending', label, style = {} }) {
  const cfg = MAP[status] || MAP.pending;
  const c = cfg.color;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.65rem', fontWeight: 700, lineHeight: 1,
      textTransform: 'uppercase', letterSpacing: '0.02rem',
      padding: '0.4em 0.7em', borderRadius: '0.45rem',
      background: `var(--badge-${c}-bg)`,
      color: `var(--badge-${c}-fg)`,
      ...style,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: `var(--badge-${c}-fg)` }} />
      {label || cfg.label}
    </span>
  );
}
