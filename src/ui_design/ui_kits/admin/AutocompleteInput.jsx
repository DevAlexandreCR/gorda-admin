// Gorda admin — lightweight styled autocomplete for text/tel inputs.
// Used for phone numbers and addresses on the dashboard's create-service form.
// Renders its own dropdown (instead of relying on native browser autofill,
// which can't be styled and gets visually lost behind other content) with a
// scrollable, elevated menu so more than a couple of matches are reachable.
function AutocompleteInput({ value, onChange, options, placeholder, type, style }) {
  const [focused, setFocused] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const query = (value || '').trim();

  const matches = React.useMemo(() => {
    if (query.length < 2) return [];
    const q = query.toLowerCase();
    return (options || []).filter(o => o.toLowerCase().includes(q)).slice(0, 8);
  }, [query, options]);

  const open = focused && matches.length > 0;

  React.useEffect(() => { setActive(-1); }, [query]);

  function selectValue(v) {
    onChange(v);
    setFocused(false);
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        type={type || 'text'}
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 120)}
        onKeyDown={e => {
          if (!open) return;
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => (a + 1) % matches.length); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => (a <= 0 ? matches.length - 1 : a - 1)); }
          else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); selectValue(matches[active]); }
          else if (e.key === 'Escape') { setFocused(false); }
        }}
        style={style}
      />
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          background: 'var(--surface-card)', border: '1px solid var(--border-color)',
          borderRadius: '0.6rem',
          boxShadow: '0 16px 36px -10px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.14)',
          maxHeight: 224, overflowY: 'auto', zIndex: 60, padding: '0.3rem',
        }}>
          {matches.map((m, idx) => (
            <div
              key={m + idx}
              onMouseDown={() => selectValue(m)}
              onMouseEnter={() => setActive(idx)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.55rem',
                padding: '0.55rem 0.7rem', borderRadius: '0.4rem', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-body)',
                background: active === idx ? 'var(--surface-input)' : 'transparent',
              }}
            >
              <em
                className={type === 'tel' ? 'fas fa-phone' : 'fas fa-location-dot'}
                style={{ fontSize: '0.68rem', color: '#cb0c9f', flex: 'none' }}
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
window.AutocompleteInput = AutocompleteInput;
