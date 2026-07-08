// Profile view — read-only account summary. Gorda DS.
function ProfileView() {
  const { Badge } = window.GordaDesignSystem_019e24;
  const isMobile = window.useIsMobile();
  const user = window.GordaData.user;

  // Static profile data — mirrors the current live screen.
  const profile = {
    name: 'Super Admin',
    email: 'devalexandrecr@gmail.com',
    phone: '3103794656',
  };
  const roles = ['Administrador', 'users.fields.superadmin'];

  const infoRow = (icon, label, value) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.7rem 0' }}>
      <span style={{
        width: 34, height: 34, flex: 'none', borderRadius: '0.6rem',
        background: 'var(--surface-input)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#cb0c9f', fontSize: '0.85rem',
      }}>
        <em className={icon} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif" }}>

      {/* ── Cover + identity card ── */}
      <div style={{
        borderRadius: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow-card)',
        marginBottom: '1.25rem',
      }}>
        <div style={{
          height: 140, background: 'linear-gradient(310deg, #7928ca, #ff0080)',
        }} />
        <div style={{
          background: 'var(--surface-card)',
          padding: isMobile ? '0 1.25rem 1.25rem' : '0 1.75rem 1.5rem',
          display: 'flex', flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center', gap: '1.1rem',
        }}>
          <img
            src="logo.png" alt={profile.name}
            style={{
              width: 84, height: 84, flex: 'none', borderRadius: '1rem',
              objectFit: 'cover', marginTop: -42,
              border: '4px solid var(--surface-card)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              background: '#fff',
            }}
          />
          <div style={{ minWidth: 0, paddingTop: isMobile ? 0 : '0.4rem' }}>
            <h5 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              {profile.name}
            </h5>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {profile.email}
            </div>
          </div>
        </div>
      </div>

      {/* ── Details ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1.1fr) minmax(0,1fr)', gap: '1.25rem' }}>

        {/* Información de perfil */}
        <div style={{ background: 'var(--surface-card)', borderRadius: '1rem', boxShadow: 'var(--shadow-card)', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
            <span style={{
              width: 30, height: 30, flex: 'none', borderRadius: '0.55rem',
              background: 'linear-gradient(310deg,#2152ff,#21d4fd)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem',
              boxShadow: '0 4px 7px -1px rgba(0,0,0,0.11)',
            }}>
              <em className="fas fa-id-card" />
            </span>
            <h6 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              Información de perfil
            </h6>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {infoRow('fas fa-user', 'Nombre', profile.name)}
            <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
            {infoRow('fas fa-envelope', 'Correo electrónico', profile.email)}
            <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
            {infoRow('fas fa-phone', 'Teléfono', profile.phone)}
          </div>
        </div>

        {/* Configuraciones */}
        <div style={{ background: 'var(--surface-card)', borderRadius: '1rem', boxShadow: 'var(--shadow-card)', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.1rem' }}>
            <span style={{
              width: 30, height: 30, flex: 'none', borderRadius: '0.55rem',
              background: 'linear-gradient(310deg,#f53939,#fbcf33)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem',
              boxShadow: '0 4px 7px -1px rgba(0,0,0,0.11)',
            }}>
              <em className="fas fa-gear" />
            </span>
            <h6 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              Configuraciones
            </h6>
          </div>

          <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.7rem' }}>
            Roles
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {roles.map((r) => (
              <div key={r} style={{
                display: 'flex', alignItems: 'center', gap: '0.7rem',
                padding: '0.55rem 0.75rem', borderRadius: '0.65rem',
                background: 'var(--surface-input)',
              }}>
                <span style={{
                  width: 26, height: 26, flex: 'none', borderRadius: '0.5rem',
                  background: 'linear-gradient(310deg,#7928ca,#ff0080)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.65rem',
                }}>
                  <em className="fas fa-screwdriver-wrench" />
                </span>
                <span style={{
                  fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-heading)',
                  fontFamily: r.includes('.') ? "'SFMono-Regular', Menlo, Monaco, monospace" : "'Open Sans', sans-serif",
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {r}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
window.ProfileView = ProfileView;
