import React from 'react';

const SIZES = { sm: 32, md: 42, lg: 58, xl: 74 };
const STATUS = { online: '#82d616', busy: '#fbcf33', offline: '#adb5bd', danger: '#ea0606' };

/** Gorda avatar — rounded image (or initials) with optional status dot. Respects dark theme. */
export function Avatar({ src, name = '', size = 'md', rounded = 'circle', status, style = {} }) {
  const px = SIZES[size] || size;
  const radius = rounded === 'circle' ? '50%' : rounded === 'lg' ? '0.75rem' : '0.5rem';
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{ position: 'relative', width: px, height: px, flex: 'none', ...style }}>
      {src ? (
        <img src={src} alt={name} style={{
          width: px, height: px, borderRadius: radius,
          objectFit: 'cover', boxShadow: '0 2px 9px -5px rgba(0,0,0,0.4)',
        }} />
      ) : (
        <div style={{
          width: px, height: px, borderRadius: radius,
          background: 'linear-gradient(310deg, #7928ca, #ff0080)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: px * 0.38,
        }}>{initials}</div>
      )}
      {status && (
        <span style={{
          position: 'absolute', bottom: 0, right: 0,
          width: px * 0.28, height: px * 0.28, borderRadius: '50%',
          background: STATUS[status] || STATUS.offline,
          border: '2px solid var(--surface-card)',
        }} />
      )}
    </div>
  );
}
