// Gorda admin top navbar — breadcrumb + page title, search, theme toggle, icons.
function TopNav({ title, breadcrumb, theme, onToggleTheme }) {
  const isDark = theme === 'dark';
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.5rem 0', margin: '0 0 1.25rem', fontFamily: "'Open Sans', sans-serif",
    }}>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span style={{ opacity: 0.6 }}>Pages</span>
          <span style={{ margin: '0 0.4rem', opacity: 0.5 }}>/</span>
          <span style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{breadcrumb || title}</span>
        </div>
        <h6 style={{ margin: '0.15rem 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)' }}>{title}</h6>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--surface-input)', border: '1px solid var(--border-color)',
          borderRadius: '0.5rem', padding: '0.45rem 0.75rem', width: 200,
        }}>
          <em className="fas fa-magnifying-glass" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }} />
          <input
            placeholder="Search..."
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'inherit', fontSize: '0.8rem',
              color: 'var(--text-body)', width: '100%',
            }}
          />
        </div>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: 36, height: 36, borderRadius: '0.5rem',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: isDark ? '#fbcf33' : '#344767',
            fontSize: '0.95rem', transition: 'all 0.2s ease',
            boxShadow: '0 2px 9px -5px rgba(0,0,0,0.3)',
            flex: 'none',
          }}
        >
          <em className={isDark ? 'fas fa-sun' : 'fas fa-moon'} />
        </button>

        {/* Bell */}
        <em className="fas fa-bell" style={{ color: 'var(--text-heading)', fontSize: '1rem', cursor: 'pointer' }} />

        {/* Avatar */}
        <img
          src="redblanca.jpg" alt="branch"
          style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 9px -5px rgba(0,0,0,0.4)' }}
        />
      </div>
    </nav>
  );
}
window.TopNav = TopNav;
