// Gorda admin top navbar — breadcrumb + title, search, theme toggle, icons.
// On mobile: shows hamburger button, hides search and bell.
function TopNav({ title, breadcrumb, theme, onToggleTheme, isMobile, onToggleSidebar }) {
  const isDark = theme === 'dark';
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.5rem 0', margin: '0 0 1.25rem',
      fontFamily: "'Open Sans', sans-serif",
      gap: '0.75rem',
    }}>
      {/* Left: hamburger + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
        {isMobile && (
          <button
            onClick={onToggleSidebar}
            style={{
              width: 36, height: 36, flex: 'none', borderRadius: '0.5rem',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-heading)', fontSize: '1rem',
              boxShadow: '0 2px 9px -5px rgba(0,0,0,0.3)',
            }}
          >
            <em className="fas fa-bars" />
          </button>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: '0.75rem', color: 'var(--text-secondary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            <span style={{ opacity: 0.6 }}>Pages</span>
            <span style={{ margin: '0 0.4rem', opacity: 0.5 }}>/</span>
            <span style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{breadcrumb || title}</span>
          </div>
          <h6 style={{
            margin: '0.15rem 0 0', fontSize: '1rem', fontWeight: 700,
            color: 'var(--text-heading)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {title}
          </h6>
        </div>
      </div>

      {/* Right: theme, bell (desktop only), avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 'none' }}>
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: 36, height: 36, flex: 'none', borderRadius: '0.5rem',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: isDark ? '#fbcf33' : '#344767',
            fontSize: '0.95rem', transition: 'all 0.2s ease',
            boxShadow: '0 2px 9px -5px rgba(0,0,0,0.3)',
          }}
        >
          <em className={isDark ? 'fas fa-sun' : 'fas fa-moon'} />
        </button>

        {!isMobile && (
          <em className="fas fa-bell" style={{ color: 'var(--text-heading)', fontSize: '1rem', cursor: 'pointer' }} />
        )}

        <img
          src="redblanca.jpg" alt="branch"
          style={{
            width: 34, height: 34, flex: 'none',
            borderRadius: '50%', objectFit: 'cover',
            boxShadow: '0 2px 9px -5px rgba(0,0,0,0.4)',
          }}
        />
      </div>
    </nav>
  );
}
window.TopNav = TopNav;
