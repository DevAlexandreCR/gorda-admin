// Gorda admin sidebar — floating rounded card, Soft UI nav with icon chips.
// On mobile (isMobile=true) renders as a fixed-position drawer that slides in/out.
function Sidebar({ active, onNavigate, isMobile, open, onClose }) {
  const { user, nav } = window.GordaData;

  const posStyle = isMobile
    ? {
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 200,
        borderRadius: '0 1rem 1rem 0',
        transform: open ? 'translateX(0)' : 'translateX(-260px)',
        transition: 'transform 0.25s ease',
      }
    : {
        position: 'fixed',
        top: '1rem', left: '1rem', bottom: '1rem',
        borderRadius: '1rem',
      };

  return (
    <aside style={{
      ...posStyle,
      width: 240,
      background: 'var(--surface-card)',
      boxShadow: isMobile && open
        ? '0 8px 40px rgba(0,0,0,0.28)'
        : 'var(--shadow-card)',
      display: 'flex', flexDirection: 'column',
      padding: '1rem 0.75rem',
      fontFamily: "'Open Sans', sans-serif",
      overflowY: 'auto',
    }}>

      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.25rem 0.5rem 0.75rem' }}>
        <img src="logo.png" alt="Gorda" style={{ width: 34, height: 34, borderRadius: '0.6rem', flex: 'none' }} />
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-heading)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.name}
        </span>
        {/* Close button — mobile only */}
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '1rem',
              width: 28, height: 28, flex: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '0.4rem',
            }}
          >
            <em className="fas fa-xmark" />
          </button>
        )}
      </div>

      <hr style={{ border: 0, borderTop: '1px solid var(--border-subtle)', margin: '0 0.25rem 0.75rem' }} />

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {nav.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.7rem',
                padding: '0.55rem 0.6rem', borderRadius: '0.5rem',
                textDecoration: 'none',
                background: isActive ? 'var(--surface-input)' : 'transparent',
                boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{
                width: 32, height: 32, flex: 'none', borderRadius: '0.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive
                  ? 'linear-gradient(310deg, #7928ca, #ff0080)'
                  : 'var(--surface-input)',
                boxShadow: '0 2px 9px -5px rgba(0,0,0,0.4), 0 0 1px rgba(0,0,0,0.08)',
                color: isActive ? '#fff' : '#cb0c9f',
                fontSize: '0.8rem',
              }}>
                <em className={item.icon} />
              </span>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: isActive ? 700 : 600,
                color: isActive ? 'var(--text-heading)' : 'var(--text-body)',
                position: 'relative',
              }}>
                {item.id === 'whatsapp'
                  ? (item.status ? 'Connected' : 'Disconnected')
                  : item.label}
                {item.id === 'whatsapp' && (
                  <span style={{
                    position: 'absolute', top: 2, right: -14,
                    width: 8, height: 8, borderRadius: '50%',
                    border: '1.5px solid var(--surface-card)',
                    background: item.status ? '#82d616' : '#ea0606',
                  }} />
                )}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.7rem',
            padding: '0.55rem 0.6rem', borderRadius: '0.5rem',
            textDecoration: 'none', color: 'var(--text-body)',
          }}
        >
          <span style={{
            width: 32, height: 32, flex: 'none', borderRadius: '0.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--surface-input)',
            boxShadow: '0 2px 9px -5px rgba(0,0,0,0.4), 0 0 1px rgba(0,0,0,0.08)',
            color: '#ea0606', fontSize: '0.8rem',
          }}>
            <em className="fas fa-sign-out-alt" />
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Log out</span>
        </a>
        <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 700 }}>
          version 2.0.5
        </div>
      </div>
    </aside>
  );
}
window.Sidebar = Sidebar;
