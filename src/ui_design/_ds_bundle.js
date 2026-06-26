/* @ds-bundle: {"format":3,"namespace":"GordaDesignSystem_019e24","components":[{"name":"Avatar","sourcePath":"components/data/Avatar.jsx"},{"name":"Card","sourcePath":"components/data/Card.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"StatusBadge","sourcePath":"components/feedback/StatusBadge.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"}],"sourceHashes":{"components/data/Avatar.jsx":"7d141312e7fe","components/data/Card.jsx":"682a006e2bb8","components/data/StatCard.jsx":"8be0db4910c5","components/feedback/Alert.jsx":"b9a352b46fbf","components/feedback/Badge.jsx":"d00ee62ddf7e","components/feedback/StatusBadge.jsx":"e8bf0ec84800","components/forms/Button.jsx":"d1eb2af292ed","components/forms/Input.jsx":"f48e4b9f2dfb","components/forms/Select.jsx":"27f6a0639604","components/forms/Switch.jsx":"0a04a2742b65","ui_kits/admin/DashboardView.jsx":"af3b2f158f53","ui_kits/admin/DriversView.jsx":"773cb5eda2a2","ui_kits/admin/EditDriverView.jsx":"651449ad619c","ui_kits/admin/EditMessageModal.jsx":"3ee9cb99b21a","ui_kits/admin/LoadingModal.jsx":"6d1e8388a8fd","ui_kits/admin/LoginView.jsx":"5647019ec566","ui_kits/admin/ServicesView.jsx":"9ce5e8e625a3","ui_kits/admin/SettingsView.jsx":"42d8b2af414b","ui_kits/admin/Sidebar.jsx":"a497fdbc14c5","ui_kits/admin/TopNav.jsx":"b16ad3d73367","ui_kits/admin/VehicleDetailView.jsx":"09d6e4651e7a","ui_kits/admin/VehiclesView.jsx":"3ec37cc12e5d","ui_kits/admin/WhatsAppView.jsx":"857185679c3a","ui_kits/admin/data.js":"c649a38fa95f"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GordaDesignSystem_019e24 = window.GordaDesignSystem_019e24 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data/Avatar.jsx
try { (() => {
const SIZES = {
  sm: 32,
  md: 42,
  lg: 58,
  xl: 74
};
const STATUS = {
  online: '#82d616',
  busy: '#fbcf33',
  offline: '#adb5bd',
  danger: '#ea0606'
};

/** Gorda avatar — rounded image (or initials) with optional status dot. Respects dark theme. */
function Avatar({
  src,
  name = '',
  size = 'md',
  rounded = 'circle',
  status,
  style = {}
}) {
  const px = SIZES[size] || size;
  const radius = rounded === 'circle' ? '50%' : rounded === 'lg' ? '0.75rem' : '0.5rem';
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: px,
      height: px,
      flex: 'none',
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: px,
      height: px,
      borderRadius: radius,
      objectFit: 'cover',
      boxShadow: '0 2px 9px -5px rgba(0,0,0,0.4)'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: px,
      height: px,
      borderRadius: radius,
      background: 'linear-gradient(310deg, #7928ca, #ff0080)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Open Sans', sans-serif",
      fontWeight: 700,
      fontSize: px * 0.38
    }
  }, initials), status && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: px * 0.28,
      height: px * 0.28,
      borderRadius: '50%',
      background: STATUS[status] || STATUS.offline,
      border: '2px solid var(--surface-card)'
    }
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data/Card.jsx
try { (() => {
/** Gorda card — rounded surface with signature soft shadow. Respects dark theme via CSS vars. */
function Card({
  children,
  header,
  footer,
  padding = '1.5rem',
  style = {},
  bodyStyle = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: '1rem',
      boxShadow: 'var(--shadow-card)',
      fontFamily: "'Open Sans', sans-serif",
      overflow: 'hidden',
      ...style
    }
  }, header && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `1.25rem ${padding} 0`
    }
  }, typeof header === 'string' ? /*#__PURE__*/React.createElement("h6", {
    style: {
      margin: 0,
      fontSize: '1rem',
      fontWeight: 700,
      color: 'var(--text-heading)'
    }
  }, header) : header), /*#__PURE__*/React.createElement("div", {
    style: {
      padding,
      ...bodyStyle
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `0 ${padding} 1.25rem`,
      color: 'var(--text-body)'
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Card.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
const GRAD = {
  primary: 'linear-gradient(310deg, #7928ca, #ff0080)',
  info: 'linear-gradient(310deg, #2152ff, #21d4fd)',
  success: 'linear-gradient(310deg, #17ad37, #98ec2d)',
  warning: 'linear-gradient(310deg, #f53939, #fbcf33)',
  danger: 'linear-gradient(310deg, #d60808, #ff6690)',
  dark: 'linear-gradient(310deg, #141727, #3a416f)'
};

/** Gorda stat card — KPI tile with label, value, delta and a gradient icon chip. Respects dark theme. */
function StatCard({
  label,
  value,
  icon,
  color = 'dark',
  delta,
  deltaUp = true,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: '1rem',
      boxShadow: 'var(--shadow-card)',
      fontFamily: "'Open Sans', sans-serif",
      padding: '1rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.02rem',
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '0.5rem',
      marginTop: '0.25rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: 'var(--text-heading)',
      lineHeight: 1.1
    }
  }, value), delta != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      fontWeight: 700,
      color: deltaUp ? '#82d616' : '#ea0606'
    }
  }, deltaUp ? '+' : '', delta))), icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: '3rem',
      height: '3rem',
      flex: 'none',
      borderRadius: '0.75rem',
      background: GRAD[color] || GRAD.dark,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '1.1rem',
      boxShadow: '0 4px 7px -1px rgba(0,0,0,0.11)'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: icon
  })));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
const GRAD = {
  primary: 'linear-gradient(310deg, #7928ca, #ff0080)',
  info: 'linear-gradient(310deg, #2152ff, #21d4fd)',
  success: 'linear-gradient(310deg, #17ad37, #98ec2d)',
  warning: 'linear-gradient(310deg, #f53939, #fbcf33)',
  danger: 'linear-gradient(310deg, #d60808, #ff6690)',
  dark: 'linear-gradient(310deg, #141727, #3a416f)'
};
const ICON = {
  info: 'fas fa-circle-info',
  success: 'fas fa-circle-check',
  warning: 'fas fa-triangle-exclamation',
  danger: 'fas fa-circle-exclamation',
  primary: 'fas fa-bell',
  dark: 'fas fa-circle-info'
};

/** Gorda alert banner — gradient fill, optional dismiss, used for form errors & toasts-in-page. */
function Alert({
  color = 'info',
  title,
  children,
  icon,
  onClose,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      fontFamily: "'Open Sans', sans-serif",
      background: GRAD[color] || GRAD.info,
      color: '#fff',
      borderRadius: '0.5rem',
      padding: '1rem 1.25rem',
      boxShadow: '0 4px 7px -1px rgba(0,0,0,0.11)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: icon || ICON[color],
    style: {
      marginTop: '0.15rem',
      fontSize: '1rem'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("strong", {
    style: {
      display: 'block',
      fontWeight: 700
    }
  }, title), children && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: title ? '0.2rem' : 0,
      fontSize: '0.875rem',
      opacity: 0.95
    }
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      background: 'transparent',
      border: 'none',
      color: '#fff',
      opacity: 0.85,
      cursor: 'pointer',
      fontSize: '1rem',
      lineHeight: 1
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
const SOLID = {
  primary: '#cb0c9f',
  secondary: '#8392ab',
  info: '#17c1e8',
  success: '#82d616',
  warning: '#fbcf33',
  danger: '#ea0606',
  dark: '#344767',
  light: '#e9ecef'
};

/**
 * Gorda badge — small uppercase pill.
 * Solid variant: fixed brand colors.
 * Soft variant: reads --badge-{color}-bg/fg CSS vars → auto dark-mode aware.
 */
function Badge({
  color = 'primary',
  variant = 'soft',
  rounded = false,
  children,
  style = {}
}) {
  const isSolid = variant === 'solid';
  const isLight = color === 'light' || color === 'warning';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.65rem',
      fontWeight: 700,
      lineHeight: 1,
      textTransform: 'uppercase',
      letterSpacing: '0.02rem',
      padding: '0.4em 0.65em',
      borderRadius: rounded ? '50rem' : '0.45rem',
      background: isSolid ? SOLID[color] || SOLID.primary : `var(--badge-${color}-bg, #eef1f6)`,
      color: isSolid ? isLight ? '#344767' : '#fff' : `var(--badge-${color}-fg, #5b6b8c)`,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusBadge.jsx
try { (() => {
const MAP = {
  pending: {
    color: 'warning',
    label: 'Pending'
  },
  in_progress: {
    color: 'info',
    label: 'In progress'
  },
  terminated: {
    color: 'success',
    label: 'Completed'
  },
  completed: {
    color: 'success',
    label: 'Completed'
  },
  canceled: {
    color: 'danger',
    label: 'Canceled'
  }
};

/**
 * Service lifecycle badge — maps a service status to its Gorda color & label.
 * Reads --badge-{color}-bg/fg CSS vars → auto dark-mode aware.
 */
function StatusBadge({
  status = 'pending',
  label,
  style = {}
}) {
  const cfg = MAP[status] || MAP.pending;
  const c = cfg.color;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.65rem',
      fontWeight: 700,
      lineHeight: 1,
      textTransform: 'uppercase',
      letterSpacing: '0.02rem',
      padding: '0.4em 0.7em',
      borderRadius: '0.45rem',
      background: `var(--badge-${c}-bg)`,
      color: `var(--badge-${c}-fg)`,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: `var(--badge-${c}-fg)`
    }
  }), label || cfg.label);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const COLORS = {
  primary: {
    solid: '#cb0c9f',
    grad: 'linear-gradient(310deg, #7928ca, #ff0080)',
    fg: '#fff'
  },
  secondary: {
    solid: '#8392ab',
    grad: 'linear-gradient(310deg, #627594, #a8b8d8)',
    fg: '#fff'
  },
  info: {
    solid: '#17c1e8',
    grad: 'linear-gradient(310deg, #2152ff, #21d4fd)',
    fg: '#fff'
  },
  success: {
    solid: '#82d616',
    grad: 'linear-gradient(310deg, #17ad37, #98ec2d)',
    fg: '#fff'
  },
  warning: {
    solid: '#fbcf33',
    grad: 'linear-gradient(310deg, #f53939, #fbcf33)',
    fg: '#fff'
  },
  danger: {
    solid: '#ea0606',
    grad: 'linear-gradient(310deg, #d60808, #ff6690)',
    fg: '#fff'
  },
  dark: {
    solid: '#344767',
    grad: 'linear-gradient(310deg, #141727, #3a416f)',
    fg: '#fff'
  },
  light: {
    solid: 'var(--light)',
    grad: 'linear-gradient(310deg, #ced4da, #ebeff4)',
    fg: 'var(--text-secondary)'
  }
};
const SIZES = {
  sm: {
    padding: '0.5rem 1.5rem',
    fontSize: '0.65rem'
  },
  md: {
    padding: '0.625rem 1.5rem',
    fontSize: '0.75rem'
  },
  lg: {
    padding: '0.875rem 2.5rem',
    fontSize: '0.875rem'
  }
};

/**
 * Gorda primary button — Soft UI Dashboard style.
 * Uppercase label, gradient/solid/outline fills, lifts on hover.
 */
function Button({
  color = 'primary',
  variant = 'gradient',
  size = 'md',
  rounded = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled = false,
  children,
  onClick,
  style = {},
  ...rest
}) {
  const c = COLORS[color] || COLORS.primary;
  const s = SIZES[size] || SIZES.md;
  const [hover, setHover] = React.useState(false);
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    fontFamily: "'Open Sans', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '-0.025rem',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
    border: '1px solid transparent',
    borderRadius: rounded ? '50rem' : '0.5rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.65 : 1,
    width: fullWidth ? '100%' : 'auto',
    transition: 'all 0.15s ease-in',
    transform: hover && !disabled ? 'scale(1.02)' : 'scale(1)',
    boxShadow: '0 4px 7px -1px rgba(0,0,0,0.11), 0 2px 4px -1px rgba(0,0,0,0.07)',
    ...s
  };
  let fill = {};
  if (variant === 'gradient') {
    fill = {
      background: c.grad,
      color: c.fg
    };
  } else if (variant === 'solid') {
    fill = {
      background: c.solid,
      color: c.fg
    };
  } else if (variant === 'outline') {
    fill = {
      background: hover && !disabled ? c.solid : 'transparent',
      color: hover && !disabled ? c.fg : c.solid,
      borderColor: c.solid,
      boxShadow: 'none'
    };
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...fill,
      ...style
    }
  }, rest), icon && iconPosition === 'left' && /*#__PURE__*/React.createElement("em", {
    className: icon
  }), children, icon && iconPosition === 'right' && /*#__PURE__*/React.createElement("em", {
    className: icon
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Gorda text input — Soft UI field with label and magenta focus glow. Respects dark theme.
 */
function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
  error,
  disabled = false,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || `inp-${Math.random().toString(36).slice(2, 8)}`;
  const wrap = {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Open Sans', sans-serif"
  };
  const lab = {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '0.5rem',
    marginLeft: '0.25rem'
  };
  const field = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: disabled ? 'var(--surface-disabled)' : 'var(--surface-input)',
    border: `1px solid ${error ? '#ea0606' : focus ? '#e293d3' : 'var(--border-color)'}`,
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    boxShadow: focus ? '0 0 0 2px #e9aede' : 'none',
    transition: 'box-shadow 0.15s ease, border-color 0.15s ease'
  };
  const inp = {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    color: 'var(--text-body)',
    width: '100%',
    padding: 0
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: lab
  }, label), /*#__PURE__*/React.createElement("div", {
    style: field
  }, icon && /*#__PURE__*/React.createElement("em", {
    className: icon,
    style: {
      color: 'var(--text-secondary)',
      fontSize: '0.85rem'
    }
  }), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: inp
  }, rest))), error && /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#ea0606',
      fontSize: '0.75rem',
      marginTop: '0.35rem',
      marginLeft: '0.25rem'
    }
  }, error));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
/** Gorda select — Soft UI styled native dropdown. Respects dark theme. */
function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  id,
  style = {}
}) {
  const [focus, setFocus] = React.useState(false);
  const selId = id || `sel-${Math.random().toString(36).slice(2, 8)}`;
  const opts = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Open Sans', sans-serif",
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      fontSize: '0.75rem',
      fontWeight: 700,
      color: 'var(--text-heading)',
      marginBottom: '0.5rem',
      marginLeft: '0.25rem'
    }
  }, label), /*#__PURE__*/React.createElement("select", {
    id: selId,
    value: value,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      backgroundColor: disabled ? 'var(--surface-disabled)' : 'var(--surface-input)',
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238392ab' viewBox='0 0 16 16'%3E%3Cpath d='M3 6l5 5 5-5'/%3E%3C/svg%3E\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 0.85rem center',
      border: `1px solid ${focus ? '#e293d3' : 'var(--border-color)'}`,
      borderRadius: '0.5rem',
      padding: '0.5rem 2rem 0.5rem 0.75rem',
      fontFamily: 'inherit',
      fontSize: '0.875rem',
      color: 'var(--text-body)',
      boxShadow: focus ? '0 0 0 2px #e9aede' : 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'box-shadow 0.15s ease, border-color 0.15s ease'
    }
  }, placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), opts.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/** Gorda toggle switch — magenta when on, adapts to dark theme. */
function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  id,
  style = {}
}) {
  const switchId = id || `sw-${Math.random().toString(36).slice(2, 8)}`;
  const track = {
    position: 'relative',
    width: '2.5rem',
    height: '1.4rem',
    borderRadius: '50rem',
    background: checked ? '#cb0c9f' : 'var(--border-subtle)',
    border: '1px solid ' + (checked ? '#cb0c9f' : 'var(--border-color)'),
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.25s ease, border-color 0.25s ease',
    flex: 'none'
  };
  const knob = {
    position: 'absolute',
    top: '50%',
    left: checked ? 'calc(100% - 1.15rem)' : '0.15rem',
    transform: 'translateY(-50%)',
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'left 0.25s ease'
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: switchId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.6rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      fontFamily: "'Open Sans', sans-serif",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: track,
    onClick: () => !disabled && onChange && onChange(!checked)
  }, /*#__PURE__*/React.createElement("span", {
    style: knob
  })), /*#__PURE__*/React.createElement("input", {
    id: switchId,
    type: "checkbox",
    checked: checked,
    onChange: () => {},
    style: {
      display: 'none'
    }
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.875rem',
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/DashboardView.jsx
try { (() => {
// Dashboard view — KPI stat cards + a couple of summary panels.
function DashboardView() {
  const {
    StatCard,
    Card,
    StatusBadge,
    Avatar
  } = window.GordaDesignSystem_019e24;
  const data = window.GordaData;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1rem',
      marginBottom: '1rem'
    }
  }, data.stats.map(s => /*#__PURE__*/React.createElement(StatCard, {
    key: s.label,
    label: s.label,
    value: s.value,
    icon: s.icon,
    color: s.color,
    delta: s.delta,
    deltaUp: s.up
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    header: "Latest services"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem'
    }
  }, data.history.slice(0, 4).map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: '0.6rem',
      background: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#cb0c9f'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-route"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      fontWeight: 700,
      color: '#344767',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, s.start, " \u2192 ", s.end), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#adb5bd'
    }
  }, s.name, " \xB7 ", s.driverName)), /*#__PURE__*/React.createElement(StatusBadge, {
    status: s.status
  }))))), /*#__PURE__*/React.createElement(Card, {
    header: "Drivers online"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }
  }, data.drivers.filter(d => d.status !== 'offline').map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: d.name,
    size: "sm",
    status: d.status
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      fontWeight: 700,
      color: '#344767'
    }
  }, d.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#adb5bd'
    }
  }, d.brand, " ", d.model, " \xB7 ", d.plate)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.7rem',
      fontWeight: 700,
      color: d.status === 'online' ? '#82d616' : '#fbcf33',
      textTransform: 'capitalize'
    }
  }, d.status)))))));
}
window.DashboardView = DashboardView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/DashboardView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/DriversView.jsx
try { (() => {
// Drivers view — searchable roster table with avatars, status badges & row actions.
function DriversView({
  onEditDriver
}) {
  const {
    Card,
    Avatar,
    Badge,
    Button,
    Switch
  } = window.GordaDesignSystem_019e24;
  const data = window.GordaData;
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [enabledMap, setEnabledMap] = React.useState(Object.fromEntries(data.drivers.map(d => [d.id, d.enabled])));
  const rows = data.drivers.filter(d => {
    const matchQ = (d.name + d.email + d.plate).toLowerCase().includes(query.toLowerCase());
    const matchF = filter === 'all' || (filter === 'enabled' ? enabledMap[d.id] : !enabledMap[d.id]);
    return matchQ && matchF;
  });
  const th = {
    textAlign: 'left',
    textTransform: 'uppercase',
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.02rem',
    color: '#8392ab',
    padding: '0.6rem 0.75rem',
    borderBottom: '1px solid #e9ecef'
  };
  const td = {
    padding: '0.6rem 0.75rem',
    fontSize: '0.8rem',
    color: '#67748e',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'middle'
  };
  const filters = [{
    id: 'all',
    label: 'All'
  }, {
    id: 'enabled',
    label: 'Enabled'
  }, {
    id: 'disabled',
    label: 'Disabled'
  }];
  return /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 1rem 0.75rem',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h6", {
    style: {
      margin: 0,
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#344767'
    }
  }, "Drivers \xB7 ", data.drivers.length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: '#fff',
      border: '1px solid #d2d6da',
      borderRadius: '0.5rem',
      padding: '0.4rem 0.7rem',
      width: 220
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-magnifying-glass",
    style: {
      color: '#8392ab',
      fontSize: '0.78rem'
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "Search drivers...",
    style: {
      border: 'none',
      outline: 'none',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.8rem',
      width: '100%',
      color: '#495057'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, filters.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    onClick: () => setFilter(f.id),
    style: {
      padding: '0.35rem 0.8rem',
      borderRadius: '50rem',
      border: '1px solid',
      cursor: 'pointer',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.7rem',
      fontWeight: 700,
      borderColor: filter === f.id ? '#cb0c9f' : '#e9ecef',
      background: filter === f.id ? '#fde6f7' : '#fff',
      color: filter === f.id ? '#a30c80' : '#8392ab'
    }
  }, f.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    color: "warning",
    variant: "outline",
    size: "sm",
    icon: "fas fa-paper-plane"
  }, "Send to all")), /*#__PURE__*/React.createElement(Button, {
    color: "primary",
    size: "sm",
    rounded: true,
    icon: "fas fa-plus"
  })), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Name"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Phone"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Vehicle"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Plate"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Last connection"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Balance"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "Edit"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(d => /*#__PURE__*/React.createElement("tr", {
    key: d.id
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: d.name,
    size: "sm",
    status: d.status
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      fontWeight: 700,
      color: '#344767'
    }
  }, d.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.7rem',
      color: '#adb5bd'
    }
  }, d.email)))), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontWeight: 600,
      whiteSpace: 'nowrap'
    }
  }, d.phone), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      fontWeight: 700,
      color: '#344767'
    }
  }, d.brand), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.7rem',
      color: '#adb5bd'
    }
  }, d.model)), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#82d616',
      marginRight: 4
    }
  }, "\u25CF"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      color: '#cb0c9f',
      fontWeight: 600
    }
  }, d.plate)), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(Badge, {
    color: enabledMap[d.id] ? 'success' : 'danger',
    variant: "solid"
  }, enabledMap[d.id] ? 'Enabled' : 'Disabled')), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      whiteSpace: 'nowrap'
    }
  }, d.last), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontWeight: 700,
      color: d.balance.includes('−') ? '#ea0606' : '#344767'
    }
  }, d.balance), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: enabledMap[d.id],
    onChange: v => setEnabledMap(m => ({
      ...m,
      [d.id]: v
    }))
  }), /*#__PURE__*/React.createElement("em", {
    className: "fas fa-pencil",
    style: {
      color: '#cb0c9f',
      cursor: 'pointer'
    },
    title: "Edit",
    onClick: () => onEditDriver && onEditDriver(d)
  }), /*#__PURE__*/React.createElement("em", {
    className: "fas fa-paper-plane",
    style: {
      color: '#8392ab',
      cursor: 'pointer'
    },
    title: "Message"
  }))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.85rem 1rem',
      fontSize: '0.75rem',
      color: '#8392ab'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Showing 1\u2013", rows.length, " of ", data.drivers.length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: pagBtn(false)
  }, "\u2039"), /*#__PURE__*/React.createElement("button", {
    style: pagBtn(true)
  }, "1"), /*#__PURE__*/React.createElement("button", {
    style: pagBtn(false)
  }, "2"), /*#__PURE__*/React.createElement("button", {
    style: pagBtn(false)
  }, "\u203A"))));
}
function pagBtn(active) {
  return {
    width: 30,
    height: 30,
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '0.75rem',
    fontWeight: 700,
    background: active ? 'linear-gradient(310deg, #7928ca, #ff0080)' : '#fff',
    color: active ? '#fff' : '#8392ab',
    boxShadow: active ? '0 4px 7px -1px rgba(0,0,0,0.11)' : '0 1px 3px rgba(0,0,0,0.08)'
  };
}
window.DriversView = DriversView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/DriversView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/EditDriverView.jsx
try { (() => {
// Edit Driver view — Gorda DS
// Layout: full-width profile header + two balanced columns + tabbed history + modals
function EditDriverView({
  driver,
  onBack
}) {
  const {
    Card,
    Avatar,
    Badge,
    Button,
    Input,
    Select,
    Switch
  } = window.GordaDesignSystem_019e24;

  // ── form state ───────────────────────────────────────────────────────────
  const [form, setForm] = React.useState({
    name: driver.name || '',
    email: driver.email || '',
    password: 'secreto123',
    phone: driver.phone || '',
    phone2: '',
    docType: 'CC',
    doc: '1097391384',
    enabled: driver.enabled !== undefined ? driver.enabled : true,
    payMode: 'Mensualidad'
  });
  const [emailLocked, setEmailLocked] = React.useState(true);
  const [passLocked, setPassLocked] = React.useState(true);
  const [vehicles, setVehicles] = React.useState([{
    id: 1,
    plate: 'AAA123',
    model: 'Vehículo Xxx',
    selectable: true,
    enabled: true
  }, {
    id: 2,
    plate: 'FPK979',
    model: 'Mazda Cx-3',
    selectable: false,
    enabled: false
  }]);
  const [device, setDevice] = React.useState('Google Pixel 7');
  const [historyTab, setHistoryTab] = React.useState('saldo');

  // ── modal state ──────────────────────────────────────────────────────────
  const [modal, setModal] = React.useState(null); // 'saldo' | 'mensualidad' | 'vehiculo'
  const closeModal = () => setModal(null);

  // Administrar saldo form
  const [saldoForm, setSaldoForm] = React.useState({
    tipo: 'agregar',
    monto: '',
    nota: ''
  });
  // Registrar mensualidad form
  const [mensForm, setMensForm] = React.useState({
    periodo: '2026-07',
    monto: '100000',
    nota: ''
  });
  // Agregar vehículo form
  // ── colors & mock vehicle DB ─────────────────────────────────────────────
  const COLORS = [{
    name: 'Negro',
    hex: '#000000'
  }, {
    name: 'Azul',
    hex: '#0000FF'
  }, {
    name: 'Gris',
    hex: '#808080'
  }, {
    name: 'Verde',
    hex: '#008000'
  }, {
    name: 'Morado',
    hex: '#800080'
  }, {
    name: 'Rojo',
    hex: '#FF0000'
  }, {
    name: 'Blanco',
    hex: '#FFFFFF'
  }, {
    name: 'Rosado',
    hex: '#FFC0CB'
  }, {
    name: 'Naranja',
    hex: '#FFA500'
  }, {
    name: 'Dorado',
    hex: '#FFD700'
  }, {
    name: 'Amarillo',
    hex: '#FFFF00'
  }, {
    name: 'Café',
    hex: '#A52A2A'
  }, {
    name: 'Plateado',
    hex: '#C0C0C0'
  }, {
    name: 'Beige',
    hex: '#F5F5DC'
  }];
  const VEHICLE_DB = [{
    id: 'vaaa',
    plate: 'AAA123',
    brand: 'Vehiculo',
    model: 'Xxx',
    year: '2026'
  }, {
    id: 'vfpk',
    plate: 'FPK979',
    brand: 'Mazda',
    model: 'Cx-3',
    year: '2024'
  }, {
    id: 'vkxt',
    plate: 'KXT482',
    brand: 'Chevrolet',
    model: 'Spark GT',
    year: '2022'
  }, {
    id: 'vhjs',
    plate: 'HJS119',
    brand: 'Renault',
    model: 'Logan',
    year: '2021'
  }, {
    id: 'vfbd',
    plate: 'FBD903',
    brand: 'Kia',
    model: 'Picanto',
    year: '2023'
  }, {
    id: 'vlmn',
    plate: 'LMN558',
    brand: 'Mazda',
    model: '2',
    year: '2023'
  }];
  const [vehForm, setVehForm] = React.useState({
    placa: '',
    marca: '',
    modelo: '',
    color: '#000000',
    soat: '',
    tec: '',
    fileError: ''
  });
  // Lookup
  const [showLookup, setShowLookup] = React.useState(false);
  const [lookupInput, setLookupInput] = React.useState('');
  const [lookupFocused, setLookupFocused] = React.useState(false);
  const [lookupActive, setLookupActive] = React.useState(-1);
  const lookupDropdownOpen = lookupFocused && lookupInput.length >= 3;
  const lookupSuggestions = lookupInput.length >= 3 ? VEHICLE_DB.filter(v => v.plate.toLowerCase().includes(lookupInput.toLowerCase())) : [];
  const set = k => e => setForm(f => ({
    ...f,
    [k]: e.target.value
  }));

  // ── mock history data ─────────────────────────────────────────────────────
  const [histSaldo, setHistSaldo] = React.useState([{
    date: '15/06/26 03:01',
    amount: '-2 000',
    balance: '8 000',
    by: 'Super Admin',
    note: 'ajuste'
  }, {
    date: '15/06/26 03:00',
    amount: '+10 000',
    balance: '10 000',
    by: 'Super Admin',
    note: ''
  }, {
    date: '14/06/26 18:40',
    amount: '-500',
    balance: '0',
    by: 'Super Admin',
    note: 'descuento'
  }]);
  const [histMens, setHistMens] = React.useState([{
    period: '2026-06',
    amount: '100 000',
    by: 'Super Admin',
    date: '18/06/26 22:13',
    note: ''
  }, {
    period: '2026-05',
    amount: '100 000',
    by: 'Super Admin',
    date: '01/05/26 09:00',
    note: ''
  }]);
  const [saldoActual, setSaldoActual] = React.useState(8000);

  // ── tokens ────────────────────────────────────────────────────────────────
  const divider = {
    border: 0,
    borderTop: '1px solid #e9ecef',
    margin: '0.5rem 0'
  };
  const fLabel = {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#344767',
    marginBottom: '0.5rem',
    marginLeft: '0.25rem'
  };
  const lockBtn = {
    marginTop: '0.3rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#cb0c9f',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    paddingLeft: '0.25rem'
  };
  const th = {
    textAlign: 'left',
    textTransform: 'uppercase',
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: '#8392ab',
    padding: '0.6rem 1.25rem',
    background: 'rgba(255,255,255,0.04)'
  };
  const td = {
    padding: '0.75rem 1.25rem',
    fontSize: '0.8rem',
    color: '#67748e',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'middle'
  };

  // ── tab pill ──────────────────────────────────────────────────────────────
  function TabPill({
    id,
    label,
    icon
  }) {
    const active = historyTab === id;
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => setHistoryTab(id),
      style: {
        padding: '0.35rem 0.9rem',
        borderRadius: '50rem',
        border: '1px solid',
        cursor: 'pointer',
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '0.72rem',
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        borderColor: active ? '#cb0c9f' : '#e9ecef',
        background: active ? '#fde6f7' : '#fff',
        color: active ? '#a30c80' : '#8392ab',
        transition: 'all 0.15s'
      }
    }, /*#__PURE__*/React.createElement("em", {
      className: icon
    }), label);
  }

  // ── shared Modal wrapper ──────────────────────────────────────────────────
  function Modal({
    title,
    icon,
    onClose,
    width = 440,
    children,
    footer
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(52,71,103,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)'
      },
      onClick: e => e.target === e.currentTarget && onClose()
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fff',
        borderRadius: '1rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        width,
        maxWidth: 'calc(100vw - 2rem)',
        fontFamily: "'Open Sans', sans-serif",
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.1rem 1.5rem',
        borderBottom: '1px solid #e9ecef'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 32,
        height: 32,
        borderRadius: '0.5rem',
        flex: 'none',
        background: 'linear-gradient(310deg,#7928ca,#ff0080)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '0.78rem'
      }
    }, /*#__PURE__*/React.createElement("em", {
      className: icon
    })), /*#__PURE__*/React.createElement("h6", {
      style: {
        margin: 0,
        fontSize: '0.95rem',
        fontWeight: 700,
        color: '#344767'
      }
    }, title)), /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#8392ab',
        fontSize: '1rem',
        lineHeight: 1,
        width: 28,
        height: 28,
        borderRadius: '0.4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("em", {
      className: "fas fa-xmark"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }
    }, children), footer && /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 1.5rem 1.25rem',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.6rem'
      }
    }, footer)));
  }

  // ── Modal: Administrar saldo ──────────────────────────────────────────────
  function ModalSaldo() {
    const isSuma = saldoForm.tipo === 'agregar';
    const preview = saldoForm.monto ? isSuma ? saldoActual + parseInt(saldoForm.monto || 0) : saldoActual - parseInt(saldoForm.monto || 0) : null;
    return /*#__PURE__*/React.createElement(Modal, {
      title: "Administrar saldo",
      icon: "fas fa-coins",
      onClose: closeModal,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        color: "secondary",
        variant: "outline",
        size: "sm",
        onClick: closeModal
      }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
        color: "primary",
        variant: "gradient",
        size: "sm",
        icon: "fas fa-check",
        disabled: !saldoForm.monto,
        onClick: () => {
          const delta = parseInt(saldoForm.monto);
          const nuevo = isSuma ? saldoActual + delta : saldoActual - delta;
          setSaldoActual(nuevo);
          const now = new Date();
          const pad = n => String(n).padStart(2, '0');
          const dateStr = `${pad(now.getDate())}/${String(now.getFullYear()).slice(2)}-${pad(now.getMonth() + 1)} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
          setHistSaldo(h => [{
            date: dateStr,
            amount: (isSuma ? '+' : '-') + ' ' + delta.toLocaleString('es-CO'),
            balance: nuevo.toLocaleString('es-CO'),
            by: 'Super Admin',
            note: saldoForm.nota
          }, ...h]);
          setSaldoForm({
            tipo: 'agregar',
            monto: '',
            nota: ''
          });
          closeModal();
        }
      }, "Aplicar ajuste"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'linear-gradient(310deg,#141727,#3a416f)',
        borderRadius: '0.75rem',
        padding: '0.85rem 1.1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.65rem',
        fontWeight: 700,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '0.2rem'
      }
    }, "Saldo actual"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '1.4rem',
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '-0.03em'
      }
    }, saldoActual.toLocaleString('es-CO'), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.4)'
      }
    }, "COP"))), preview !== null && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.65rem',
        fontWeight: 700,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '0.2rem'
      }
    }, "Resultante"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '1.1rem',
        fontWeight: 700,
        color: preview >= 0 ? '#82d616' : '#ff6690',
        letterSpacing: '-0.02em'
      }
    }, preview.toLocaleString('es-CO'), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.65rem',
        opacity: 0.6
      }
    }, "COP")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: fLabel
    }, "Tipo de ajuste"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '0.5rem'
      }
    }, [['agregar', 'fas fa-plus', 'Agregar', '#82d616', '#f0fde8'], ['descontar', 'fas fa-minus', 'Descontar', '#ea0606', '#fdeaea']].map(([v, ic, lb, col, bg]) => /*#__PURE__*/React.createElement("button", {
      key: v,
      onClick: () => setSaldoForm(f => ({
        ...f,
        tipo: v
      })),
      style: {
        flex: 1,
        padding: '0.6rem',
        borderRadius: '0.6rem',
        cursor: 'pointer',
        border: `2px solid ${saldoForm.tipo === v ? col : '#e9ecef'}`,
        background: saldoForm.tipo === v ? bg : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '0.78rem',
        fontWeight: 700,
        color: saldoForm.tipo === v ? col : '#8392ab',
        transition: 'all 0.15s'
      }
    }, /*#__PURE__*/React.createElement("em", {
      className: ic
    }), lb)))), /*#__PURE__*/React.createElement(Input, {
      label: "Monto (COP)",
      value: saldoForm.monto,
      onChange: e => setSaldoForm(f => ({
        ...f,
        monto: e.target.value.replace(/\D/g, '')
      })),
      placeholder: "Ej. 5000",
      icon: "fas fa-dollar-sign",
      type: "text",
      inputMode: "numeric"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: fLabel
    }, "Nota (opcional)"), /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #d2d6da',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("textarea", {
      value: saldoForm.nota,
      onChange: e => setSaldoForm(f => ({
        ...f,
        nota: e.target.value
      })),
      placeholder: "Motivo del ajuste\u2026",
      rows: 2,
      style: {
        width: '100%',
        border: 'none',
        outline: 'none',
        resize: 'none',
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '0.875rem',
        color: '#495057',
        padding: '0.5rem 0.75rem',
        boxSizing: 'border-box',
        background: '#fff'
      }
    }))));
  }

  // ── Modal: Registrar mensualidad ──────────────────────────────────────────
  function ModalMensualidad() {
    const meses = ['2026-08', '2026-07', '2026-06', '2026-05', '2026-04'];
    return /*#__PURE__*/React.createElement(Modal, {
      title: "Registrar mensualidad",
      icon: "fas fa-calendar-check",
      onClose: closeModal,
      footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        color: "secondary",
        variant: "outline",
        size: "sm",
        onClick: closeModal
      }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
        color: "primary",
        variant: "gradient",
        size: "sm",
        icon: "fas fa-calendar-plus",
        disabled: !mensForm.periodo || !mensForm.monto,
        onClick: () => {
          const now = new Date();
          const pad = n => String(n).padStart(2, '0');
          const dateStr = `${pad(now.getDate())}/${String(now.getFullYear()).slice(2)}-${pad(now.getMonth() + 1)} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
          setHistMens(h => [{
            period: mensForm.periodo,
            amount: parseInt(mensForm.monto).toLocaleString('es-CO'),
            by: 'Super Admin',
            date: dateStr,
            note: mensForm.nota
          }, ...h]);
          setMensForm({
            periodo: '2026-07',
            monto: '100000',
            nota: ''
          });
          closeModal();
        }
      }, "Registrar"))
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: fLabel
    }, "Per\xEDodo"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.4rem'
      }
    }, meses.map(m => {
      const active = mensForm.periodo === m;
      const [yr, mo] = m.split('-');
      const label = new Date(parseInt(yr), parseInt(mo) - 1).toLocaleString('es', {
        month: 'short',
        year: '2-digit'
      });
      return /*#__PURE__*/React.createElement("button", {
        key: m,
        onClick: () => setMensForm(f => ({
          ...f,
          periodo: m
        })),
        style: {
          padding: '0.35rem 0.75rem',
          borderRadius: '50rem',
          border: '1px solid',
          cursor: 'pointer',
          fontFamily: "'Open Sans', sans-serif",
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'capitalize',
          borderColor: active ? '#cb0c9f' : '#e9ecef',
          background: active ? '#fde6f7' : '#fff',
          color: active ? '#a30c80' : '#8392ab'
        }
      }, label);
    }))), /*#__PURE__*/React.createElement(Input, {
      label: "Monto (COP)",
      value: mensForm.monto,
      onChange: e => setMensForm(f => ({
        ...f,
        monto: e.target.value.replace(/\D/g, '')
      })),
      placeholder: "Ej. 100000",
      icon: "fas fa-dollar-sign",
      type: "text",
      inputMode: "numeric"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#f8f9fa',
        borderRadius: '0.6rem',
        padding: '0.7rem 0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.75rem',
        color: '#67748e'
      }
    }, /*#__PURE__*/React.createElement("em", {
      className: "fas fa-circle-info",
      style: {
        color: '#17c1e8'
      }
    }), "El pago quedar\xE1 registrado a nombre de ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#344767'
      }
    }, "Super Admin"), " con la fecha y hora actual."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: fLabel
    }, "Nota (opcional)"), /*#__PURE__*/React.createElement("div", {
      style: {
        border: '1px solid #d2d6da',
        borderRadius: '0.5rem',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("textarea", {
      value: mensForm.nota,
      onChange: e => setMensForm(f => ({
        ...f,
        nota: e.target.value
      })),
      placeholder: "Observaciones\u2026",
      rows: 2,
      style: {
        width: '100%',
        border: 'none',
        outline: 'none',
        resize: 'none',
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '0.875rem',
        color: '#495057',
        padding: '0.5rem 0.75rem',
        boxSizing: 'border-box',
        background: '#fff'
      }
    }))));
  }

  // ── Modal: Crear Vehículo (real form) ──────────────────────────────────────
  function ModalVehiculo() {
    const selectedColor = COLORS.find(c => c.hex === vehForm.color) || COLORS[0];
    const iLbl = {
      display: 'block',
      fontSize: '0.72rem',
      fontWeight: 700,
      color: 'var(--text-heading)',
      marginBottom: '0.35rem'
    };
    const req = {
      color: '#ea0606',
      marginLeft: '0.2rem'
    };
    const iInp = {
      width: '100%',
      background: 'var(--surface-input)',
      border: '1px solid var(--border-color)',
      borderRadius: '0.5rem',
      color: 'var(--text-heading)',
      padding: '0.55rem 0.75rem',
      fontSize: '0.875rem',
      outline: 'none',
      fontFamily: "'Open Sans', sans-serif",
      boxSizing: 'border-box'
    };
    return /*#__PURE__*/React.createElement(Modal, {
      title: "Crear Veh\xEDculo",
      icon: "fas fa-car-side",
      onClose: () => {
        closeModal();
        setShowLookup(false);
        setLookupInput('');
      },
      width: 520,
      footer: null
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: iLbl
    }, "Placa"), /*#__PURE__*/React.createElement("input", {
      value: vehForm.placa,
      disabled: true,
      style: {
        ...iInp,
        opacity: 0.6,
        cursor: 'not-allowed'
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: iLbl
    }, "Marca ", /*#__PURE__*/React.createElement("span", {
      style: req
    }, "*")), /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "Marca",
      style: iInp,
      value: vehForm.marca,
      onChange: e => setVehForm(f => ({
        ...f,
        marca: e.target.value
      }))
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: iLbl
    }, "Modelo ", /*#__PURE__*/React.createElement("span", {
      style: req
    }, "*")), /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "Modelo",
      style: iInp,
      value: vehForm.modelo,
      onChange: e => setVehForm(f => ({
        ...f,
        modelo: e.target.value
      }))
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: iLbl
    }, "Color ", /*#__PURE__*/React.createElement("span", {
      style: req
    }, "*")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 56px',
        gap: '0.6rem',
        alignItems: 'stretch'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("select", {
      value: vehForm.color,
      onChange: e => setVehForm(f => ({
        ...f,
        color: e.target.value
      })),
      style: {
        ...iInp,
        appearance: 'none',
        paddingRight: '2rem',
        cursor: 'pointer'
      }
    }, COLORS.map(c => /*#__PURE__*/React.createElement("option", {
      key: c.hex,
      value: c.hex
    }, c.name))), /*#__PURE__*/React.createElement("em", {
      className: "fas fa-chevron-down",
      style: {
        position: 'absolute',
        right: '0.75rem',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '0.7rem',
        color: 'var(--text-secondary)',
        pointerEvents: 'none'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        borderRadius: '0.5rem',
        border: '1px solid var(--border-color)',
        background: selectedColor.hex,
        height: '100%',
        minHeight: 40,
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15)'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: iLbl
    }, "Venc. SOAT"), /*#__PURE__*/React.createElement("input", {
      type: "date",
      style: iInp,
      value: vehForm.soat,
      onChange: e => setVehForm(f => ({
        ...f,
        soat: e.target.value
      }))
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: iLbl
    }, "Venc. Tec-Mec"), /*#__PURE__*/React.createElement("input", {
      type: "date",
      style: iInp,
      value: vehForm.tec,
      onChange: e => setVehForm(f => ({
        ...f,
        tec: e.target.value
      }))
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
      style: iLbl
    }, "Foto"), /*#__PURE__*/React.createElement("input", {
      type: "file",
      accept: "image/jpeg,image/png",
      style: {
        ...iInp,
        padding: '0.35rem 0.5rem',
        cursor: 'pointer'
      },
      onChange: e => {
        const file = e.target.files?.[0];
        if (file && file.size / 1024 / 1024 > 1.024) {
          setVehForm(f => ({
            ...f,
            fileError: 'Máx 1 MB (JPG/PNG)'
          }));
        } else {
          setVehForm(f => ({
            ...f,
            fileError: ''
          }));
        }
      }
    }), vehForm.fileError && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.72rem',
        color: '#ea0606',
        marginTop: '0.25rem',
        display: 'block'
      }
    }, vehForm.fileError)), /*#__PURE__*/React.createElement("button", {
      disabled: !vehForm.marca.trim() || !vehForm.modelo.trim(),
      onClick: () => {
        if (!vehForm.marca.trim() || !vehForm.modelo.trim()) return;
        setVehicles(vs => [...vs, {
          id: Date.now(),
          plate: vehForm.placa,
          model: `${vehForm.marca} ${vehForm.modelo}`,
          selectable: false,
          enabled: true
        }]);
        setVehForm({
          placa: '',
          marca: '',
          modelo: '',
          color: '#000000',
          soat: '',
          tec: '',
          fileError: ''
        });
        setShowLookup(false);
        setLookupInput('');
        closeModal();
      },
      style: {
        width: '100%',
        padding: '0.7rem',
        background: !vehForm.marca.trim() || !vehForm.modelo.trim() ? '#adb5bd' : '#82d616',
        border: 'none',
        borderRadius: '0.5rem',
        color: '#fff',
        fontSize: '0.8rem',
        fontWeight: 700,
        letterSpacing: '0.08rem',
        textTransform: 'uppercase',
        fontFamily: "'Open Sans', sans-serif",
        cursor: 'pointer',
        boxShadow: !vehForm.marca.trim() || !vehForm.modelo.trim() ? 'none' : '0 4px 14px rgba(130,214,22,0.4)',
        transition: 'all 0.15s'
      }
    }, "ENVIAR"));
  }

  // ── render ────────────────────────────────────────────────────────────────
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Open Sans', sans-serif"
    }
  }, modal === 'saldo' && /*#__PURE__*/React.createElement(ModalSaldo, null), modal === 'mensualidad' && /*#__PURE__*/React.createElement(ModalMensualidad, null), modal === 'vehiculo' && /*#__PURE__*/React.createElement(ModalVehiculo, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: '#8392ab'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.6
    }
  }, "Conductores"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: '0 0.4rem',
      opacity: 0.5
    }
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#344767',
      fontWeight: 600
    }
  }, "Editar conductor")), /*#__PURE__*/React.createElement("h6", {
    style: {
      margin: '0.1rem 0 0',
      fontSize: '1rem',
      fontWeight: 700,
      color: '#344767'
    }
  }, driver.name)), /*#__PURE__*/React.createElement(Button, {
    color: "secondary",
    variant: "outline",
    size: "sm",
    icon: "fas fa-arrow-left",
    onClick: onBack
  }, "Regresar")), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      paddingTop: '0.25rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: driver.name,
    size: 76,
    rounded: "lg"
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      position: 'absolute',
      bottom: -5,
      right: -5,
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: 'linear-gradient(310deg,#2152ff,#21d4fd)',
      border: '2px solid #fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '0.55rem',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-pencil"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.7rem',
      color: '#adb5bd',
      fontWeight: 600,
      textAlign: 'center',
      maxWidth: 80
    }
  }, driver.name.split(' ')[0])), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gap: '0.85rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nombre completo",
    value: form.name,
    onChange: set('name'),
    icon: "fas fa-user"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 2'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Correo electr\xF3nico",
    value: form.email,
    onChange: set('email'),
    disabled: emailLocked,
    icon: emailLocked ? 'fas fa-lock' : 'fas fa-envelope'
  }), /*#__PURE__*/React.createElement("button", {
    style: lockBtn,
    onClick: () => setEmailLocked(l => !l)
  }, /*#__PURE__*/React.createElement("em", {
    className: emailLocked ? 'fas fa-lock-open' : 'fas fa-lock'
  }), emailLocked ? 'Editar' : 'Bloquear')), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 'span 2'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Contrase\xF1a",
    value: form.password,
    onChange: set('password'),
    type: passLocked ? 'password' : 'text',
    disabled: passLocked,
    icon: passLocked ? 'fas fa-lock' : 'fas fa-key'
  }), /*#__PURE__*/React.createElement("button", {
    style: lockBtn,
    onClick: () => setPassLocked(l => !l)
  }, /*#__PURE__*/React.createElement("em", {
    className: passLocked ? 'fas fa-lock-open' : 'fas fa-lock'
  }), passLocked ? 'Editar' : 'Bloquear')), /*#__PURE__*/React.createElement(Input, {
    label: "Tel\xE9fono",
    value: form.phone,
    onChange: set('phone'),
    icon: "fas fa-phone"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Tel\xE9fono 2",
    value: form.phone2,
    onChange: set('phone2'),
    placeholder: "Opcional",
    icon: "fas fa-phone"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Tipo doc",
    value: form.docType,
    onChange: set('docType'),
    options: ['CC', 'CE', 'NIT', 'PA', 'RC']
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Documento",
    value: form.doc,
    onChange: set('doc'),
    icon: "fas fa-id-card"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.6rem',
      paddingTop: '1.25rem',
      borderTop: '1px solid #e9ecef',
      marginTop: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    color: "secondary",
    variant: "outline",
    size: "sm",
    onClick: onBack
  }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
    color: "primary",
    variant: "gradient",
    size: "sm",
    icon: "fas fa-check"
  }, "Guardar cambios"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.25rem',
      marginBottom: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement("h6", {
    style: {
      margin: 0,
      fontSize: '0.88rem',
      fontWeight: 700,
      color: '#344767'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-car-side",
    style: {
      color: '#cb0c9f',
      marginRight: '0.5rem'
    }
  }), "Veh\xEDculos asignados"), vehicles.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: v.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      padding: '0.6rem 0.75rem',
      borderBottom: i < vehicles.length - 1 ? '1px solid var(--border-subtle)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      flex: 'none',
      background: v.enabled ? 'rgba(130,214,22,0.15)' : 'var(--surface-input)',
      border: `2px solid ${v.enabled ? '#82d616' : 'var(--border-color)'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: v.enabled ? '#82d616' : 'var(--border-color)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: '0.85rem',
      color: 'var(--text-heading)'
    }
  }, v.plate), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: '0.5rem',
      fontSize: '0.75rem',
      color: 'var(--text-secondary)'
    }
  }, v.model)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.35rem'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: v.selectable,
    onChange: val => setVehicles(vs => vs.map((x, j) => j === i ? {
      ...x,
      selectable: val
    } : x))
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.65rem',
      color: 'var(--text-secondary)',
      fontWeight: 600
    }
  }, "Seleccionable")), v.enabled && /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#82d616',
      color: '#fff',
      fontSize: '0.62rem',
      fontWeight: 800,
      letterSpacing: '0.04em',
      padding: '0.22rem 0.65rem',
      borderRadius: '50rem',
      textTransform: 'uppercase'
    }
  }, "HABILITADO"))), !showLookup ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowLookup(true),
    style: {
      width: '100%',
      padding: '0.55rem 1rem',
      background: 'transparent',
      border: '1.5px solid #cb0c9f',
      borderRadius: '0.5rem',
      color: '#cb0c9f',
      fontSize: '0.75rem',
      fontWeight: 800,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      fontFamily: "'Open Sans', sans-serif",
      cursor: 'pointer',
      transition: 'all 0.15s'
    },
    onMouseOver: e => {
      e.currentTarget.style.background = 'rgba(203,12,159,0.06)';
    },
    onMouseOut: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, "+ AGREGAR VEH\xCDCULO") : /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-subtle)',
      borderRadius: '0.65rem',
      overflow: 'visible',
      position: 'relative',
      padding: '0.75rem',
      background: 'var(--body-bg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '0.35rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      fontWeight: 700,
      color: 'var(--text-heading)'
    }
  }, "Placa"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowLookup(false);
      setLookupInput('');
    },
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-secondary)',
      fontSize: '0.75rem',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-xmark"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    autoFocus: true,
    placeholder: "Buscar placa...",
    value: lookupInput,
    autoComplete: "off",
    onChange: e => {
      const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setLookupInput(v);
      setLookupActive(-1);
    },
    onFocus: () => setLookupFocused(true),
    onBlur: () => setTimeout(() => setLookupFocused(false), 160),
    onKeyDown: e => {
      if (!lookupDropdownOpen) return;
      const total = lookupSuggestions.length + 1;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setLookupActive(a => (a + 1) % total);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setLookupActive(a => a <= 0 ? total - 1 : a - 1);
      } else if (e.key === 'Enter' && lookupActive >= 0) {
        e.preventDefault();
        if (lookupActive < lookupSuggestions.length) {
          const v = lookupSuggestions[lookupActive];
          setVehicles(vs => [...vs, {
            id: Date.now(),
            plate: v.plate,
            model: `${v.brand} ${v.model}`,
            selectable: false,
            enabled: false
          }]);
          setShowLookup(false);
          setLookupInput('');
        } else {
          setVehForm(f => ({
            ...f,
            placa: lookupInput
          }));
          setModal('vehiculo');
        }
      } else if (e.key === 'Escape') {
        setLookupFocused(false);
      }
    },
    style: {
      width: '100%',
      boxSizing: 'border-box',
      background: 'var(--surface-input)',
      border: `1.5px solid ${lookupFocused ? '#cb0c9f' : 'var(--border-color)'}`,
      borderRadius: lookupDropdownOpen ? '0.45rem 0.45rem 0 0' : '0.45rem',
      color: 'var(--text-heading)',
      padding: '0.5rem 0.75rem',
      fontSize: '0.85rem',
      outline: 'none',
      fontFamily: "'Open Sans', sans-serif",
      boxShadow: lookupFocused ? '0 0 0 3px rgba(203,12,159,0.12)' : 'none',
      transition: 'border-color 0.15s, box-shadow 0.15s'
    }
  }), lookupDropdownOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'var(--surface-card)',
      border: '1.5px solid var(--border-subtle)',
      borderTop: 'none',
      borderRadius: '0 0 0.5rem 0.5rem',
      boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
      overflow: 'hidden'
    }
  }, lookupSuggestions.map((v, idx) => /*#__PURE__*/React.createElement("div", {
    key: v.id,
    onMouseDown: () => {
      setVehicles(vs => [...vs, {
        id: Date.now(),
        plate: v.plate,
        model: `${v.brand} ${v.model}`,
        selectable: false,
        enabled: false
      }]);
      setShowLookup(false);
      setLookupInput('');
    },
    style: {
      padding: '0.65rem 0.9rem',
      cursor: 'pointer',
      borderBottom: '1px solid var(--border-subtle)',
      background: lookupActive === idx ? 'linear-gradient(310deg, rgba(121,40,202,0.1), rgba(255,0,128,0.1))' : 'transparent',
      boxShadow: lookupActive === idx ? 'inset 0 0 0 1px rgba(255,0,128,0.2)' : 'none',
      transition: 'background 0.1s'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: '0.82rem',
      color: 'var(--text-heading)',
      marginRight: '0.5rem'
    }
  }, v.plate), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: 'var(--text-secondary)'
    }
  }, v.brand, " ", v.model, " ", v.year))), /*#__PURE__*/React.createElement("div", {
    onMouseDown: () => {
      setVehForm(f => ({
        ...f,
        placa: lookupInput
      }));
      setModal('vehiculo');
      setLookupFocused(false);
    },
    style: {
      padding: '0.65rem 0.9rem',
      cursor: 'pointer',
      background: lookupActive === lookupSuggestions.length ? 'linear-gradient(310deg, rgba(121,40,202,0.1), rgba(255,0,128,0.1))' : 'transparent',
      boxShadow: lookupActive === lookupSuggestions.length ? 'inset 0 0 0 1px rgba(255,0,128,0.2)' : 'none',
      fontSize: '0.82rem',
      fontWeight: 700,
      color: 'var(--text-heading)'
    }
  }, "+ Crear veh\xEDculo con placa ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#cb0c9f'
    }
  }, lookupInput))))), /*#__PURE__*/React.createElement("hr", {
    style: divider
  }), /*#__PURE__*/React.createElement("h6", {
    style: {
      margin: 0,
      fontSize: '0.88rem',
      fontWeight: 700,
      color: '#344767'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-mobile-screen",
    style: {
      color: '#cb0c9f',
      marginRight: '0.5rem'
    }
  }), "Dispositivo"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    value: device,
    onChange: e => setDevice(e.target.value),
    icon: "fas fa-mobile-screen",
    style: {
      flex: 1
    },
    placeholder: "Sin dispositivo"
  }), /*#__PURE__*/React.createElement("button", {
    title: "Desvincular",
    style: {
      width: 40,
      height: 40,
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      flex: 'none',
      background: 'linear-gradient(310deg,#d60808,#ff6690)',
      color: '#fff',
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 7px -1px rgba(0,0,0,0.11)'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-trash-can"
  }))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement("h6", {
    style: {
      margin: 0,
      fontSize: '0.88rem',
      fontWeight: 700,
      color: '#344767'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-wallet",
    style: {
      color: '#cb0c9f',
      marginRight: '0.5rem'
    }
  }), "Estado y pagos"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.85rem',
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: fLabel
  }, "Estado"), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: '0.3rem'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: form.enabled,
    onChange: v => setForm(f => ({
      ...f,
      enabled: v
    })),
    label: form.enabled ? 'Habilitado' : 'Deshabilitado'
  }))), /*#__PURE__*/React.createElement(Select, {
    label: "Modo de pago",
    value: form.payMode,
    onChange: set('payMode'),
    options: ['Mensualidad', 'Por servicio', 'Prepago']
  })), /*#__PURE__*/React.createElement("hr", {
    style: divider
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'linear-gradient(310deg,#141727,#3a416f)',
      borderRadius: '0.85rem',
      padding: '1rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.65rem',
      fontWeight: 700,
      color: 'rgba(255,255,255,0.5)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      marginBottom: '0.2rem'
    }
  }, "Saldo actual"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '0.3rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '1.8rem',
      fontWeight: 700,
      color: '#fff',
      letterSpacing: '-0.03em'
    }
  }, saldoActual.toLocaleString('es-CO')), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      fontWeight: 700,
      color: 'rgba(255,255,255,0.4)'
    }
  }, "COP"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setModal('saldo'),
    style: {
      padding: '0.5rem 1.1rem',
      borderRadius: '0.5rem',
      border: 'none',
      background: 'rgba(255,255,255,0.12)',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '0.7rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '-0.02em',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-sliders",
    style: {
      marginRight: '0.4rem'
    }
  }), "Administrar")), /*#__PURE__*/React.createElement(Button, {
    color: "primary",
    variant: "outline",
    fullWidth: true,
    icon: "fas fa-calendar-plus",
    onClick: () => setModal('mensualidad')
  }, "Registrar mensualidad")))), /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '1rem 1.25rem 0.85rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #e9ecef'
    }
  }, /*#__PURE__*/React.createElement("h6", {
    style: {
      margin: 0,
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#344767'
    }
  }, "Historial"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.4rem'
    }
  }, /*#__PURE__*/React.createElement(TabPill, {
    id: "saldo",
    label: "Saldo",
    icon: "fas fa-coins"
  }), /*#__PURE__*/React.createElement(TabPill, {
    id: "mensualidades",
    label: "Mensualidades",
    icon: "fas fa-calendar-check"
  }))), historyTab === 'saldo' && /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Fecha', 'Monto', 'Saldo resultante', 'Registrado por', 'Nota'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: th
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, histSaldo.map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-clock",
    style: {
      color: '#d2d6da',
      fontSize: '0.7rem'
    }
  }), row.date)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontWeight: 700,
      color: row.amount.startsWith('-') ? '#ea0606' : '#82d616'
    }
  }, row.amount, " COP"), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontWeight: 600,
      color: '#344767'
    }
  }, row.balance, " COP"), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.45rem'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: row.by,
    size: 22
  }), row.by)), /*#__PURE__*/React.createElement("td", {
    style: td
  }, row.note ? /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#f3f4f6',
      padding: '0.15rem 0.5rem',
      borderRadius: '50rem',
      fontSize: '0.72rem',
      color: '#67748e'
    }
  }, row.note) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#d2d6da'
    }
  }, "\u2014")))))), historyTab === 'mensualidades' && /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Período', 'Monto', 'Registrado por', 'Fecha de pago', 'Nota'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: th
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, histMens.map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'linear-gradient(310deg,#7928ca,#ff0080)',
      color: '#fff',
      padding: '0.15rem 0.55rem',
      borderRadius: '50rem',
      fontSize: '0.72rem',
      fontWeight: 700
    }
  }, row.period)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontWeight: 700,
      color: '#344767'
    }
  }, row.amount, " COP"), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.45rem'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: row.by,
    size: 22
  }), row.by)), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-clock",
    style: {
      color: '#d2d6da',
      fontSize: '0.7rem'
    }
  }), row.date)), /*#__PURE__*/React.createElement("td", {
    style: td
  }, row.note ? /*#__PURE__*/React.createElement("span", {
    style: {
      background: '#f3f4f6',
      padding: '0.15rem 0.5rem',
      borderRadius: '50rem',
      fontSize: '0.72rem',
      color: '#67748e'
    }
  }, row.note) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#d2d6da'
    }
  }, "\u2014")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0.6rem 1.25rem',
      fontSize: '0.72rem',
      color: '#adb5bd',
      borderTop: '1px solid #f3f4f6'
    }
  }, historyTab === 'saldo' ? `${histSaldo.length} movimientos` : `${histMens.length} mensualidades`)));
}
window.EditDriverView = EditDriverView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/EditDriverView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/EditMessageModal.jsx
try { (() => {
// EditMessageModal.jsx — Gorda Design System
// Redesigned WhatsApp message template editor

/* ── WA markup → React elements ──────────────────────────── */
function parseWAMarkup(raw) {
  if (!raw) return null;
  return raw.split('\n').map((line, li, arr) => {
    const parts = [];
    let rest = line,
      k = 0;
    while (rest.length) {
      const bm = rest.match(/\*([^*\n]+)\*/);
      const im = rest.match(/_([^_\n]+)_/);
      let chosen = null,
        type = null;
      if (bm && im) {
        if (bm.index <= im.index) {
          chosen = bm;
          type = 'b';
        } else {
          chosen = im;
          type = 'i';
        }
      } else if (bm) {
        chosen = bm;
        type = 'b';
      } else if (im) {
        chosen = im;
        type = 'i';
      }
      if (chosen) {
        if (chosen.index > 0) parts.push(/*#__PURE__*/React.createElement("span", {
          key: k++
        }, rest.slice(0, chosen.index)));
        if (type === 'b') parts.push(/*#__PURE__*/React.createElement("strong", {
          key: k++
        }, chosen[1]));else parts.push(/*#__PURE__*/React.createElement("span", {
          key: k++,
          style: {
            fontStyle: 'italic'
          }
        }, chosen[1]));
        rest = rest.slice(chosen.index + chosen[0].length);
      } else {
        parts.push(/*#__PURE__*/React.createElement("span", {
          key: k++
        }, rest));
        break;
      }
    }
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: li
    }, parts, li < arr.length - 1 && /*#__PURE__*/React.createElement("br", null));
  });
}

/* ── WhatsApp phone preview ───────────────────────────────── */
function WAPhonePreview({
  message,
  buttons
}) {
  const validBtns = (buttons || []).filter(b => b.label && b.label.trim());
  const timeStr = new Date().toLocaleTimeString('es', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system,"Segoe UI",Helvetica,sans-serif',
      borderRadius: '1.25rem',
      overflow: 'hidden',
      boxShadow: '0 10px 36px rgba(0,0,0,0.22)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#075e54',
      padding: '0.6rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.55rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      background: 'linear-gradient(135deg,#25d366,#128c7e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fa-brands fa-whatsapp",
    style: {
      color: '#fff',
      fontSize: '1rem'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#fff',
      fontSize: '0.8rem',
      fontWeight: 700,
      lineHeight: 1.2
    }
  }, "Gorda Taxi"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: '0.63rem'
    }
  }, "en l\xEDnea")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.7rem',
      color: 'rgba(255,255,255,0.7)',
      fontSize: '0.78rem'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-video"
  }), /*#__PURE__*/React.createElement("em", {
    className: "fas fa-phone"
  }), /*#__PURE__*/React.createElement("em", {
    className: "fas fa-ellipsis-vertical"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#e5ddd5',
      padding: '0.85rem 0.75rem',
      minHeight: 120
    }
  }, message ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '88%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#dcf8c6',
      borderRadius: '0.7rem 0 0.7rem 0.7rem',
      padding: '0.5rem 0.7rem 0.3rem',
      boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
      fontSize: '0.79rem',
      color: '#1a1a1a',
      lineHeight: 1.55,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: -7,
      top: 0,
      width: 0,
      height: 0,
      borderTop: '8px solid #dcf8c6',
      borderLeft: '8px solid transparent'
    }
  }), parseWAMarkup(message), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      fontSize: '0.58rem',
      color: '#7a9c7a',
      marginTop: '0.22rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '0.2rem'
    }
  }, timeStr, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-check-double",
    style: {
      fontSize: '0.55rem',
      color: '#4fc3f7'
    }
  }))), validBtns.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.2rem',
      marginTop: '0.22rem'
    }
  }, validBtns.map((btn, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: '#fff',
      borderRadius: '0.45rem',
      padding: '0.4rem 0.7rem',
      textAlign: 'center',
      fontSize: '0.76rem',
      color: '#128c7e',
      fontWeight: 500,
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.3rem'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-reply",
    style: {
      fontSize: '0.58rem'
    }
  }), btn.label))))) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '2rem 0',
      color: '#999',
      fontSize: '0.73rem'
    }
  }, "Escribe un mensaje para ver la vista previa")));
}

/* ── Variable chip ────────────────────────────────────────── */
function WAVarChip({
  label,
  onClick
}) {
  const [hov, setHov] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    title: `Insertar {{${label}}}`,
    style: {
      padding: '0.18rem 0.5rem',
      borderRadius: '50rem',
      border: `1px solid ${hov ? 'var(--primary)' : 'var(--border-color)'}`,
      background: hov ? 'var(--badge-primary-bg)' : 'transparent',
      color: hov ? 'var(--primary)' : 'var(--text-muted)',
      fontSize: '0.66rem',
      fontWeight: 700,
      letterSpacing: '0.04em',
      cursor: 'pointer',
      transition: 'all 0.13s',
      fontFamily: 'var(--font-sans)',
      whiteSpace: 'nowrap'
    }
  }, label);
}

/* ── Toolbar + textarea combo ────────────────────────────── */
const WA_VARS = ['PLACA', 'COLOR', 'NOMBRE', 'PQR', 'LUGAR', 'EMPRESA'];
function WAEditorBlock({
  value,
  onChange,
  taRef,
  rows,
  placeholder
}) {
  const [focused, setFocused] = React.useState(false);
  function insertVar(v) {
    const tag = `{{${v}}}`;
    const el = taRef.current;
    if (el) {
      const s = el.selectionStart,
        e = el.selectionEnd;
      const next = value.slice(0, s) + tag + value.slice(e);
      onChange(next);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(s + tag.length, s + tag.length);
      }, 0);
    } else {
      onChange(value + tag);
    }
  }
  function wrap(char) {
    const el = taRef.current;
    if (!el) return;
    const s = el.selectionStart,
      e = el.selectionEnd;
    const inner = value.slice(s, e) || 'texto';
    const wrapped = `${char}${inner}${char}`;
    const next = value.slice(0, s) + wrapped + value.slice(e);
    onChange(next);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(s + wrapped.length, s + wrapped.length);
    }, 0);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: `1.5px solid ${focused ? 'var(--primary)' : 'var(--border-color)'}`,
      borderRadius: '0.5rem',
      overflow: 'hidden',
      transition: 'border-color 0.15s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '0.2rem',
      padding: '0.3rem 0.5rem',
      background: 'var(--surface-input)',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    title: "Negrita (*texto*)",
    onClick: () => wrap('*'),
    style: {
      width: 28,
      height: 28,
      borderRadius: '0.35rem',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-body)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia',
      fontWeight: 900,
      fontSize: '0.9rem',
      transition: 'all 0.12s'
    }
  }, "B"), /*#__PURE__*/React.createElement("button", {
    title: "Cursiva (_texto_)",
    onClick: () => wrap('_'),
    style: {
      width: 28,
      height: 28,
      borderRadius: '0.35rem',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--text-body)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia',
      fontStyle: 'italic',
      fontSize: '0.9rem',
      transition: 'all 0.12s'
    }
  }, "I"), /*#__PURE__*/React.createElement("button", {
    title: "Emoji",
    style: {
      width: 28,
      height: 28,
      borderRadius: '0.35rem',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, "\uD83D\uDE00"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 16,
      background: 'var(--border-subtle)',
      margin: '0 0.1rem'
    }
  }), WA_VARS.map(v => /*#__PURE__*/React.createElement(WAVarChip, {
    key: v,
    label: v,
    onClick: () => insertVar(v)
  }))), /*#__PURE__*/React.createElement("textarea", {
    ref: taRef,
    value: value,
    onChange: e => onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    rows: rows || 5,
    placeholder: placeholder || '',
    style: {
      width: '100%',
      display: 'block',
      padding: '0.6rem 0.75rem',
      border: 'none',
      background: 'var(--surface-input)',
      color: 'var(--text-heading)',
      fontFamily: 'var(--font-sans)',
      fontSize: '0.875rem',
      outline: 'none',
      resize: 'vertical',
      lineHeight: 1.65
    }
  }));
}

/* ── EditMessageModal ─────────────────────────────────────── */
function EditMessageModal({
  msg,
  onClose,
  onSave
}) {
  const [name, setName] = React.useState(msg?.name || 'Nueva plantilla');
  const [text, setText] = React.useState(msg?.text || '');
  const [desc, setDesc] = React.useState(msg?.desc || '');
  const [interactive, setInteractive] = React.useState(msg?.interactive ?? false);
  const [msgType, setMsgType] = React.useState(msg?.msgType || 'button');
  const [iText, setIText] = React.useState(msg?.iText || '');
  const [btns, setBtns] = React.useState(msg?.btns || [{
    label: '',
    action: ''
  }]);
  const mainRef = React.useRef(null);
  const iRef = React.useRef(null);
  const IS = {
    width: '100%',
    padding: '0.55rem 0.75rem',
    border: '1.5px solid var(--border-color)',
    borderRadius: '0.5rem',
    background: 'var(--surface-input)',
    color: 'var(--text-heading)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.15s'
  };
  const LS = {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '0.4rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  };
  function fi(e) {
    e.target.style.borderColor = 'var(--primary)';
  }
  function bi(e) {
    e.target.style.borderColor = 'var(--border-color)';
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'var(--font-sans)'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--body-bg)',
      borderRadius: '1.25rem',
      width: '100%',
      maxWidth: 1080,
      maxHeight: 'calc(100vh - 2rem)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
      overflow: 'hidden'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-card)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: '0.65rem',
      flex: 'none',
      background: 'linear-gradient(310deg,#128c7e,#25d366)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 14px rgba(37,211,102,0.3)'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fa-brands fa-whatsapp",
    style: {
      color: '#fff',
      fontSize: '1.1rem'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: 'var(--text-heading)',
      lineHeight: 1.2
    }
  }, "Editar Mensaje de WhatsApp"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: 'var(--text-muted)',
      marginTop: '0.1rem'
    }
  }, "Plantilla \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)',
      fontWeight: 600
    }
  }, name || '—')))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 30,
      height: 30,
      borderRadius: '0.4rem',
      border: 'none',
      background: 'var(--surface-input)',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.8rem',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-xmark"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: '0.875rem',
      boxShadow: 'var(--shadow-card)',
      padding: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.75rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: LS
  }, "Nombre"), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    onFocus: fi,
    onBlur: bi,
    placeholder: "Nombre de la plantilla",
    style: IS
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: LS
  }, "Mensaje"), /*#__PURE__*/React.createElement(WAEditorBlock, {
    value: text,
    onChange: setText,
    taRef: mainRef,
    rows: 6,
    placeholder: "Escribe tu mensaje\u2026 usa *negrita* o _cursiva_"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: LS
  }, "Vista Previa"), /*#__PURE__*/React.createElement(WAPhonePreview, {
    message: text
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: LS
  }, "Descripci\xF3n"), /*#__PURE__*/React.createElement("textarea", {
    value: desc,
    onChange: e => setDesc(e.target.value),
    onFocus: fi,
    onBlur: bi,
    rows: 4,
    placeholder: "Describe cu\xE1ndo se usa esta plantilla\u2026",
    style: {
      ...IS,
      resize: 'vertical',
      lineHeight: 1.6
    }
  }))))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setInteractive(v => !v),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.85rem 1.1rem',
      width: '100%',
      textAlign: 'left',
      background: interactive ? 'var(--badge-success-bg)' : 'var(--surface-card)',
      border: `1.5px solid ${interactive ? 'var(--success)' : 'var(--border-subtle)'}`,
      borderRadius: '0.75rem',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      transition: 'all 0.2s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: '0.5rem',
      flex: 'none',
      background: interactive ? 'linear-gradient(310deg,#17ad37,#98ec2d)' : 'var(--surface-input)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: interactive ? '#fff' : 'var(--text-muted)',
      fontSize: '0.85rem',
      boxShadow: interactive ? '0 4px 12px rgba(130,214,22,0.3)' : 'none',
      transition: 'all 0.2s'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: interactive ? 'fas fa-bolt' : 'fas fa-bolt-slash'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.83rem',
      fontWeight: 700,
      color: interactive ? 'var(--badge-success-fg)' : 'var(--text-heading)'
    }
  }, interactive ? 'Modo interactivo habilitado' : 'Modo interactivo deshabilitado'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: 'var(--text-muted)',
      marginTop: '0.1rem'
    }
  }, interactive ? 'El mensaje incluye botones de respuesta rápida' : 'Activa para añadir botones de respuesta rápida')), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 22,
      borderRadius: 50,
      flex: 'none',
      background: interactive ? 'var(--success)' : 'var(--border-color)',
      position: 'relative',
      transition: 'background 0.2s',
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: interactive ? 20 : 3,
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: '#fff',
      transition: 'left 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
    }
  }))), interactive && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: '0.875rem',
      boxShadow: 'var(--shadow-card)',
      padding: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '1.1rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 26,
      height: 26,
      borderRadius: '0.4rem',
      background: 'linear-gradient(310deg,#17ad37,#98ec2d)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '0.7rem'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-bolt"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.88rem',
      fontWeight: 700,
      color: 'var(--text-heading)'
    }
  }, "Mensaje Interactivo")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.75rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: LS
  }, "Tipo de mensaje"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: msgType,
    onChange: e => setMsgType(e.target.value),
    onFocus: fi,
    onBlur: bi,
    style: {
      ...IS,
      appearance: 'none',
      paddingRight: '2.2rem',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "button"
  }, "Bot\xF3n"), /*#__PURE__*/React.createElement("option", {
    value: "list"
  }, "Lista"), /*#__PURE__*/React.createElement("option", {
    value: "product"
  }, "Producto")), /*#__PURE__*/React.createElement("em", {
    className: "fas fa-chevron-down",
    style: {
      position: 'absolute',
      right: '0.7rem',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--text-muted)',
      fontSize: '0.7rem'
    }
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: LS
  }, "Mensaje"), /*#__PURE__*/React.createElement(WAEditorBlock, {
    value: iText,
    onChange: setIText,
    taRef: iRef,
    rows: 4,
    placeholder: "Escribe el mensaje interactivo\u2026"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.55rem'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      ...LS,
      marginBottom: 0
    }
  }, "Botones de respuesta"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.68rem',
      color: 'var(--text-muted)',
      fontWeight: 600
    }
  }, btns.length, "/3")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 34px',
      gap: '0.4rem',
      marginBottom: '0.35rem'
    }
  }, ['Etiqueta', 'Acción / ID', ''].map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: '0.62rem',
      fontWeight: 700,
      color: 'var(--text-muted)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase'
    }
  }, h))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem'
    }
  }, btns.map((btn, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 34px',
      gap: '0.4rem',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: btn.label,
    onChange: e => setBtns(bs => bs.map((b, j) => j === i ? {
      ...b,
      label: e.target.value
    } : b)),
    onFocus: fi,
    onBlur: bi,
    placeholder: "Texto visible",
    style: {
      ...IS,
      fontSize: '0.8rem',
      padding: '0.38rem 0.65rem'
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: btn.action,
    onChange: e => setBtns(bs => bs.map((b, j) => j === i ? {
      ...b,
      action: e.target.value
    } : b)),
    onFocus: fi,
    onBlur: bi,
    placeholder: "ACCION",
    style: {
      ...IS,
      fontSize: '0.78rem',
      padding: '0.38rem 0.65rem',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.02em'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setBtns(bs => bs.filter((_, j) => j !== i)),
    style: {
      width: 34,
      height: 34,
      borderRadius: '0.4rem',
      border: 'none',
      background: 'var(--badge-danger-bg)',
      color: 'var(--badge-danger-fg)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.72rem'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-trash"
  }))))), btns.length < 3 && /*#__PURE__*/React.createElement("button", {
    onClick: () => setBtns(bs => [...bs, {
      label: '',
      action: ''
    }]),
    style: {
      marginTop: '0.55rem',
      padding: '0.35rem 0.8rem',
      border: '1.5px dashed var(--border-color)',
      borderRadius: '0.45rem',
      background: 'transparent',
      color: 'var(--primary)',
      fontFamily: 'var(--font-sans)',
      fontSize: '0.73rem',
      fontWeight: 700,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      transition: 'all 0.14s'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-plus",
    style: {
      fontSize: '0.65rem'
    }
  }), "Agregar bot\xF3n"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      ...LS,
      marginBottom: '0.65rem'
    }
  }, "Vista Previa"), /*#__PURE__*/React.createElement(WAPhonePreview, {
    message: iText,
    buttons: btns
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0.9rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-card)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      fontSize: '0.72rem',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-circle-info",
    style: {
      fontSize: '0.7rem'
    }
  }), "Los cambios se aplican al guardar"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      padding: '0.45rem 1.1rem',
      borderRadius: '0.5rem',
      border: '1.5px solid var(--border-color)',
      background: 'var(--surface-input)',
      color: 'var(--text-body)',
      fontFamily: 'inherit',
      fontSize: '0.8rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Cerrar"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onSave && onSave({
        name,
        text,
        desc,
        interactive,
        iText,
        btns
      });
      onClose();
    },
    style: {
      padding: '0.45rem 1.25rem',
      borderRadius: '0.5rem',
      border: 'none',
      background: 'var(--primary)',
      color: '#fff',
      fontFamily: 'inherit',
      fontSize: '0.8rem',
      fontWeight: 700,
      cursor: 'pointer',
      boxShadow: 'var(--shadow-btn)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-paper-plane",
    style: {
      fontSize: '0.72rem'
    }
  }), "Guardar")))));
}
window.EditMessageModal = EditMessageModal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/EditMessageModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/LoadingModal.jsx
try { (() => {
// ─── LoadingModal · Gorda Admin ──────────────────────────────────────────────
// "Por favor espere…" overlay. Brand-gradient orbit ring + indeterminate bar.
// Fully theme-aware (light & dark) via design tokens.
// Usage: <LoadingModal open={bool} message="Por favor espere..." sub="…" />

(function () {
  const {
    useEffect
  } = React;
  const STYLE_ID = 'gorda-loading-modal-styles';
  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      @keyframes gordaLmSpin   { to { transform: rotate(360deg); } }
      @keyframes gordaLmPulse  { 0%,100% { transform: scale(1);   opacity: 1; }
                                 50%      { transform: scale(.55); opacity: .55; } }
      @keyframes gordaLmBar    { 0%   { transform: translateX(-110%); }
                                 100% { transform: translateX(420%);  } }
      @keyframes gordaLmIn     { from { opacity: 0; transform: translateY(8px) scale(.97); }
                                 to   { opacity: 1; transform: translateY(0)   scale(1);  } }

      /* Backdrop — theme aware */
      .gorda-lm-backdrop { background: rgba(233,236,239,.66); }
      [data-theme="dark"] .gorda-lm-backdrop { background: rgba(8,11,20,.62); }
      @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) .gorda-lm-backdrop { background: rgba(8,11,20,.62); }
      }
      @media (prefers-reduced-motion: reduce) {
        .gorda-lm-ring, .gorda-lm-core, .gorda-lm-seg, .gorda-lm-card { animation: none !important; }
      }
    `;
    document.head.appendChild(s);
  }
  function LoadingModal({
    open,
    message = 'Por favor espere...',
    sub = 'Esto solo tomará un momento'
  }) {
    useEffect(() => {
      ensureStyles();
    }, []);
    if (!open) return null;
    const RING = 84; // ring diameter
    const STROKE = 6; // ring thickness

    return /*#__PURE__*/React.createElement("div", {
      className: "gorda-lm-backdrop",
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "gorda-lm-card",
      style: {
        background: 'var(--surface-card)',
        borderRadius: '1.25rem',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card), 0 24px 70px rgba(20,23,39,.18)',
        width: 360,
        maxWidth: 'calc(100vw - 2rem)',
        overflow: 'hidden',
        fontFamily: "'Open Sans', sans-serif",
        animation: 'gordaLmIn .28s cubic-bezier(.2,.7,.3,1) both'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '2.4rem 2rem 1.9rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: RING,
        height: RING,
        marginBottom: '1.4rem'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        border: `${STROKE}px solid var(--border-subtle)`
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "gorda-lm-ring",
      style: {
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: 'conic-gradient(from 90deg, rgba(203,12,159,0) 8%, #cb0c9f 62%, #ff0080 100%)',
        WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${STROKE}px), #000 calc(100% - ${STROKE}px))`,
        mask: `radial-gradient(farthest-side, transparent calc(100% - ${STROKE}px), #000 calc(100% - ${STROKE}px))`,
        animation: 'gordaLmSpin .85s linear infinite'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "gorda-lm-core",
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 18,
        height: 18,
        marginTop: -9,
        marginLeft: -9,
        borderRadius: '50%',
        background: 'var(--gradient-primary)',
        boxShadow: '0 4px 12px rgba(203,12,159,.35)',
        animation: 'gordaLmPulse 1.3s ease-in-out infinite'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '1.05rem',
        fontWeight: 700,
        color: 'var(--text-heading)',
        letterSpacing: '-0.01em',
        lineHeight: 1.2
      }
    }, message), sub && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: '.4rem',
        fontSize: '.8rem',
        fontWeight: 400,
        color: 'var(--text-muted)'
      }
    }, sub)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 4,
        overflow: 'hidden',
        background: 'var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "gorda-lm-seg",
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '28%',
        borderRadius: 4,
        background: 'var(--gradient-primary)',
        animation: 'gordaLmBar 1.25s cubic-bezier(.5,0,.3,1) infinite'
      }
    }))));
  }
  window.LoadingModal = LoadingModal;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/LoadingModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/LoginView.jsx
try { (() => {
// Login screen — gradient header card, centered form (mirrors the Vue Login.vue).
function LoginView({
  onLogin
}) {
  const {
    Button,
    Input,
    Alert
  } = window.GordaDesignSystem_019e24;
  const [email, setEmail] = React.useState('admin@gorda.co');
  const [pw, setPw] = React.useState('password');
  const [err, setErr] = React.useState(false);
  const submit = () => {
    if (!email || !pw) {
      setErr(true);
      return;
    }
    onLogin();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
      fontFamily: "'Open Sans', sans-serif",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 380
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'linear-gradient(310deg, #7928ca, #ff0080)',
      borderRadius: '1rem',
      padding: '2rem',
      textAlign: 'center',
      color: '#fff',
      marginBottom: '-2.5rem',
      boxShadow: '0 20px 27px 0 rgba(0,0,0,0.15)',
      position: 'relative',
      zIndex: 2,
      width: 'calc(100% - 3rem)',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "logo.png",
    alt: "Gorda",
    style: {
      width: 56,
      height: 56,
      borderRadius: '0.8rem',
      marginBottom: '0.5rem'
    }
  }), /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      color: '#fff',
      fontWeight: 700
    }
  }, "Welcome back"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0.25rem 0 0',
      fontSize: '0.85rem',
      opacity: 0.9
    }
  }, "Sign in to the Gorda admin panel")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: '1rem',
      boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)',
      padding: '3.5rem 2rem 2rem'
    }
  }, err && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '1rem'
    }
  }, /*#__PURE__*/React.createElement(Alert, {
    color: "danger",
    title: "Invalid credentials",
    onClose: () => setErr(false)
  }, "Check your email and password.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Email Address",
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "Enter email",
    icon: "fas fa-envelope"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    type: "password",
    value: pw,
    onChange: e => setPw(e.target.value),
    placeholder: "Enter password",
    icon: "fas fa-lock"
  }), /*#__PURE__*/React.createElement(Button, {
    color: "info",
    fullWidth: true,
    onClick: submit,
    style: {
      marginTop: '0.5rem'
    }
  }, "Sign in")))));
}
window.LoginView = LoginView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/LoginView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/ServicesView.jsx
try { (() => {
// Services view — always-visible create form + Pendientes / En curso / Historial tabs
function ServicesView() {
  const {
    Card,
    StatusBadge
  } = window.GordaDesignSystem_019e24;
  const data = window.GordaData;
  const [tab, setTab] = React.useState('pendings');
  const [form, setForm] = React.useState({
    countryCode: '+57',
    phone: '',
    name: '',
    startAddress: '',
    endAddress: '',
    comment: '',
    qty: '1'
  });
  const setField = (k, v) => setForm(f => ({
    ...f,
    [k]: v
  }));
  const handleCreate = () => {
    setForm({
      countryCode: '+57',
      phone: '',
      name: '',
      startAddress: '',
      endAddress: '',
      comment: '',
      qty: '1'
    });
  };
  const tabs = [{
    id: 'pendings',
    label: 'Pendientes',
    count: data.pendings.length
  }, {
    id: 'inProgress',
    label: 'En curso',
    count: data.inProgress.length
  }, {
    id: 'history',
    label: 'Historial',
    count: data.history.length
  }];

  /* ── shared micro-styles ── */
  const lbl = {
    display: 'block',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.05rem',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '0.3rem'
  };
  const inp = {
    width: '100%',
    background: 'var(--surface-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '0.45rem',
    color: 'var(--text-heading)',
    padding: '0.48rem 0.7rem',
    fontSize: '0.8rem',
    outline: 'none',
    fontFamily: "'Open Sans', sans-serif",
    transition: 'border-color 0.2s'
  };
  const th = {
    textAlign: 'left',
    textTransform: 'uppercase',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.04rem',
    color: 'var(--text-secondary)',
    padding: '0.65rem 0.9rem',
    borderBottom: '1px solid var(--border-subtle)'
  };
  const td = {
    padding: '0.72rem 0.9rem',
    fontSize: '0.8rem',
    color: 'var(--text-body)',
    borderBottom: '1px solid var(--border-subtle)',
    verticalAlign: 'middle'
  };
  const OriginBadge = ({
    origin
  }) => /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      fontSize: '0.7rem',
      fontWeight: 600,
      color: origin === 'bot' ? '#25d366' : 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: origin === 'bot' ? 'fa-brands fa-whatsapp' : 'fas fa-desktop'
  }), origin === 'bot' ? 'WhatsApp Bot' : 'Admin');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.875rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    }
  }, tabs.map(t => {
    const on = tab === t.id;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setTab(t.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.45rem 1rem',
        borderRadius: '0.5rem',
        border: on ? '1px solid var(--border-subtle)' : '1px solid transparent',
        cursor: 'pointer',
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '0.8rem',
        fontWeight: 700,
        background: on ? 'var(--surface-card)' : 'transparent',
        color: on ? 'var(--text-heading)' : 'var(--text-secondary)',
        boxShadow: on ? 'var(--shadow-sm)' : 'none',
        transition: 'all 0.18s'
      }
    }, t.label, /*#__PURE__*/React.createElement("span", {
      style: {
        background: on ? '#cb0c9f' : 'var(--border-subtle)',
        color: on ? '#fff' : 'var(--text-secondary)',
        borderRadius: '50rem',
        fontSize: '0.62rem',
        fontWeight: 700,
        padding: '0.08rem 0.42rem',
        minWidth: 18,
        textAlign: 'center'
      }
    }, t.count));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: '0.875rem',
      boxShadow: 'var(--shadow-card)',
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 3,
      background: 'linear-gradient(90deg, #7928ca, #ff0080)',
      borderRadius: '0.875rem 0.875rem 0 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0.9rem 1.25rem 1.1rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.875rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: '0.4rem',
      background: 'linear-gradient(310deg,#7928ca,#ff0080)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-plus",
    style: {
      fontSize: '0.65rem',
      color: '#fff'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      fontWeight: 700,
      color: 'var(--text-heading)',
      letterSpacing: '0.01rem'
    }
  }, "Crear servicio"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: '0.65rem',
      color: 'var(--text-muted)',
      background: 'var(--body-bg)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '0.35rem',
      padding: '0.15rem 0.5rem',
      fontWeight: 600
    }
  }, "Admin \xB7 5731731030")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '88px 148px 1fr 1fr 1fr 1fr 68px',
      gap: '0.625rem',
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "C\xF3digo"), /*#__PURE__*/React.createElement("select", {
    value: form.countryCode,
    onChange: e => setField('countryCode', e.target.value),
    style: inp
  }, /*#__PURE__*/React.createElement("option", {
    value: "+57"
  }, "+57 CO"), /*#__PURE__*/React.createElement("option", {
    value: "+1"
  }, "+1  US"), /*#__PURE__*/React.createElement("option", {
    value: "+52"
  }, "+52 MX"), /*#__PURE__*/React.createElement("option", {
    value: "+54"
  }, "+54 AR"), /*#__PURE__*/React.createElement("option", {
    value: "+58"
  }, "+58 VE"), /*#__PURE__*/React.createElement("option", {
    value: "+56"
  }, "+56 CL"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Tel\xE9fono"), /*#__PURE__*/React.createElement("input", {
    type: "tel",
    placeholder: "300 000 0000",
    value: form.phone,
    onChange: e => setField('phone', e.target.value),
    style: inp
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Nombre"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Nombre del pasajero",
    value: form.name,
    onChange: e => setField('name', e.target.value),
    style: inp
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Direcci\xF3n inicial"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Punto de recogida",
    value: form.startAddress,
    onChange: e => setField('startAddress', e.target.value),
    style: inp
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Direcci\xF3n final"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Destino (opcional)",
    value: form.endAddress,
    onChange: e => setField('endAddress', e.target.value),
    style: inp
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Comentario"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Nota adicional",
    value: form.comment,
    onChange: e => setField('comment', e.target.value),
    style: inp
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: lbl
  }, "Cant."), /*#__PURE__*/React.createElement("select", {
    value: form.qty,
    onChange: e => setField('qty', e.target.value),
    style: {
      ...inp,
      textAlign: 'center',
      cursor: 'pointer'
    }
  }, [1, 2, 3, 4, 5].map(n => /*#__PURE__*/React.createElement("option", {
    key: n,
    value: n
  }, n))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '0.75rem',
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleCreate,
    style: {
      background: 'linear-gradient(310deg,#7928ca,#ff0080)',
      color: '#fff',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.58rem 1.75rem',
      fontSize: '0.78rem',
      fontWeight: 700,
      letterSpacing: '0.06rem',
      cursor: 'pointer',
      fontFamily: "'Open Sans', sans-serif",
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.45rem',
      boxShadow: '0 4px 12px rgba(121,40,202,0.4)',
      transition: 'opacity 0.15s, transform 0.1s'
    },
    onMouseOver: e => {
      e.currentTarget.style.opacity = '0.88';
      e.currentTarget.style.transform = 'translateY(-1px)';
    },
    onMouseOut: e => {
      e.currentTarget.style.opacity = '1';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-paper-plane",
    style: {
      fontSize: '0.72rem'
    }
  }), "CREAR SERVICIO")))), /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      width: 44
    }
  }, "#"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, tab === 'history' ? 'Fecha' : 'Hora'), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Estado"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Dir. inicial"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Tel\xE9fono"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Nombre"), (tab === 'inProgress' || tab === 'history') && /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Conductor"), tab === 'pendings' && /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Comentario"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Origen"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }))), /*#__PURE__*/React.createElement("tbody", null, data[tab].map((s, i) => /*#__PURE__*/React.createElement("tr", {
    key: s.id,
    style: {
      transition: 'background 0.15s'
    },
    onMouseOver: e => e.currentTarget.style.background = 'var(--body-bg)',
    onMouseOut: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'center',
      position: 'relative',
      fontWeight: 700,
      color: 'var(--text-secondary)'
    }
  }, i + 1, tab === 'pendings' && s.applicants > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 6,
      right: 4,
      background: '#ea0606',
      color: '#fff',
      fontSize: '0.52rem',
      fontWeight: 700,
      borderRadius: '50%',
      width: 14,
      height: 14,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 6px rgba(234,6,6,0.4)'
    }
  }, s.applicants)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      whiteSpace: 'nowrap',
      fontVariantNumeric: 'tabular-nums'
    }
  }, tab === 'history' ? s.date : s.a_go), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: s.status
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      maxWidth: 160
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, s.start)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      whiteSpace: 'nowrap',
      fontWeight: 600,
      fontVariantNumeric: 'tabular-nums'
    }
  }, s.phone), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: 'var(--text-heading)',
      fontWeight: 600
    }
  }, s.name), tab === 'inProgress' && /*#__PURE__*/React.createElement("td", {
    style: td
  }, s.driver), tab === 'history' && /*#__PURE__*/React.createElement("td", {
    style: td
  }, s.driverName), tab === 'pendings' && /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      maxWidth: 140,
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, s.comment)), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(OriginBadge, {
    origin: s.origin
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right',
      whiteSpace: 'nowrap'
    }
  }, tab === 'pendings' && /*#__PURE__*/React.createElement("em", {
    className: "fas fa-pen",
    style: {
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      marginRight: 14,
      transition: 'color 0.15s'
    },
    onMouseOver: e => e.target.style.color = '#cb0c9f',
    onMouseOut: e => e.target.style.color = 'var(--text-secondary)',
    title: "Editar recogida"
  }), /*#__PURE__*/React.createElement("em", {
    className: "fas fa-ellipsis-vertical",
    style: {
      color: 'var(--text-secondary)',
      cursor: 'pointer'
    }
  }))))))));
}
window.ServicesView = ServicesView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/ServicesView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/SettingsView.jsx
try { (() => {
// ─── Settings View · Ajustes Generales · Tarifas · Mensajes ─────────────────

// ── Icon-button style factory ─────────────────────────────────────────────────
const sBtn = (bg, fg = '#fff', border) => ({
  width: 34,
  height: 34,
  flex: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.45rem',
  fontSize: '0.8rem',
  background: bg,
  color: fg,
  border: border ? '1px solid var(--border-color)' : 'none'
});

// ── Section card ──────────────────────────────────────────────────────────────
function SCard({
  title,
  action,
  children,
  noPad,
  style: extraStyle
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: '1rem',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
      ...extraStyle
    }
  }, (title || action) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.1rem 1.25rem 0'
    }
  }, title && /*#__PURE__*/React.createElement("h6", {
    style: {
      margin: 0,
      fontSize: '0.9rem',
      fontWeight: 800,
      color: 'var(--text-heading)',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, title), action), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: noPad ? 0 : '1.25rem'
    }
  }, children));
}

// ── Inline-editable field ─────────────────────────────────────────────────────
function EField({
  label,
  value,
  onChange,
  locked
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value != null ? String(value) : '');
  const ref = React.useRef(null);
  const activate = () => {
    if (locked) return;
    setDraft(value != null ? String(value) : '');
    setEditing(true);
    setTimeout(() => ref.current && ref.current.focus(), 10);
  };
  const commit = () => {
    setEditing(false);
    onChange && onChange(draft);
  };
  const cancel = () => {
    setEditing(false);
    setDraft(value != null ? String(value) : '');
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.68rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: 'var(--text-secondary)',
      marginBottom: 5,
      fontFamily: "'Open Sans', sans-serif"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: ref,
    value: draft,
    onChange: e => setDraft(e.target.value),
    readOnly: !editing || locked,
    onKeyDown: e => {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') cancel();
    },
    style: {
      flex: 1,
      padding: '0.48rem 0.65rem',
      background: 'var(--surface-input)',
      border: `1px solid ${editing ? '#17c1e8' : 'var(--border-color)'}`,
      borderRadius: '0.45rem',
      outline: 'none',
      color: 'var(--text-heading)',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.875rem',
      cursor: editing && !locked ? 'text' : 'default',
      transition: 'border-color 0.15s',
      opacity: locked ? 0.6 : 1
    }
  }), locked ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...sBtn('transparent', 'var(--text-muted)'),
      border: '1px solid var(--border-color)'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-ban"
  })) : editing ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: commit,
    style: sBtn('#17c1e8')
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-check"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: cancel,
    style: sBtn('transparent', 'var(--text-body)', true)
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-xmark"
  }))) : /*#__PURE__*/React.createElement("button", {
    onClick: activate,
    style: sBtn('#17c1e8')
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-pencil"
  }))));
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function SToggle({
  on,
  onChange
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(!on),
    style: {
      width: 40,
      height: 22,
      borderRadius: 11,
      border: 'none',
      cursor: 'pointer',
      background: on ? 'linear-gradient(310deg,#17ad37,#98ec2d)' : 'var(--surface-input)',
      boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--border-color)',
      position: 'relative',
      padding: 0,
      flexShrink: 0,
      transition: 'background 0.2s'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: on ? 21 : 3,
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 1px 4px rgba(0,0,0,.3)',
      transition: 'left 0.18s ease'
    }
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1 · Ajustes Generales
// ─────────────────────────────────────────────────────────────────────────────
function SettTab1() {
  const [cities, setCities] = React.useState([{
    id: 'c1',
    nombre: 'Popayán',
    activa: true,
    pct: 10
  }, {
    id: 'c2',
    nombre: 'Cali',
    activa: true,
    pct: 12
  }, {
    id: 'c3',
    nombre: 'Bogotá',
    activa: false,
    pct: 8
  }]);
  const [editId, setEditId] = React.useState(null);
  const [pctDraft, setPctDraft] = React.useState('');
  const startEdit = c => {
    setEditId(c.id);
    setPctDraft(String(c.pct));
  };
  const commitPct = id => {
    setCities(cs => cs.map(c => c.id === id ? {
      ...c,
      pct: parseFloat(pctDraft) || c.pct
    } : c));
    setEditId(null);
  };
  return /*#__PURE__*/React.createElement(SCard, {
    title: "Sucursales",
    action: /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '0.4rem 1rem',
        background: 'var(--gradient-primary)',
        border: 'none',
        borderRadius: '0.45rem',
        color: '#fff',
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '0.8rem',
        fontWeight: 700,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("em", {
      className: "fas fa-plus"
    }), " Agregar sucursal")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-subtle)',
      borderRadius: '0.75rem',
      padding: '1.1rem 1.25rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.9rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid var(--border-subtle)',
      marginBottom: '1rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '2.6rem',
      lineHeight: 1,
      flexShrink: 0
    }
  }, "\uD83C\uDDE8\uD83C\uDDF4"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.3rem',
      fontWeight: 800,
      color: 'var(--text-heading)',
      fontFamily: "'Open Sans', sans-serif",
      lineHeight: 1.1,
      marginBottom: 8
    }
  }, "Colombia"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '2rem',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.68rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: 'var(--text-secondary)',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, "C\xF3digo de Llamada"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.9rem',
      fontWeight: 800,
      color: 'var(--text-heading)',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, "+57")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.68rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: 'var(--text-secondary)',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, "C\xF3digo de Moneda"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.9rem',
      fontWeight: 800,
      color: 'var(--text-heading)',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, "COP"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: 'var(--text-secondary)',
      fontFamily: "'Open Sans', sans-serif",
      marginBottom: '0.6rem'
    }
  }, "Ciudades"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.45rem'
    }
  }, cities.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.6rem 0.9rem',
      borderRadius: '0.55rem',
      background: 'var(--surface-input)',
      border: '1px solid var(--border-color)',
      transition: 'border-color 0.15s'
    }
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: c.activa,
    onChange: () => setCities(cs => cs.map(x => x.id === c.id ? {
      ...x,
      activa: !x.activa
    } : x))
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontWeight: 700,
      color: 'var(--text-heading)',
      fontSize: '0.88rem',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, c.nombre), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      color: 'var(--text-secondary)',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, "Porcentaje actual"), editId === c.id ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: pctDraft,
    onChange: e => setPctDraft(e.target.value),
    autoFocus: true,
    onKeyDown: e => {
      if (e.key === 'Enter') commitPct(c.id);
      if (e.key === 'Escape') setEditId(null);
    },
    style: {
      width: 54,
      padding: '0.28rem 0.45rem',
      textAlign: 'center',
      background: 'var(--surface-input)',
      border: '1px solid #17c1e8',
      borderRadius: '0.35rem',
      color: 'var(--text-heading)',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.9rem',
      fontWeight: 800,
      outline: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--text-secondary)',
      fontSize: '0.85rem'
    }
  }, "%"), /*#__PURE__*/React.createElement("button", {
    onClick: () => commitPct(c.id),
    style: sBtn('#17c1e8')
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-check"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditId(null),
    style: sBtn('transparent', 'var(--text-body)', true)
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-xmark"
  }))) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      color: 'var(--primary)',
      fontSize: '1.05rem',
      minWidth: 32,
      textAlign: 'right',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, c.pct, "%")), editId !== c.id && /*#__PURE__*/React.createElement("button", {
    onClick: () => startEdit(c),
    style: sBtn('#17c1e8')
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-pencil"
  })))))));
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2 · Tarifas
// ─────────────────────────────────────────────────────────────────────────────
function SettTab2({
  onSave
}) {
  const [base, setBase] = React.useState({
    precioKm: '800',
    precioMin: '190',
    tarifaBase: '2400',
    adicionales: '500',
    tarifaMinActual: '6500',
    multiplicador: '1,1',
    nocturno: '1,1',
    domingosFestivos: '1,1',
    domingosFestivosNocturnos: '1,15'
  });
  const [minDin, setMinDin] = React.useState({
    diurna: '6500',
    nocturna: '6500',
    festivaDiurna: '6500',
    festivaNocturna: '6500'
  });
  const [mults, setMults] = React.useState([{
    id: 1,
    nombre: 'Hora pico Mañana',
    valor: '1.1',
    inicio: '06:00',
    fin: '08:00'
  }, {
    id: 2,
    nombre: 'Medio Día',
    valor: '1.1',
    inicio: '12:00',
    fin: '14:00'
  }, {
    id: 3,
    nombre: 'Hora pico Tarde',
    valor: '1.2',
    inicio: '17:00',
    fin: '19:00'
  }]);
  const nextId = React.useRef(4);
  const updBase = k => v => setBase(b => ({
    ...b,
    [k]: v
  }));
  const updMin = k => v => setMinDin(m => ({
    ...m,
    [k]: v
  }));
  const updMult = (id, k, v) => setMults(ms => ms.map(m => m.id === id ? {
    ...m,
    [k]: v
  } : m));
  const delMult = id => setMults(ms => ms.filter(m => m.id !== id));
  const addMult = () => {
    setMults(ms => [...ms, {
      id: nextId.current++,
      nombre: 'Nueva franja',
      valor: '1.0',
      inicio: '08:00',
      fin: '10:00'
    }]);
  };
  const EnviarBtn = ({
    label
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: () => onSave(label + ' guardado'),
    style: {
      padding: '0.55rem 2rem',
      background: 'var(--gradient-primary)',
      border: 'none',
      borderRadius: '0.5rem',
      color: '#fff',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.75rem',
      fontWeight: 800,
      cursor: 'pointer',
      letterSpacing: '0.08em'
    }
  }, "ENVIAR");
  const inputTime = {
    padding: '0.3rem 0.5rem',
    background: 'var(--surface-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '0.4rem',
    color: 'var(--text-heading)',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '0.8rem',
    outline: 'none'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement(SCard, {
    title: "Tarifas Base"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.85rem'
    }
  }, /*#__PURE__*/React.createElement(EField, {
    label: "Precio por Kil\xF3metro",
    value: base.precioKm,
    onChange: updBase('precioKm')
  }), /*#__PURE__*/React.createElement(EField, {
    label: "Precio por Minuto",
    value: base.precioMin,
    onChange: updBase('precioMin')
  }), /*#__PURE__*/React.createElement(EField, {
    label: "Tarifa Base",
    value: base.tarifaBase,
    onChange: updBase('tarifaBase')
  }), /*#__PURE__*/React.createElement(EField, {
    label: "Tarifas Adicionales",
    value: base.adicionales,
    onChange: updBase('adicionales')
  }), /*#__PURE__*/React.createElement(EField, {
    label: "Tarifa M\xEDnima Actual",
    value: base.tarifaMinActual,
    locked: true
  }), /*#__PURE__*/React.createElement(EField, {
    label: "Multiplicador",
    value: base.multiplicador,
    onChange: updBase('multiplicador')
  }), /*#__PURE__*/React.createElement(EField, {
    label: "Nocturno",
    value: base.nocturno,
    onChange: updBase('nocturno')
  }), /*#__PURE__*/React.createElement(EField, {
    label: "Domingos y Festivos",
    value: base.domingosFestivos,
    onChange: updBase('domingosFestivos')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement(EField, {
    label: "Domingos y Festivos Nocturnos",
    value: base.domingosFestivosNocturnos,
    onChange: updBase('domingosFestivosNocturnos')
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1.1rem',
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(EnviarBtn, {
    label: "Tarifas base"
  }))), /*#__PURE__*/React.createElement(SCard, {
    title: "Tarifa M\xEDnima Din\xE1mica"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.85rem'
    }
  }, /*#__PURE__*/React.createElement(EField, {
    label: "Tarifa M\xEDnima Diurna",
    value: minDin.diurna,
    onChange: updMin('diurna')
  }), /*#__PURE__*/React.createElement(EField, {
    label: "Tarifa M\xEDnima Nocturna",
    value: minDin.nocturna,
    onChange: updMin('nocturna')
  }), /*#__PURE__*/React.createElement(EField, {
    label: "Tarifa M\xEDnima Festiva Diurna",
    value: minDin.festivaDiurna,
    onChange: updMin('festivaDiurna')
  }), /*#__PURE__*/React.createElement(EField, {
    label: "Tarifa M\xEDnima Festiva Nocturna",
    value: minDin.festivaNocturna,
    onChange: updMin('festivaNocturna')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1.1rem',
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(EnviarBtn, {
    label: "Tarifa m\xEDnima din\xE1mica"
  })))), /*#__PURE__*/React.createElement(SCard, {
    title: "Multiplicador Din\xE1mico de Tarifa",
    action: /*#__PURE__*/React.createElement("button", {
      onClick: addMult,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '0.4rem 1rem',
        background: 'var(--gradient-primary)',
        border: 'none',
        borderRadius: '0.45rem',
        color: '#fff',
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '0.8rem',
        fontWeight: 700,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("em", {
      className: "fas fa-plus"
    }), " Agregar franja")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.65rem'
    }
  }, mults.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '2rem',
      color: 'var(--text-muted)',
      fontSize: '0.85rem',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, "No hay franjas configuradas"), mults.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.85rem',
      background: 'var(--surface-input)',
      borderRadius: '0.65rem',
      padding: '0.85rem 1rem',
      border: '1px solid var(--border-color)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.55rem'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: m.nombre,
    onChange: e => updMult(m.id, 'nombre', e.target.value),
    style: {
      background: 'transparent',
      border: 'none',
      outline: 'none',
      fontWeight: 700,
      color: 'var(--text-heading)',
      fontSize: '0.9rem',
      fontFamily: "'Open Sans', sans-serif",
      cursor: 'text',
      padding: 0,
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '0.18rem 0.6rem',
      borderRadius: '0.4rem',
      flexShrink: 0,
      background: 'var(--gradient-primary)',
      color: '#fff',
      fontSize: '0.75rem',
      fontWeight: 800
    }
  }, m.valor)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.68rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: 'var(--text-secondary)',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, "Horarios"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: m.inicio,
    onChange: e => updMult(m.id, 'inicio', e.target.value),
    style: inputTime
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontWeight: 700
    }
  }, "\u2013"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: m.fin,
    onChange: e => updMult(m.id, 'fin', e.target.value),
    style: inputTime
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => delMult(m.id),
    style: sBtn('#ea0606')
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-trash"
  })))))));
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3 · Mensajes
// ─────────────────────────────────────────────────────────────────────────────
function SettTab3() {
  const [grupos, setGrupos] = React.useState([{
    id: 'conf',
    titulo: 'Mensajes de Confirmación',
    items: [{
      key: 'cancelaciones',
      nombre: 'Cancelaciones',
      comentario: 'Cuando no se ha asignado un conductor',
      mensaje: '_Que pena contigo_ 😔 ...',
      habilitado: true
    }, {
      key: 'cancelado',
      nombre: 'Cancelado',
      comentario: 'Cuando un servicio es cancelado',
      mensaje: 'se ha cancelado tu solicitud...',
      habilitado: false
    }, {
      key: 'conductor_llegado',
      nombre: 'Conductor ha llegado',
      comentario: 'Cuando el conductor llega al punto',
      mensaje: '¡Tu conductor ha llegado...',
      habilitado: true
    }, {
      key: 'asignado',
      nombre: 'Servicio asignado',
      comentario: 'Cuando un conductor es asignado',
      mensaje: 'Placa 🚗 *[[PLATE]]* col...',
      habilitado: true
    }, {
      key: 'terminado',
      nombre: 'Servicio terminado',
      comentario: 'Cuando el servicio es terminado',
      mensaje: 'Servicio completado! Gr...',
      habilitado: false
    }, {
      key: 'creado',
      nombre: 'Servicio creado',
      comentario: 'Cuando se crea el servicio',
      mensaje: '*Con gusto!* 😊 en un ...',
      habilitado: true
    }]
  }, {
    id: 'bot',
    titulo: 'Chatbot Mensajes',
    items: [{
      key: 'cancelar_sin_c',
      nombre: 'Cancelar si no hay conductor',
      comentario: 'Solicita cancelar el servicio',
      mensaje: '🔍 Seguimos buscando...',
      habilitado: false
    }, {
      key: 'cancelar_asignado',
      nombre: 'Cancelar en estado asignado',
      comentario: 'Cuando el cliente escribe para cancelar',
      mensaje: 'Tu conductor está en ca...',
      habilitado: false
    }, {
      key: 'preg_ubicacion',
      nombre: 'Preguntar por la ubicación',
      comentario: 'Pregunta por la ubicación de recogida',
      mensaje: '*[[USERNAME]]*, por fa...',
      habilitado: true
    }, {
      key: 'nombre_ubicacion',
      nombre: 'Nombre de la ubicación',
      comentario: 'Cuando el usuario envía su ubicación',
      mensaje: '✅ *Ya tenemos tu ubic...',
      habilitado: true
    }]
  }]);
  const toggle = (gid, key) => setGrupos(gs => gs.map(g => g.id !== gid ? g : {
    ...g,
    items: g.items.map(it => it.key === key ? {
      ...it,
      habilitado: !it.habilitado
    } : it)
  }));
  const C = {
    nom: '22%',
    com: '27%',
    msg: '27%',
    st: '16%',
    act: '8%'
  };
  const th = txt => /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.64rem',
      fontWeight: 800,
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, txt);
  return /*#__PURE__*/React.createElement(SCard, {
    title: "Tabla de Mensajes WhatsApp",
    noPad: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      padding: '0.85rem 1.25rem 0.7rem',
      borderBottom: '2px solid var(--border-subtle)',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: C.nom
    }
  }, th('Nombre')), /*#__PURE__*/React.createElement("div", {
    style: {
      width: C.com
    }
  }, th('Comentario')), /*#__PURE__*/React.createElement("div", {
    style: {
      width: C.msg
    }
  }, th('Mensajes')), /*#__PURE__*/React.createElement("div", {
    style: {
      width: C.st
    }
  }, th('Estado')), /*#__PURE__*/React.createElement("div", {
    style: {
      width: C.act
    }
  }, th('Acciones'))), grupos.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0.8rem 1.25rem 0.3rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 15,
      borderRadius: 2,
      background: 'var(--gradient-primary)',
      flexShrink: 0,
      display: 'inline-block'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.82rem',
      fontWeight: 800,
      color: 'var(--text-heading)',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, g.titulo)), g.items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: it.key,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0.65rem 1.25rem',
      borderTop: '1px solid var(--border-subtle)',
      background: i % 2 === 1 ? 'var(--surface-input)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: C.nom,
      fontSize: '0.85rem',
      fontWeight: 600,
      color: 'var(--text-heading)',
      fontFamily: "'Open Sans', sans-serif",
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      paddingRight: 8
    }
  }, it.nombre), /*#__PURE__*/React.createElement("div", {
    style: {
      width: C.com,
      fontSize: '0.78rem',
      color: 'var(--text-body)',
      fontFamily: "'Open Sans', sans-serif",
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      paddingRight: 8
    }
  }, it.comentario), /*#__PURE__*/React.createElement("div", {
    style: {
      width: C.msg,
      fontSize: '0.78rem',
      color: 'var(--text-secondary)',
      fontFamily: "'Open Sans', sans-serif",
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      paddingRight: 8,
      fontStyle: 'italic'
    }
  }, it.mensaje), /*#__PURE__*/React.createElement("div", {
    style: {
      width: C.st,
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      flexWrap: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: it.habilitado,
    onChange: () => toggle(g.id, it.key)
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '0.18rem 0.48rem',
      borderRadius: '0.4rem',
      flexShrink: 0,
      fontSize: '0.6rem',
      fontWeight: 800,
      letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
      fontFamily: "'Open Sans', sans-serif",
      background: it.habilitado ? 'var(--badge-success-bg)' : 'var(--badge-danger-bg)',
      color: it.habilitado ? 'var(--badge-success-fg)' : 'var(--badge-danger-fg)'
    }
  }, it.habilitado ? 'HABILITADO' : 'INHABILITADO')), /*#__PURE__*/React.createElement("div", {
    style: {
      width: C.act
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: sBtn('#17c1e8')
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-pencil"
  }))))))));
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN · SettingsView
// ─────────────────────────────────────────────────────────────────────────────
function SettingsView() {
  const [tab, setTab] = React.useState('general');
  const [toast, setToast] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const timerRef = React.useRef(null);
  const showToast = msg => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(msg);
    timerRef.current = setTimeout(() => setToast(null), 2800);
  };

  // Simulate a save: show loading overlay for 1.8 s then toast
  const handleSave = msg => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(msg);
    }, 1800);
  };
  const TABS = [{
    id: 'general',
    label: 'Ajustes Generales',
    icon: 'fas fa-sliders'
  }, {
    id: 'tarifas',
    label: 'Tarifas',
    icon: 'fas fa-dollar-sign'
  }, {
    id: 'mensajes',
    label: 'Mensajes',
    icon: 'fas fa-envelope'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Open Sans', sans-serif"
    }
  }, toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 24,
      right: 24,
      zIndex: 9999,
      background: 'var(--gradient-success)',
      color: '#fff',
      borderRadius: '0.75rem',
      padding: '0.7rem 1.2rem',
      boxShadow: '0 8px 24px rgba(23,173,55,0.35)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.85rem',
      fontWeight: 700,
      fontFamily: "'Open Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-check-circle"
  }), toast), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderBottom: '2px solid var(--border-subtle)',
      marginBottom: '1.5rem'
    }
  }, TABS.map(t => {
    const active = tab === t.id;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setTab(t.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.65rem 1.3rem',
        background: 'transparent',
        border: 'none',
        borderBottom: `2px solid ${active ? 'var(--primary)' : 'transparent'}`,
        marginBottom: -2,
        cursor: 'pointer',
        color: active ? 'var(--primary)' : 'var(--text-body)',
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '0.85rem',
        fontWeight: active ? 700 : 500,
        whiteSpace: 'nowrap',
        transition: 'color 0.15s, border-color 0.15s'
      }
    }, /*#__PURE__*/React.createElement("em", {
      className: t.icon,
      style: {
        fontSize: '0.78rem'
      }
    }), t.label);
  })), /*#__PURE__*/React.createElement(LoadingModal, {
    open: loading
  }), tab === 'general' && /*#__PURE__*/React.createElement(SettTab1, {
    onSave: handleSave
  }), tab === 'tarifas' && /*#__PURE__*/React.createElement(SettTab2, {
    onSave: handleSave
  }), tab === 'mensajes' && /*#__PURE__*/React.createElement(SettTab3, null));
}
window.SettingsView = SettingsView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/SettingsView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/Sidebar.jsx
try { (() => {
// Gorda admin sidebar — floating rounded-xl card, Soft UI nav with icon chips.
function Sidebar({
  active,
  onNavigate
}) {
  const {
    user,
    nav
  } = window.GordaData;
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      bottom: '1rem',
      width: 240,
      background: 'var(--surface-card)',
      borderRadius: '1rem',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem 0.75rem',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      padding: '0.25rem 0.5rem 0.75rem'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "logo.png",
    alt: "Gorda",
    style: {
      width: 34,
      height: 34,
      borderRadius: '0.6rem'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: '0.9rem',
      color: 'var(--text-heading)'
    }
  }, user.name)), /*#__PURE__*/React.createElement("hr", {
    style: {
      border: 0,
      borderTop: '1px solid var(--border-subtle)',
      margin: '0 0.25rem 0.75rem'
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      overflowY: 'auto'
    }
  }, nav.map(item => {
    const isActive = active === item.id;
    return /*#__PURE__*/React.createElement("a", {
      key: item.id,
      href: "#",
      onClick: e => {
        e.preventDefault();
        onNavigate(item.id);
      },
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.7rem',
        padding: '0.55rem 0.6rem',
        borderRadius: '0.5rem',
        textDecoration: 'none',
        background: isActive ? 'var(--surface-input)' : 'transparent',
        boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
        transition: 'all 0.15s ease'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 32,
        height: 32,
        flex: 'none',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isActive ? 'linear-gradient(310deg, #7928ca, #ff0080)' : 'var(--surface-input)',
        boxShadow: '0 2px 9px -5px rgba(0,0,0,0.4), 0 0 1px rgba(0,0,0,0.08)',
        color: isActive ? '#fff' : '#cb0c9f',
        fontSize: '0.8rem',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("em", {
      className: item.icon
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.85rem',
        fontWeight: isActive ? 700 : 600,
        color: isActive ? 'var(--text-heading)' : 'var(--text-body)',
        position: 'relative'
      }
    }, item.id === 'whatsapp' ? item.status ? 'Connected' : 'Disconnected' : item.label, item.id === 'whatsapp' && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 2,
        right: -14,
        width: 8,
        height: 8,
        borderRadius: '50%',
        border: '1.5px solid var(--surface-card)',
        background: item.status ? '#82d616' : '#ea0606'
      }
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
      padding: '0.55rem 0.6rem',
      borderRadius: '0.5rem',
      textDecoration: 'none',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      flex: 'none',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface-input)',
      boxShadow: '0 2px 9px -5px rgba(0,0,0,0.4), 0 0 1px rgba(0,0,0,0.08)',
      color: '#ea0606',
      fontSize: '0.8rem'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-sign-out-alt"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.85rem',
      fontWeight: 600
    }
  }, "Log out")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: '0.65rem',
      color: 'var(--text-muted)',
      marginTop: '0.5rem',
      fontWeight: 700
    }
  }, "version 2.0.5")));
}
window.Sidebar = Sidebar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/TopNav.jsx
try { (() => {
// Gorda admin top navbar — breadcrumb + page title, search, theme toggle, icons.
function TopNav({
  title,
  breadcrumb,
  theme,
  onToggleTheme
}) {
  const isDark = theme === 'dark';
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.5rem 0',
      margin: '0 0 1.25rem',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.6
    }
  }, "Pages"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: '0 0.4rem',
      opacity: 0.5
    }
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-heading)',
      fontWeight: 600
    }
  }, breadcrumb || title)), /*#__PURE__*/React.createElement("h6", {
    style: {
      margin: '0.15rem 0 0',
      fontSize: '1rem',
      fontWeight: 700,
      color: 'var(--text-heading)'
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'var(--surface-input)',
      border: '1px solid var(--border-color)',
      borderRadius: '0.5rem',
      padding: '0.45rem 0.75rem',
      width: 200
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-magnifying-glass",
    style: {
      color: 'var(--text-secondary)',
      fontSize: '0.8rem'
    }
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search...",
    style: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'inherit',
      fontSize: '0.8rem',
      color: 'var(--text-body)',
      width: '100%'
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onToggleTheme,
    title: isDark ? 'Switch to light mode' : 'Switch to dark mode',
    style: {
      width: 36,
      height: 36,
      borderRadius: '0.5rem',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: isDark ? '#fbcf33' : '#344767',
      fontSize: '0.95rem',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 9px -5px rgba(0,0,0,0.3)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: isDark ? 'fas fa-sun' : 'fas fa-moon'
  })), /*#__PURE__*/React.createElement("em", {
    className: "fas fa-bell",
    style: {
      color: 'var(--text-heading)',
      fontSize: '1rem',
      cursor: 'pointer'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "redblanca.jpg",
    alt: "branch",
    style: {
      width: 34,
      height: 34,
      borderRadius: '50%',
      objectFit: 'cover',
      boxShadow: '0 2px 9px -5px rgba(0,0,0,0.4)'
    }
  })));
}
window.TopNav = TopNav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/TopNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/VehicleDetailView.jsx
try { (() => {
// Vehicle detail view — info card + linked drivers with selectable toggles.
function VehicleDetailView({
  vehicle: initialVehicle,
  onBack
}) {
  const {
    Card,
    Badge,
    Button,
    Switch
  } = window.GordaDesignSystem_019e24;
  const [vehicle, setVehicle] = React.useState(initialVehicle);
  function toggleSelectable(driverId, newVal) {
    setVehicle(v => ({
      ...v,
      linkedDrivers: v.linkedDrivers.map(d => d.id === driverId ? {
        ...d,
        selectable: newVal
      } : d)
    }));
  }

  // Expiry status helper
  function expiryStatus(dateStr) {
    if (!dateStr || dateStr === '—') return 'neutral';
    const exp = new Date(dateStr);
    const now = new Date();
    const diff = (exp - now) / (1000 * 60 * 60 * 24); // days
    if (diff < 0) return 'expired';
    if (diff < 30) return 'warning';
    return 'ok';
  }
  function ExpiryBadge({
    date
  }) {
    const status = expiryStatus(date);
    const cfg = {
      expired: {
        bg: '#fde0e0',
        fg: '#b30505',
        icon: 'fas fa-triangle-exclamation',
        label: 'Vencido'
      },
      warning: {
        bg: '#fef6d8',
        fg: '#9a7b00',
        icon: 'fas fa-clock',
        label: 'Por vencer'
      },
      ok: {
        bg: '#eafad0',
        fg: '#4d8b00',
        icon: 'fas fa-check',
        label: null
      },
      neutral: {
        bg: 'var(--surface-input)',
        fg: 'var(--text-secondary)',
        icon: null,
        label: null
      }
    }[status];
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: 'var(--text-heading)'
      }
    }, date || '—', cfg.icon && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.1rem 0.45rem',
        borderRadius: '50rem',
        background: cfg.bg,
        color: cfg.fg,
        fontSize: '0.62rem',
        fontWeight: 700
      }
    }, /*#__PURE__*/React.createElement("em", {
      className: cfg.icon
    }), cfg.label));
  }

  // ── table styles ──────────────────────────────────────────────────────────
  const thD = {
    textAlign: 'left',
    textTransform: 'uppercase',
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: 'var(--text-secondary)',
    padding: '0.55rem 1rem',
    borderBottom: '1px solid var(--border-subtle)',
    background: 'var(--body-bg)'
  };
  const tdKey = {
    padding: '0.65rem 1rem',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-subtle)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    width: '42%',
    whiteSpace: 'nowrap'
  };
  const tdVal = {
    padding: '0.65rem 1rem',
    fontSize: '0.82rem',
    color: 'var(--text-heading)',
    borderBottom: '1px solid var(--border-subtle)'
  };
  const thL = {
    textAlign: 'left',
    textTransform: 'uppercase',
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    color: 'var(--text-secondary)',
    padding: '0.55rem 1rem',
    borderBottom: '1px solid var(--border-subtle)',
    background: 'var(--body-bg)'
  };
  const tdL = {
    padding: '0.65rem 1rem',
    fontSize: '0.8rem',
    color: 'var(--text-heading)',
    borderBottom: '1px solid var(--border-subtle)',
    verticalAlign: 'middle'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Open Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.6
    }
  }, "Veh\xEDculos"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: '0 0.4rem',
      opacity: 0.5
    }
  }, "/"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-heading)',
      fontWeight: 600
    }
  }, vehicle.plate)), /*#__PURE__*/React.createElement("h6", {
    style: {
      margin: '0.1rem 0 0',
      fontSize: '1rem',
      fontWeight: 700,
      color: 'var(--text-heading)'
    }
  }, vehicle.brand, " ", vehicle.model)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.45rem 1.1rem',
      borderRadius: '0.5rem',
      border: 'none',
      background: 'linear-gradient(310deg,#2152ff,#21d4fd)',
      color: '#fff',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.78rem',
      fontWeight: 700,
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(33,82,255,0.35)',
      transition: 'opacity 0.15s',
      letterSpacing: '0.02em'
    },
    onMouseEnter: e => e.currentTarget.style.opacity = '0.88',
    onMouseLeave: e => e.currentTarget.style.opacity = '1'
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-arrow-left"
  }), "REGRESAR"), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.45rem 1.1rem',
      borderRadius: '0.5rem',
      border: '1.5px solid #cb0c9f',
      background: 'transparent',
      color: '#cb0c9f',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.78rem',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.15s',
      letterSpacing: '0.02em'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = '#cb0c9f';
      e.currentTarget.style.color = '#fff';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = '#cb0c9f';
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-pencil"
  }), "EDITAR"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.3fr',
      gap: '1.25rem',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '1rem 1.25rem 0.75rem',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: '0.45rem',
      flex: 'none',
      background: 'linear-gradient(310deg,#7928ca,#ff0080)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-car-side"
  })), /*#__PURE__*/React.createElement("h6", {
    style: {
      margin: 0,
      fontSize: '0.9rem',
      fontWeight: 700,
      color: 'var(--text-heading)'
    }
  }, "Detalle del Veh\xEDculo")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '1.25rem auto',
      width: 180,
      height: 140,
      borderRadius: '0.75rem',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      background: 'var(--surface-input)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, vehicle.photoUrl ? /*#__PURE__*/React.createElement("img", {
    src: vehicle.photoUrl,
    alt: vehicle.plate,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-car-side",
    style: {
      fontSize: '3.5rem',
      opacity: 0.25
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.65rem',
      marginTop: '0.4rem',
      opacity: 0.4
    }
  }, "Sin foto"))), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("tbody", null, [{
    key: 'Placa',
    val: /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 800,
        color: '#cb0c9f',
        letterSpacing: '0.06em'
      }
    }, vehicle.plate)
  }, {
    key: 'Marca',
    val: vehicle.brand
  }, {
    key: 'Modelo',
    val: vehicle.model
  }, {
    key: 'Año',
    val: vehicle.year
  }, {
    key: 'Color',
    val: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 14,
        height: 14,
        borderRadius: '50%',
        flex: 'none',
        background: vehicle.color?.hex || '#ccc',
        border: '1.5px solid var(--border-color)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }
    }), vehicle.color?.name ?? '—')
  }, {
    key: 'Estado',
    val: /*#__PURE__*/React.createElement(Badge, {
      color: vehicle.enabled ? 'success' : 'danger',
      variant: "solid"
    }, vehicle.enabled ? 'HABILITADO' : 'INHABILITADO')
  }, {
    key: 'Venc. SOAT',
    val: /*#__PURE__*/React.createElement(ExpiryBadge, {
      date: vehicle.soat
    })
  }, {
    key: 'Venc. Tec-Mec',
    val: /*#__PURE__*/React.createElement(ExpiryBadge, {
      date: vehicle.tec
    })
  }].map(({
    key,
    val
  }) => /*#__PURE__*/React.createElement("tr", {
    key: key
  }, /*#__PURE__*/React.createElement("td", {
    style: tdKey
  }, key), /*#__PURE__*/React.createElement("td", {
    style: tdVal
  }, val)))))), /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '1rem 1.25rem 0.75rem',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: '0.45rem',
      flex: 'none',
      background: 'linear-gradient(310deg,#17ad37,#98ec2d)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-users"
  })), /*#__PURE__*/React.createElement("h6", {
    style: {
      margin: 0,
      fontSize: '0.9rem',
      fontWeight: 700,
      color: 'var(--text-heading)'
    }
  }, "Conductores Vinculados"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      background: 'var(--surface-input)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '50rem',
      padding: '0.1rem 0.6rem',
      fontSize: '0.7rem',
      fontWeight: 700,
      color: 'var(--text-secondary)'
    }
  }, vehicle.linkedDrivers.length)), vehicle.linkedDrivers.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '3rem 1.5rem',
      textAlign: 'center',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-users-slash",
    style: {
      fontSize: '2rem',
      opacity: 0.25,
      display: 'block',
      marginBottom: '0.75rem'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '0.82rem'
    }
  }, "No hay conductores vinculados a este veh\xEDculo.")) : /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: thL
  }, "Nombre"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...thL,
      textAlign: 'right'
    }
  }, "Seleccionable"))), /*#__PURE__*/React.createElement("tbody", null, vehicle.linkedDrivers.map(d => /*#__PURE__*/React.createElement("tr", {
    key: d.id,
    style: {
      transition: 'background 0.1s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-input)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("td", {
    style: tdL
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      flex: 'none',
      background: 'linear-gradient(310deg,#7928ca,#ff0080)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '0.65rem',
      fontWeight: 700
    }
  }, d.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: '0.82rem'
    }
  }, d.name))), /*#__PURE__*/React.createElement("td", {
    style: {
      ...tdL,
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    checked: d.selectable,
    onChange: val => toggleSelectable(d.id, val)
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0.75rem 1rem',
      padding: '0.6rem 0.85rem',
      background: 'var(--body-bg)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem',
      fontSize: '0.73rem',
      color: 'var(--text-secondary)',
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-circle-info",
    style: {
      color: '#17c1e8',
      marginTop: '0.1rem',
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Activa ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-heading)'
    }
  }, "Seleccionable"), " para que el conductor pueda usar este veh\xEDculo al aceptar servicios. Solo un conductor puede tener el veh\xEDculo activo a la vez.")))));
}
window.VehicleDetailView = VehicleDetailView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/VehicleDetailView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/VehiclesView.jsx
try { (() => {
// Vehicles index view — searchable + sortable table with status filter & row actions.
function VehiclesView({
  onViewVehicle
}) {
  const {
    Card,
    Badge,
    Button
  } = window.GordaDesignSystem_019e24;
  const data = window.GordaData;
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [sortField, setSortField] = React.useState('plate');
  const [sortDir, setSortDir] = React.useState('asc');
  const [page, setPage] = React.useState(1);
  const perPage = 8;
  const vehicles = data.vehicles || [];

  // ── filter + sort ─────────────────────────────────────────────────────────
  const filtered = vehicles.filter(v => {
    const q = query.toLowerCase();
    const matchQ = (v.plate + v.brand + v.model).toLowerCase().includes(q);
    const matchF = filter === 'all' || filter === 'enabled' && v.enabled || filter === 'disabled' && !v.enabled;
    return matchQ && matchF;
  }).sort((a, b) => {
    let va = a[sortField] ?? '';
    let vb = b[sortField] ?? '';
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const rows = filtered.slice((safePage - 1) * perPage, safePage * perPage);
  function toggleSort(field) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(1);
  }
  function SortIcon({
    field
  }) {
    if (sortField !== field) return /*#__PURE__*/React.createElement("em", {
      className: "fas fa-sort",
      style: {
        marginLeft: '0.3rem',
        opacity: 0.3,
        fontSize: '0.65rem'
      }
    });
    return /*#__PURE__*/React.createElement("em", {
      className: `fas fa-sort-${sortDir === 'asc' ? 'up' : 'down'}`,
      style: {
        marginLeft: '0.3rem',
        color: '#cb0c9f',
        fontSize: '0.65rem'
      }
    });
  }

  // ── styles ────────────────────────────────────────────────────────────────
  const th = {
    textAlign: 'left',
    textTransform: 'uppercase',
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.02rem',
    color: 'var(--text-secondary)',
    padding: '0.6rem 0.75rem',
    borderBottom: '1px solid var(--border-subtle)',
    whiteSpace: 'nowrap',
    background: 'var(--surface-card)'
  };
  const td = {
    padding: '0.55rem 0.75rem',
    fontSize: '0.8rem',
    color: 'var(--text-body)',
    borderBottom: '1px solid var(--border-subtle)',
    verticalAlign: 'middle'
  };
  const filters = [{
    id: 'all',
    label: 'Todos'
  }, {
    id: 'enabled',
    label: 'Habilitado'
  }, {
    id: 'disabled',
    label: 'Inhabilitado'
  }];
  const filterColors = {
    all: '#8392ab',
    enabled: '#82d616',
    disabled: '#ea0606'
  };
  return /*#__PURE__*/React.createElement(Card, {
    padding: "0"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 1rem 0.75rem',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h6", {
    style: {
      margin: 0,
      fontSize: '0.95rem',
      fontWeight: 700,
      color: 'var(--text-heading)'
    }
  }, "Veh\xEDculos \xB7 ", filtered.length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'var(--surface-input)',
      border: '1px solid var(--border-color)',
      borderRadius: '0.5rem',
      padding: '0.38rem 0.7rem',
      width: 220
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-magnifying-glass",
    style: {
      color: 'var(--text-secondary)',
      fontSize: '0.78rem'
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => {
      setQuery(e.target.value);
      setPage(1);
    },
    placeholder: "Buscar veh\xEDculo...",
    style: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.8rem',
      color: 'var(--text-body)',
      width: '100%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, filters.map(f => {
    const active = filter === f.id;
    const col = filterColors[f.id];
    return /*#__PURE__*/React.createElement("button", {
      key: f.id,
      onClick: () => {
        setFilter(f.id);
        setPage(1);
      },
      style: {
        padding: '0.35rem 0.9rem',
        borderRadius: '50rem',
        border: `1.5px solid ${active ? col : 'var(--border-subtle)'}`,
        cursor: 'pointer',
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '0.7rem',
        fontWeight: 700,
        background: active ? f.id === 'all' ? 'var(--surface-input)' : f.id === 'enabled' ? 'rgba(130,214,22,0.12)' : 'rgba(234,6,6,0.1)' : 'transparent',
        color: active ? col : 'var(--text-secondary)',
        transition: 'all 0.15s'
      }
    }, f.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    color: "primary",
    size: "sm",
    rounded: true,
    icon: "fas fa-plus"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: "'Open Sans', sans-serif"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      cursor: 'pointer'
    },
    onClick: () => toggleSort('plate')
  }, "Placa ", /*#__PURE__*/React.createElement(SortIcon, {
    field: "plate"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      cursor: 'pointer'
    },
    onClick: () => toggleSort('brand')
  }, "Marca ", /*#__PURE__*/React.createElement(SortIcon, {
    field: "brand"
  })), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Modelo"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Color"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'center'
    }
  }, "Estado"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'center'
    }
  }, "Conductores vinculados"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      cursor: 'pointer',
      textAlign: 'center'
    },
    onClick: () => toggleSort('created')
  }, "Creado ", /*#__PURE__*/React.createElement(SortIcon, {
    field: "created"
  })), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'center'
    }
  }, "Editar"))), /*#__PURE__*/React.createElement("tbody", null, rows.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 8,
    style: {
      ...td,
      textAlign: 'center',
      padding: '2rem',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-car",
    style: {
      fontSize: '1.5rem',
      opacity: 0.3,
      display: 'block',
      marginBottom: '0.5rem'
    }
  }), "Sin resultados")), rows.map(v => /*#__PURE__*/React.createElement("tr", {
    key: v.id,
    style: {
      transition: 'background 0.12s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--surface-input)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem'
    }
  }, v.photoUrl ? /*#__PURE__*/React.createElement("img", {
    src: v.photoUrl,
    alt: v.plate,
    style: {
      width: 32,
      height: 32,
      borderRadius: '0.4rem',
      objectFit: 'cover',
      border: '1px solid var(--border-subtle)',
      flex: 'none'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: '0.4rem',
      flex: 'none',
      background: 'var(--surface-input)',
      border: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-car",
    style: {
      color: 'var(--text-secondary)',
      fontSize: '0.8rem'
    }
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onViewVehicle && onViewVehicle(v);
    },
    style: {
      fontWeight: 700,
      fontSize: '0.82rem',
      color: '#cb0c9f',
      textDecoration: 'none',
      letterSpacing: '0.02em'
    }
  }, v.plate))), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: 'var(--text-heading)',
      fontSize: '0.8rem'
    }
  }, v.brand)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: 'var(--text-secondary)'
    }
  }, v.model), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.45rem'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 13,
      height: 13,
      borderRadius: '50%',
      flex: 'none',
      background: v.color?.hex || '#ccc',
      border: '1.5px solid var(--border-color)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.78rem'
    }
  }, v.color?.name ?? '—'))), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    color: v.enabled ? 'success' : 'danger',
    variant: "solid"
  }, v.enabled ? 'HABILITADO' : 'INHABILITADO')), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: '0.82rem',
      color: v.linkedDrivers.length > 0 ? 'var(--text-heading)' : 'var(--text-secondary)'
    }
  }, v.linkedDrivers.length)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'center',
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap',
      fontSize: '0.75rem'
    }
  }, v.created), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    title: "Editar",
    onClick: () => onViewVehicle && onViewVehicle(v),
    style: {
      width: 30,
      height: 30,
      borderRadius: '0.4rem',
      border: '1.5px solid #cb0c9f',
      background: 'transparent',
      color: '#cb0c9f',
      cursor: 'pointer',
      fontSize: '0.75rem',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = '#cb0c9f';
      e.currentTarget.style.color = '#fff';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = '#cb0c9f';
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-pencil"
  })))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1rem',
      fontSize: '0.75rem',
      color: 'var(--text-secondary)',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Mostrando ", Math.min((safePage - 1) * perPage + 1, filtered.length), "\u2013", Math.min(safePage * perPage, filtered.length), " de ", filtered.length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage(p => Math.max(1, p - 1)),
    style: pagBtnV(false)
  }, "\u2039"), Array.from({
    length: totalPages
  }, (_, i) => i + 1).map(n => /*#__PURE__*/React.createElement("button", {
    key: n,
    onClick: () => setPage(n),
    style: pagBtnV(safePage === n)
  }, n)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPage(p => Math.min(totalPages, p + 1)),
    style: pagBtnV(false)
  }, "\u203A"))));
}
function pagBtnV(active) {
  return {
    width: 30,
    height: 30,
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '0.75rem',
    fontWeight: 700,
    background: active ? 'linear-gradient(310deg,#7928ca,#ff0080)' : 'var(--surface-card)',
    color: active ? '#fff' : 'var(--text-secondary)',
    boxShadow: active ? '0 4px 7px -1px rgba(0,0,0,0.11)' : '0 1px 3px rgba(0,0,0,0.08)',
    border: active ? 'none' : '1px solid var(--border-subtle)'
  };
}
window.VehiclesView = VehiclesView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/VehiclesView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/WhatsAppView.jsx
try { (() => {
// WhatsApp Connection View — Gorda Design System
// Follows Soft UI card vocabulary: floating cards, gradient icon chips, --primary magenta CTAs.

/* ── small primitives ─────────────────────────────────────── */

function Toggle({
  checked,
  onChange,
  disabled,
  danger
}) {
  const track = checked ? danger ? 'var(--danger)' : 'var(--primary)' : 'var(--border-color)';
  return /*#__PURE__*/React.createElement("button", {
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: () => !disabled && onChange(!checked),
    style: {
      width: 36,
      height: 20,
      borderRadius: 50,
      border: 'none',
      background: track,
      cursor: disabled ? 'default' : 'pointer',
      position: 'relative',
      flex: 'none',
      opacity: disabled ? 0.45 : 1,
      transition: 'background 0.2s ease',
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 18 : 2,
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
      transition: 'left 0.2s ease'
    }
  }));
}
function IconBtn({
  icon,
  gradient,
  onClick,
  title
}) {
  const [hov, setHov] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    title: title,
    onClick: onClick,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      width: 34,
      height: 34,
      borderRadius: '0.5rem',
      border: 'none',
      background: hov ? gradient : 'var(--surface-input)',
      color: hov ? '#fff' : 'var(--text-body)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.8rem',
      boxShadow: hov ? '0 4px 12px rgba(0,0,0,0.22)' : '0 2px 9px -5px rgba(0,0,0,0.25), 0 0 1px rgba(0,0,0,0.06)',
      transition: 'all 0.2s ease',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: icon
  }));
}
function PrimaryBtn({
  children,
  onClick,
  disabled,
  outline
}) {
  const [hov, setHov] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    disabled: disabled,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      padding: '0.45rem 1.25rem',
      borderRadius: '0.5rem',
      border: outline ? '1.5px solid var(--primary)' : 'none',
      background: outline ? 'transparent' : hov ? 'linear-gradient(310deg,#7928ca,#ff0080)' : 'var(--primary)',
      color: outline ? 'var(--primary)' : '#fff',
      fontFamily: 'var(--font-sans)',
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      boxShadow: !outline && !disabled ? 'var(--shadow-btn)' : 'none',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
      flex: 'none'
    }
  }, children);
}

/* ── toggle row ───────────────────────────────────────────── */
function ToggleRow({
  label,
  sub,
  checked,
  onChange,
  disabled,
  danger
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      padding: '0.65rem 0',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Toggle, {
    checked: checked,
    onChange: onChange,
    disabled: disabled,
    danger: danger
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.85rem',
      fontWeight: 600,
      color: 'var(--text-heading)',
      lineHeight: 1.3
    }
  }, label), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: 'var(--text-muted)',
      marginTop: '0.2rem',
      lineHeight: 1.4
    }
  }, sub)));
}

/* ── status pill ──────────────────────────────────────────── */
function StatusPill({
  connected,
  connecting,
  loading
}) {
  let label, bg, fg, dot;
  if (loading) {
    label = 'Loading…';
    bg = 'var(--badge-warning-bg)';
    fg = 'var(--badge-warning-fg)';
    dot = '#fbcf33';
  } else if (connecting) {
    label = 'Connecting';
    bg = 'var(--badge-info-bg)';
    fg = 'var(--badge-info-fg)';
    dot = '#17c1e8';
  } else if (connected) {
    label = 'Conectado';
    bg = 'var(--badge-success-bg)';
    fg = 'var(--badge-success-fg)';
    dot = '#82d616';
  } else {
    label = 'Desconectado';
    bg = 'var(--badge-danger-bg)';
    fg = 'var(--badge-danger-fg)';
    dot = '#ea0606';
  }
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      background: bg,
      color: fg,
      padding: '0.25rem 0.65rem',
      borderRadius: '50rem',
      fontSize: '0.7rem',
      fontWeight: 700,
      letterSpacing: '0.04em'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: dot,
      flex: 'none'
    }
  }), label);
}

/* ── connection visual ────────────────────────────────────── */
function ConnectionVisual({
  connected,
  connecting,
  loading,
  phoneId
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.5rem 1rem 1rem',
      gap: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 110,
      height: 110,
      borderRadius: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: connected ? 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)' : 'var(--surface-input)',
      boxShadow: connected ? '0 8px 26px -4px rgba(37,211,102,0.35)' : 'var(--shadow-card)',
      transition: 'all 0.3s ease',
      flex: 'none'
    }
  }, loading && /*#__PURE__*/React.createElement("em", {
    className: "fa-solid fa-spinner fa-spin",
    style: {
      fontSize: '2.5rem',
      color: '#fbcf33'
    }
  }), connecting && !loading && /*#__PURE__*/React.createElement("em", {
    className: "fa-solid fa-spinner fa-spin",
    style: {
      fontSize: '2.5rem',
      color: '#17c1e8'
    }
  }), connected && !connecting && !loading && /*#__PURE__*/React.createElement("em", {
    className: "fa-brands fa-whatsapp",
    style: {
      fontSize: '3.2rem',
      color: '#fff'
    }
  }), !connected && !connecting && !loading && /*#__PURE__*/React.createElement("em", {
    className: "fa-solid fa-circle-exclamation",
    style: {
      fontSize: '2.5rem',
      color: 'var(--text-muted)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.7rem',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-muted)',
      textAlign: 'center',
      wordBreak: 'break-all',
      padding: '0 0.5rem'
    }
  }, phoneId));
}

/* ── single connection card ───────────────────────────────── */
function ConnectionCard({
  client,
  isDefault,
  onSetDefault
}) {
  const [connected, setConnected] = React.useState(client.connected);
  const [connecting, setConnecting] = React.useState(false);
  const [settings, setSettings] = React.useState({
    wpNotifications: client.wpNotifications,
    assistant: client.assistant,
    chatBot: client.chatBot,
    full: client.full
  });
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showRestartModal, setShowRestartModal] = React.useState(false);
  function handleConnect() {
    setConnecting(true);
    // simulate connect
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 2200);
  }
  function toggle(key) {
    if (!connected) return;
    setSettings(s => ({
      ...s,
      [key]: !s[key]
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: '1rem',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)',
      border: isDefault ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
      transition: 'box-shadow 0.2s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 1.25rem 0.85rem',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 38,
      borderRadius: '0.6rem',
      flex: 'none',
      background: connected ? 'linear-gradient(310deg,#128c7e,#25d366)' : 'var(--gradient-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 9px -5px rgba(0,0,0,0.4), 0 0 1px rgba(0,0,0,0.08)',
      color: '#fff',
      fontSize: '1rem'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fa-brands fa-whatsapp"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: 'var(--text-heading)',
      lineHeight: 1.2
    }
  }, client.alias), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '0.3rem'
    }
  }, /*#__PURE__*/React.createElement(StatusPill, {
    connected: connected,
    connecting: connecting
  }))), isDefault && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.65rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
      background: 'var(--badge-primary-bg)',
      color: 'var(--badge-primary-fg)',
      padding: '0.2rem 0.55rem',
      borderRadius: '50rem'
    }
  }, "DEFAULT"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.4rem'
    }
  }, /*#__PURE__*/React.createElement(IconBtn, {
    icon: "fas fa-rotate",
    gradient: "linear-gradient(310deg,#2152ff,#21d4fd)",
    title: "Reiniciar",
    onClick: () => setShowRestartModal(true)
  }), /*#__PURE__*/React.createElement(IconBtn, {
    icon: "fas fa-trash",
    gradient: "linear-gradient(310deg,#d60808,#ff6690)",
    title: "Eliminar",
    onClick: () => setShowDeleteModal(true)
  }))), /*#__PURE__*/React.createElement(ConnectionVisual, {
    connected: connected,
    connecting: connecting,
    phoneId: client.id
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 1.25rem 1rem',
      display: 'flex',
      gap: '0.6rem',
      justifyContent: connected ? 'flex-end' : 'flex-start'
    }
  }, !connected && /*#__PURE__*/React.createElement(PrimaryBtn, {
    onClick: handleConnect,
    disabled: connecting
  }, connecting ? 'Conectando…' : 'Conectar'), connected && /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.4rem 0.9rem',
      borderRadius: '0.5rem',
      background: 'var(--badge-success-bg)',
      color: 'var(--badge-success-fg)',
      fontSize: '0.75rem',
      fontWeight: 700,
      textDecoration: 'none',
      transition: 'opacity 0.15s'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-message"
  }), "Chat")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 1.25rem',
      marginBottom: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement(ToggleRow, {
    label: "Confirmaciones de WhatsApp",
    checked: settings.wpNotifications,
    onChange: () => toggle('wpNotifications'),
    disabled: !connected
  }), /*#__PURE__*/React.createElement(ToggleRow, {
    label: "Asistente Bot",
    sub: !connected || settings.assistant ? null : 'Activa para que el bot atienda automáticamente',
    checked: settings.assistant,
    onChange: () => toggle('assistant'),
    disabled: !connected
  }), /*#__PURE__*/React.createElement(ToggleRow, {
    label: "WhatsApp ChatBot",
    sub: connected && !settings.chatBot ? 'Habilita el chatBot para que gestione completamente los servicios' : null,
    checked: settings.chatBot,
    onChange: () => toggle('chatBot'),
    disabled: !connected
  }), /*#__PURE__*/React.createElement(ToggleRow, {
    label: "Modo Saturado",
    checked: settings.full,
    onChange: () => toggle('full'),
    disabled: !connected,
    danger: true
  }), /*#__PURE__*/React.createElement(ToggleRow, {
    label: isDefault ? 'Cliente por defecto' : 'Seleccionar como cliente por defecto',
    checked: isDefault,
    onChange: () => !isDefault && onSetDefault(client.id),
    disabled: isDefault
  })), showDeleteModal && /*#__PURE__*/React.createElement(Modal, {
    title: "Eliminar conexi\xF3n",
    body: `¿Estás seguro de que deseas eliminar la conexión "${client.alias}"? Esta acción no se puede deshacer.`,
    confirmLabel: "Eliminar",
    confirmGradient: "linear-gradient(310deg,#d60808,#ff6690)",
    onConfirm: () => setShowDeleteModal(false),
    onCancel: () => setShowDeleteModal(false)
  }), showRestartModal && /*#__PURE__*/React.createElement(Modal, {
    title: "Reiniciar conexi\xF3n",
    body: `¿Deseas reiniciar la conexión "${client.alias}"? Se desconectará brevemente y volverá a conectar.`,
    confirmLabel: "Reiniciar",
    confirmGradient: "linear-gradient(310deg,#2152ff,#21d4fd)",
    onConfirm: () => {
      setShowRestartModal(false);
      setConnected(false);
      setConnecting(false);
    },
    onCancel: () => setShowRestartModal(false)
  }));
}

/* ── modal ────────────────────────────────────────────────── */
function Modal({
  title,
  body,
  confirmLabel,
  confirmGradient,
  onConfirm,
  onCancel
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    onClick: onCancel
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: '1rem',
      boxShadow: '0 24px 48px rgba(0,0,0,0.22)',
      width: 420,
      maxWidth: '90vw',
      padding: '1.75rem',
      fontFamily: 'var(--font-sans)'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("h5", {
    style: {
      margin: '0 0 0.75rem',
      fontSize: '1.05rem',
      fontWeight: 700,
      color: 'var(--text-heading)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 1.5rem',
      fontSize: '0.875rem',
      color: 'var(--text-body)',
      lineHeight: 1.6
    }
  }, body), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      padding: '0.45rem 1.1rem',
      borderRadius: '0.5rem',
      border: '1px solid var(--border-color)',
      background: 'var(--surface-input)',
      color: 'var(--text-body)',
      fontFamily: 'inherit',
      fontSize: '0.8rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    style: {
      padding: '0.45rem 1.1rem',
      borderRadius: '0.5rem',
      border: 'none',
      background: confirmGradient,
      color: '#fff',
      fontFamily: 'inherit',
      fontSize: '0.8rem',
      fontWeight: 700,
      cursor: 'pointer',
      boxShadow: 'var(--shadow-btn)'
    }
  }, confirmLabel))));
}

/* ── add number modal ─────────────────────────────────────── */
function AddNumberModal({
  onClose
}) {
  const [alias, setAlias] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const inputStyle = {
    width: '100%',
    padding: '0.55rem 0.75rem',
    border: '1px solid var(--border-color)',
    borderRadius: '0.5rem',
    background: 'var(--surface-input)',
    color: 'var(--text-body)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'border-color 0.15s'
  };
  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-heading)',
    marginBottom: '0.35rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: '1rem',
      boxShadow: '0 24px 48px rgba(0,0,0,0.22)',
      width: 440,
      maxWidth: '90vw',
      padding: '1.75rem',
      fontFamily: 'var(--font-sans)'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.25rem'
    }
  }, /*#__PURE__*/React.createElement("h5", {
    style: {
      margin: 0,
      fontSize: '1.05rem',
      fontWeight: 700,
      color: 'var(--text-heading)'
    }
  }, "Agregar n\xFAmero WhatsApp"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 28,
      height: 28,
      borderRadius: '0.4rem',
      border: 'none',
      background: 'var(--surface-input)',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.8rem'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-xmark"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: labelStyle
  }, "Alias"), /*#__PURE__*/React.createElement("input", {
    style: inputStyle,
    placeholder: "ej. L\xEDnea principal",
    value: alias,
    onChange: e => setAlias(e.target.value)
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: labelStyle
  }, "N\xFAmero de tel\xE9fono"), /*#__PURE__*/React.createElement("input", {
    style: inputStyle,
    placeholder: "+57 300 000 0000",
    value: phone,
    onChange: e => setPhone(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.6rem',
      marginTop: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      padding: '0.45rem 1.1rem',
      borderRadius: '0.5rem',
      border: '1px solid var(--border-color)',
      background: 'var(--surface-input)',
      color: 'var(--text-body)',
      fontFamily: 'inherit',
      fontSize: '0.8rem',
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      padding: '0.45rem 1.25rem',
      borderRadius: '0.5rem',
      border: 'none',
      background: 'var(--primary)',
      color: '#fff',
      fontFamily: 'inherit',
      fontSize: '0.8rem',
      fontWeight: 700,
      cursor: 'pointer',
      boxShadow: 'var(--shadow-btn)'
    }
  }, "Agregar"))));
}

/* ── sample message templates ─────────────────────────────── */
const WA_SAMPLE_MESSAGES = [{
  id: 1,
  name: 'Cancelaciones',
  interactive: true,
  msgType: 'button',
  desc: 'Cuando no se ha asignado el servicio después de cierto tiempo',
  text: '_Que pena contigo_ 😟 por el momento no cuento con móviles disponible cerca al lugar donde debemos recogerte.\n\n*¿Deseas que siga insistiendo con tu solicitud unos minutos mas?*',
  iText: '_Que pena contigo_ 😟 por el momento no cuento con móviles disponible cerca al lugar donde debemos recogerte.\n\n*¿Deseas que siga insistiendo con tu solicitud unos minutos mas?*',
  btns: [{
    label: 'Si, Continuar',
    action: 'INSIST'
  }, {
    label: 'Cancelar',
    action: 'CANCEL'
  }]
}, {
  id: 2,
  name: 'Confirmación de llegada',
  interactive: false,
  msgType: 'button',
  desc: 'Cuando el conductor llega al punto de recogida',
  text: '🚕 Tu conductor *{{NOMBRE}}* ha llegado al punto de recogida.\nVehículo: {{COLOR}} · {{PLACA}}',
  iText: '',
  btns: []
}, {
  id: 3,
  name: 'Sin móviles disponibles',
  interactive: true,
  msgType: 'button',
  desc: 'Cuando no hay vehículos disponibles en la zona',
  text: 'Lo sentimos, *en este momento no tenemos móviles disponibles* en tu zona.\n\n¿Deseas que sigamos buscando?',
  iText: 'Lo sentimos, *en este momento no tenemos móviles disponibles* en tu zona.\n\n¿Deseas que sigamos buscando?',
  btns: [{
    label: 'Sí, seguir buscando',
    action: 'SEARCH'
  }, {
    label: 'Cancelar',
    action: 'CANCEL'
  }]
}, {
  id: 4,
  name: 'Bienvenida',
  interactive: false,
  msgType: 'button',
  desc: 'Mensaje de bienvenida al iniciar una conversación',
  text: '👋 Hola *{{NOMBRE}}*, bienvenido/a a _Gorda Taxi_.\n¿En qué podemos ayudarte hoy?',
  iText: '',
  btns: []
}];

/* ── messages list panel ──────────────────────────────────── */
function MessagesPanel({
  messages,
  onEdit,
  onNew
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '1rem'
    }
  }, /*#__PURE__*/React.createElement(PrimaryBtn, {
    onClick: onNew
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-plus",
    style: {
      marginRight: '0.4rem'
    }
  }), "Nueva plantilla")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: '1rem',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 2.5fr 120px 80px',
      padding: '0.65rem 1.25rem',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--body-bg)'
    }
  }, ['Plantilla', 'Descripción', 'Tipo', ''].map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: '0.63rem',
      fontWeight: 700,
      color: 'var(--text-muted)',
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    }
  }, h))), messages.map((msg, i) => /*#__PURE__*/React.createElement("div", {
    key: msg.id,
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 2.5fr 120px 80px',
      padding: '0.9rem 1.25rem',
      alignItems: 'center',
      borderBottom: i < messages.length - 1 ? '1px solid var(--border-subtle)' : 'none',
      transition: 'background 0.1s'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: '0.875rem',
      color: 'var(--text-heading)',
      marginBottom: '0.1rem'
    }
  }, msg.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.7rem',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.02em'
    }
  }, msg.text ? msg.text.length > 38 ? msg.text.slice(0, 38).replace(/[*_]/g, '') + '…' : msg.text.replace(/[*_]/g, '') : '—')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      color: 'var(--text-muted)',
      paddingRight: '1rem',
      lineHeight: 1.4
    }
  }, msg.desc), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.28rem',
      padding: '0.2rem 0.6rem',
      borderRadius: '50rem',
      background: msg.interactive ? 'var(--badge-success-bg)' : 'var(--badge-secondary-bg)',
      color: msg.interactive ? 'var(--badge-success-fg)' : 'var(--badge-secondary-fg)',
      fontSize: '0.67rem',
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: msg.interactive ? 'fas fa-bolt' : 'fas fa-comment',
    style: {
      fontSize: '0.53rem'
    }
  }), msg.interactive ? 'Interactivo' : 'Simple')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.35rem',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onEdit(msg),
    title: "Editar",
    style: {
      width: 30,
      height: 30,
      borderRadius: '0.4rem',
      border: 'none',
      background: 'var(--surface-input)',
      color: 'var(--text-body)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.74rem',
      transition: 'all 0.12s'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-pen"
  })), /*#__PURE__*/React.createElement("button", {
    title: "Eliminar",
    style: {
      width: 30,
      height: 30,
      borderRadius: '0.4rem',
      border: 'none',
      background: 'var(--badge-danger-bg)',
      color: 'var(--badge-danger-fg)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.72rem',
      transition: 'all 0.12s'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-trash"
  })))))));
}

/* ── main view ────────────────────────────────────────────── */
function WhatsAppView() {
  const [clients, setClients] = React.useState([{
    id: '315465977324579',
    alias: '573173103090',
    connected: true,
    wpNotifications: true,
    assistant: true,
    chatBot: false,
    full: false
  }, {
    id: '6028353514',
    alias: '602',
    connected: false,
    wpNotifications: false,
    assistant: false,
    chatBot: false,
    full: false
  }]);
  const [defaultClient, setDefaultClient] = React.useState(clients[0].id);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [tab, setTab] = React.useState('connections');
  const [messages, setMessages] = React.useState(WA_SAMPLE_MESSAGES);
  const [editingMsg, setEditingMsg] = React.useState(null);
  const TABS = [{
    id: 'connections',
    icon: 'fas fa-wifi',
    label: 'Conexiones'
  }, {
    id: 'messages',
    icon: 'fas fa-comment-dots',
    label: 'Mensajes'
  }];
  function handleSaveMsg(data) {
    setMessages(ms => ms.map(m => m.id === editingMsg.id ? {
      ...m,
      ...data
    } : m));
  }
  function handleNewMsg() {
    const newMsg = {
      id: Date.now(),
      name: '',
      text: '',
      desc: '',
      interactive: false,
      msgType: 'button',
      iText: '',
      btns: []
    };
    setMessages(ms => [...ms, newMsg]);
    setEditingMsg(newMsg);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.2rem',
      background: 'var(--surface-card)',
      padding: '0.25rem',
      borderRadius: '0.625rem',
      boxShadow: 'var(--shadow-card)'
    }
  }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    style: {
      padding: '0.38rem 1rem',
      borderRadius: '0.4rem',
      border: 'none',
      background: tab === t.id ? 'var(--primary)' : 'transparent',
      color: tab === t.id ? '#fff' : 'var(--text-body)',
      fontFamily: 'var(--font-sans)',
      fontSize: '0.8rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      boxShadow: tab === t.id ? 'var(--shadow-btn)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("em", {
    className: t.icon,
    style: {
      fontSize: '0.74rem'
    }
  }), t.label))), tab === 'connections' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.6rem'
    }
  }, /*#__PURE__*/React.createElement(PrimaryBtn, {
    outline: true,
    onClick: () => setShowAddModal(true)
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-plus",
    style: {
      marginRight: '0.4rem'
    }
  }), "Agregar n\xFAmero"), /*#__PURE__*/React.createElement(PrimaryBtn, {
    onClick: () => {}
  }, /*#__PURE__*/React.createElement("em", {
    className: "fas fa-plus",
    style: {
      marginRight: '0.4rem'
    }
  }), "Crear"))), tab === 'connections' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.25rem'
    }
  }, clients.map(client => /*#__PURE__*/React.createElement(ConnectionCard, {
    key: client.id,
    client: client,
    isDefault: defaultClient === client.id,
    onSetDefault: setDefaultClient
  }))), tab === 'messages' && /*#__PURE__*/React.createElement(MessagesPanel, {
    messages: messages,
    onEdit: setEditingMsg,
    onNew: handleNewMsg
  }), showAddModal && /*#__PURE__*/React.createElement(AddNumberModal, {
    onClose: () => setShowAddModal(false)
  }), editingMsg && /*#__PURE__*/React.createElement(EditMessageModal, {
    msg: editingMsg,
    onClose: () => setEditingMsg(null),
    onSave: handleSaveMsg
  }));
}
window.WhatsAppView = WhatsAppView;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/WhatsAppView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/data.js
try { (() => {
// Mock data for the Gorda admin UI kit — mirrors the shapes used in the Vue app.
window.GordaData = {
  user: {
    name: 'Red Blanca',
    role: 'Administrator'
  },
  nav: [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'fas fa-gauge-high'
  }, {
    id: 'services',
    label: 'Services',
    icon: 'fas fa-route'
  }, {
    id: 'drivers',
    label: 'Drivers',
    icon: 'fa-solid fa-car-side'
  }, {
    id: 'vehicles',
    label: 'Vehicles',
    icon: 'fa-solid fa-car'
  }, {
    id: 'places',
    label: 'Places',
    icon: 'fas fa-location-dot'
  }, {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'fa-brands fa-whatsapp',
    status: true
  }, {
    id: 'metrics',
    label: 'Metrics',
    icon: 'fa-solid fa-chart-pie'
  }, {
    id: 'settings',
    label: 'Settings',
    icon: 'fa-solid fa-screwdriver-wrench'
  }],
  // Services lifecycle — pending / in_progress / history(terminated|canceled)
  pendings: [{
    id: 1,
    a_go: '2 min',
    status: 'pending',
    start: 'Cra. 7 #45-12, Chapinero',
    end: 'Aeropuerto El Dorado',
    phone: '+57 301 555 0192',
    name: 'María Gómez',
    comment: 'Tiene dos maletas',
    origin: 'bot',
    applicants: 2
  }, {
    id: 2,
    a_go: '5 min',
    status: 'pending',
    start: 'Cl. 80 #14-20',
    end: 'N/A',
    phone: '+57 312 555 8841',
    name: 'Andrés Patiño',
    comment: 'N/A',
    origin: 'bot',
    applicants: 0
  }, {
    id: 3,
    a_go: '8 min',
    status: 'pending',
    start: 'Centro Comercial Andino',
    end: 'Usaquén',
    phone: '+57 320 555 1107',
    name: 'Laura Méndez',
    comment: 'Frente a la entrada norte',
    origin: 'admin',
    applicants: 1
  }],
  inProgress: [{
    id: 4,
    a_go: '12 min',
    status: 'in_progress',
    start: 'Cl. 26 #68-35',
    end: 'Terminal de Transportes',
    phone: '+57 318 555 4420',
    name: 'Jorge Salazar',
    comment: 'N/A',
    driver: 'Carlos Ruiz',
    origin: 'bot'
  }, {
    id: 5,
    a_go: '18 min',
    status: 'in_progress',
    start: 'Parque de la 93',
    end: 'Zona T',
    phone: '+57 300 555 9963',
    name: 'Diana Rojas',
    comment: 'Pago en efectivo',
    driver: 'Ana López',
    origin: 'admin'
  }],
  history: [{
    id: 6,
    date: '2026-06-18 09:14',
    status: 'terminated',
    start: 'Suba Av. Boyacá',
    end: 'Calle 100',
    phone: '+57 311 555 2030',
    name: 'Pedro Niño',
    driverName: 'José Marín',
    origin: 'bot'
  }, {
    id: 7,
    date: '2026-06-18 08:52',
    status: 'canceled',
    start: 'Restrepo',
    end: 'N/A',
    phone: '+57 315 555 7781',
    name: 'Sofía Cano',
    driverName: '—',
    origin: 'bot'
  }, {
    id: 8,
    date: '2026-06-18 08:30',
    status: 'terminated',
    start: 'Cl. 53 #25-40',
    end: 'Galerías',
    phone: '+57 305 555 6610',
    name: 'Miguel Ángel',
    driverName: 'Carlos Ruiz',
    origin: 'admin'
  }, {
    id: 9,
    date: '2026-06-17 22:08',
    status: 'terminated',
    start: 'Modelia',
    end: 'Fontibón',
    phone: '+57 319 555 3344',
    name: 'Valentina Cruz',
    driverName: 'Ana López',
    origin: 'bot'
  }],
  drivers: [{
    id: 'd1',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@gorda.co',
    phone: '+57 301 222 1180',
    brand: 'Chevrolet',
    model: 'Spark GT',
    plate: 'KXT-482',
    enabled: true,
    created: '2025-11-03',
    last: '2 min ago',
    balance: '$48 000',
    status: 'online'
  }, {
    id: 'd2',
    name: 'Ana López',
    email: 'ana.lopez@gorda.co',
    phone: '+57 312 884 0021',
    brand: 'Renault',
    model: 'Logan',
    plate: 'HJS-119',
    enabled: true,
    created: '2025-09-21',
    last: '6 min ago',
    balance: '$12 500',
    status: 'busy'
  }, {
    id: 'd3',
    name: 'José Marín',
    email: 'jose.marin@gorda.co',
    phone: '+57 320 110 7754',
    brand: 'Kia',
    model: 'Picanto',
    plate: 'FBD-903',
    enabled: true,
    created: '2026-01-14',
    last: '1 h ago',
    balance: '$0',
    status: 'offline'
  }, {
    id: 'd4',
    name: 'Lucía Torres',
    email: 'lucia.torres@gorda.co',
    phone: '+57 318 442 9087',
    brand: 'Hyundai',
    model: 'Atos',
    plate: 'GTR-220',
    enabled: false,
    created: '2025-07-08',
    last: '3 d ago',
    balance: '−$2 000',
    status: 'offline'
  }, {
    id: 'd5',
    name: 'Andrés Beltrán',
    email: 'andres.beltran@gorda.co',
    phone: '+57 300 996 3310',
    brand: 'Mazda',
    model: '2',
    plate: 'LMN-558',
    enabled: true,
    created: '2026-03-22',
    last: '14 min ago',
    balance: '$31 200',
    status: 'online'
  }],
  stats: [{
    label: 'Services today',
    value: '248',
    icon: 'fas fa-route',
    color: 'info',
    delta: '12%',
    up: true
  }, {
    label: 'Active drivers',
    value: '36',
    icon: 'fa-solid fa-car-side',
    color: 'primary',
    delta: '3',
    up: true
  }, {
    label: 'In progress',
    value: '7',
    icon: 'fas fa-spinner',
    color: 'warning',
    delta: '2',
    up: true
  }, {
    label: 'Avg. wait',
    value: '4.2m',
    icon: 'fas fa-clock',
    color: 'success',
    delta: '0.8m',
    up: false
  }],
  vehicles: [{
    id: 'v1',
    plate: '421J',
    brand: 'Kia',
    model: 'Morning',
    year: 2009,
    color: {
      name: 'white',
      hex: '#FFFFFF'
    },
    enabled: true,
    linkedDrivers: [{
      id: 'd1',
      name: 'Carlos Ruiz',
      selectable: true
    }],
    created: '2026-06-15',
    soat: '2025-03-12',
    tec: '2026-01-08',
    photoUrl: null
  }, {
    id: 'v2',
    plate: 'AAA123',
    brand: 'Vehículo',
    model: 'Xxx',
    year: 2026,
    color: {
      name: 'black',
      hex: '#000000'
    },
    enabled: true,
    linkedDrivers: [{
      id: 'd2',
      name: 'Nombre Completo',
      selectable: true
    }, {
      id: 'd3',
      name: 'Alexander Camilo R',
      selectable: false
    }],
    created: '2026-06-15',
    soat: '2023-08-03',
    tec: '2026-02-03',
    photoUrl: null
  }, {
    id: 'v3',
    plate: 'AAK167',
    brand: 'Chevrolet',
    model: 'Sail',
    year: 2015,
    color: {
      name: 'red',
      hex: '#EF233C'
    },
    enabled: true,
    linkedDrivers: [{
      id: 'd4',
      name: 'Lucía Torres',
      selectable: true
    }],
    created: '2026-06-15',
    soat: '2026-05-20',
    tec: '2025-11-30',
    photoUrl: null
  }, {
    id: 'v4',
    plate: 'ABN530',
    brand: 'Hyundai',
    model: 'Getz',
    year: 2010,
    color: {
      name: 'black',
      hex: '#000000'
    },
    enabled: true,
    linkedDrivers: [{
      id: 'd5',
      name: 'Andrés Beltrán',
      selectable: true
    }],
    created: '2026-06-15',
    soat: '2026-09-14',
    tec: '2026-04-22',
    photoUrl: null
  }, {
    id: 'v5',
    plate: 'ABN618',
    brand: 'Kia',
    model: 'Picanto',
    year: 2025,
    color: {
      name: 'blue',
      hex: '#2152FF'
    },
    enabled: true,
    linkedDrivers: [{
      id: 'd1',
      name: 'Carlos Ruiz',
      selectable: false
    }],
    created: '2026-06-15',
    soat: '2027-01-01',
    tec: '2027-01-01',
    photoUrl: null
  }, {
    id: 'v6',
    plate: 'ABP510',
    brand: 'Chevrolet',
    model: 'Spark',
    year: 2009,
    color: {
      name: 'blue',
      hex: '#2152FF'
    },
    enabled: true,
    linkedDrivers: [{
      id: 'd2',
      name: 'Ana López',
      selectable: true
    }],
    created: '2026-06-15',
    soat: '2025-07-18',
    tec: '2025-08-05',
    photoUrl: null
  }, {
    id: 'v7',
    plate: 'ABU004',
    brand: 'Spark',
    model: 'Go',
    year: 2010,
    color: {
      name: 'silver',
      hex: '#C0C0C0'
    },
    enabled: false,
    linkedDrivers: [],
    created: '2026-06-15',
    soat: '2024-11-02',
    tec: '2024-09-17',
    photoUrl: null
  }, {
    id: 'v8',
    plate: 'AUT591J',
    brand: 'Chevrolet',
    model: 'Spartak Go',
    year: 2007,
    color: {
      name: 'gray',
      hex: '#808080'
    },
    enabled: true,
    linkedDrivers: [{
      id: 'd3',
      name: 'José Marín',
      selectable: true
    }],
    created: '2026-06-15',
    soat: '2026-03-08',
    tec: '2026-06-01',
    photoUrl: null
  }, {
    id: 'v9',
    plate: 'BCR220',
    brand: 'Renault',
    model: 'Logan',
    year: 2018,
    color: {
      name: 'white',
      hex: '#FFFFFF'
    },
    enabled: true,
    linkedDrivers: [{
      id: 'd5',
      name: 'Andrés Beltrán',
      selectable: false
    }],
    created: '2026-06-14',
    soat: '2026-10-11',
    tec: '2026-07-25',
    photoUrl: null
  }, {
    id: 'v10',
    plate: 'BDS441',
    brand: 'Mazda',
    model: 'Cx-3',
    year: 2022,
    color: {
      name: 'red',
      hex: '#EF233C'
    },
    enabled: false,
    linkedDrivers: [{
      id: 'd4',
      name: 'Lucía Torres',
      selectable: false
    }],
    created: '2026-06-14',
    soat: '2023-12-31',
    tec: '2023-10-15',
    photoUrl: null
  }],
  confirmations: [{
    key: 'new_service',
    label: 'New service created',
    on: true
  }, {
    key: 'driver_assigned',
    label: 'Driver assigned',
    on: true
  }, {
    key: 'driver_arrived',
    label: 'Driver has arrived',
    on: false
  }, {
    key: 'trip_ended',
    label: 'Trip completed',
    on: true
  }],
  chatbot: [{
    key: 'welcome',
    label: 'Welcome message',
    on: true
  }, {
    key: 'ask_pickup',
    label: 'Ask for pickup location',
    on: true
  }, {
    key: 'ask_destination',
    label: 'Ask for destination',
    on: false
  }, {
    key: 'assistant',
    label: 'AI Assistant replies',
    on: true
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

})();
