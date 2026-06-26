import React from 'react';

const GRAD = {
  primary: 'linear-gradient(310deg, #7928ca, #ff0080)',
  info: 'linear-gradient(310deg, #2152ff, #21d4fd)',
  success: 'linear-gradient(310deg, #17ad37, #98ec2d)',
  warning: 'linear-gradient(310deg, #f53939, #fbcf33)',
  danger: 'linear-gradient(310deg, #d60808, #ff6690)',
  dark: 'linear-gradient(310deg, #141727, #3a416f)',
};

/** Gorda stat card — KPI tile with label, value, delta and a gradient icon chip. Respects dark theme. */
export function StatCard({ label, value, icon, color = 'dark', delta, deltaUp = true, style = {} }) {
  return (
    <div style={{
      background: 'var(--surface-card)',
      borderRadius: '1rem',
      boxShadow: 'var(--shadow-card)',
      fontFamily: "'Open Sans', sans-serif",
      padding: '1rem 1.25rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
      ...style,
    }}>
      <div>
        <div style={{
          fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.02rem', color: 'var(--text-secondary)',
        }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-heading)', lineHeight: 1.1 }}>{value}</span>
          {delta != null && (
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: deltaUp ? '#82d616' : '#ea0606' }}>
              {deltaUp ? '+' : ''}{delta}
            </span>
          )}
        </div>
      </div>
      {icon && (
        <div style={{
          width: '3rem', height: '3rem', flex: 'none',
          borderRadius: '0.75rem', background: GRAD[color] || GRAD.dark,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '1.1rem',
          boxShadow: '0 4px 7px -1px rgba(0,0,0,0.11)',
        }}>
          <em className={icon} />
        </div>
      )}
    </div>
  );
}
