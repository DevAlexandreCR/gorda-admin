import React from 'react';

const COLORS = {
  primary:   { solid: '#cb0c9f', grad: 'linear-gradient(310deg, #7928ca, #ff0080)', fg: '#fff' },
  secondary: { solid: '#8392ab', grad: 'linear-gradient(310deg, #627594, #a8b8d8)', fg: '#fff' },
  info:      { solid: '#17c1e8', grad: 'linear-gradient(310deg, #2152ff, #21d4fd)', fg: '#fff' },
  success:   { solid: '#82d616', grad: 'linear-gradient(310deg, #17ad37, #98ec2d)', fg: '#fff' },
  warning:   { solid: '#fbcf33', grad: 'linear-gradient(310deg, #f53939, #fbcf33)', fg: '#fff' },
  danger:    { solid: '#ea0606', grad: 'linear-gradient(310deg, #d60808, #ff6690)', fg: '#fff' },
  dark:      { solid: '#344767', grad: 'linear-gradient(310deg, #141727, #3a416f)', fg: '#fff' },
  light:     { solid: 'var(--light)', grad: 'linear-gradient(310deg, #ced4da, #ebeff4)', fg: 'var(--text-secondary)' },
};

const SIZES = {
  sm: { padding: '0.5rem 1.5rem',   fontSize: '0.65rem' },
  md: { padding: '0.625rem 1.5rem', fontSize: '0.75rem' },
  lg: { padding: '0.875rem 2.5rem', fontSize: '0.875rem' },
};

/**
 * Gorda primary button — Soft UI Dashboard style.
 * Uppercase label, gradient/solid/outline fills, lifts on hover.
 */
export function Button({
  color = 'primary', variant = 'gradient', size = 'md',
  rounded = false, fullWidth = false, icon, iconPosition = 'left',
  disabled = false, children, onClick, style = {}, ...rest
}) {
  const c = COLORS[color] || COLORS.primary;
  const s = SIZES[size] || SIZES.md;
  const [hover, setHover] = React.useState(false);

  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '0.4rem',
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '-0.025rem', lineHeight: 1.4,
    whiteSpace: 'nowrap',
    border: '1px solid transparent',
    borderRadius: rounded ? '50rem' : '0.5rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.65 : 1,
    width: fullWidth ? '100%' : 'auto',
    transition: 'all 0.15s ease-in',
    transform: hover && !disabled ? 'scale(1.02)' : 'scale(1)',
    boxShadow: '0 4px 7px -1px rgba(0,0,0,0.11), 0 2px 4px -1px rgba(0,0,0,0.07)',
    ...s,
  };

  let fill = {};
  if (variant === 'gradient') {
    fill = { background: c.grad, color: c.fg };
  } else if (variant === 'solid') {
    fill = { background: c.solid, color: c.fg };
  } else if (variant === 'outline') {
    fill = {
      background: hover && !disabled ? c.solid : 'transparent',
      color: hover && !disabled ? c.fg : c.solid,
      borderColor: c.solid,
      boxShadow: 'none',
    };
  }

  return (
    <button
      type="button" disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...fill, ...style }}
      {...rest}
    >
      {icon && iconPosition === 'left' && <em className={icon} />}
      {children}
      {icon && iconPosition === 'right' && <em className={icon} />}
    </button>
  );
}
