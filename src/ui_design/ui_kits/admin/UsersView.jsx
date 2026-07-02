// Users view — admin/operator roster: search, role filter, status badges, row edit.
function UsersView({ onEditUser }) {
  const { Card, Avatar, Badge, Button } = window.GordaDesignSystem_019e24;
  const data = window.GordaData;
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const rows = data.users.filter((u) => {
    const matchQ = (u.name + u.email + u.phone).toLowerCase().includes(query.toLowerCase());
    const matchF =
      filter === 'all' ||
      (filter === 'admin' && u.role === 'Administrador') ||
      (filter === 'operator' && u.role === 'Operador');
    return matchQ && matchF;
  });

  const th = {
    textAlign: 'left', textTransform: 'uppercase', fontSize: '0.62rem',
    fontWeight: 700, letterSpacing: '0.02rem', color: 'var(--text-secondary)',
    padding: '0.65rem 0.9rem', borderBottom: '1px solid var(--border-subtle)',
  };
  const td = {
    padding: '0.65rem 0.9rem', fontSize: '0.8rem', color: 'var(--text-body)',
    borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'middle',
  };
  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'admin', label: 'Administrador' },
    { id: 'operator', label: 'Operador' },
  ];

  return (
    <Card padding="0">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1rem 0.75rem', flexWrap: 'wrap' }}>
        <h6 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)' }}>
          Usuarios · {rows.length}
        </h6>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--surface-input)', border: '1px solid var(--border-color)',
          borderRadius: '0.5rem', padding: '0.38rem 0.7rem', width: 220,
        }}>
          <em className="fas fa-magnifying-glass" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar usuario..."
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontFamily: "'Open Sans', sans-serif", fontSize: '0.8rem',
              color: 'var(--text-body)', width: '100%',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 4 }}>
          {filters.map((f) => {
            const active = filter === f.id;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                padding: '0.35rem 0.85rem', borderRadius: '50rem',
                border: `1.5px solid ${active ? '#cb0c9f' : 'var(--border-subtle)'}`,
                cursor: 'pointer', fontFamily: "'Open Sans', sans-serif",
                fontSize: '0.7rem', fontWeight: 700,
                background: active ? 'rgba(203,12,159,0.1)' : 'transparent',
                color: active ? '#a30c80' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}>{f.label}</button>
            );
          })}
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <Button color="primary" rounded icon="fas fa-plus" onClick={() => onEditUser && onEditUser(null)} />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Open Sans', sans-serif", minWidth: 720 }}>
          <thead>
            <tr>
              <th style={th}>Nombre</th>
              <th style={th}>Teléfono</th>
              <th style={th}>Rol</th>
              <th style={{ ...th, textAlign: 'center' }}>Estado</th>
              <th style={th}>Creado</th>
              <th style={{ ...th, textAlign: 'center' }}>Editar</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} style={{ ...td, textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  <em className="fas fa-users" style={{ fontSize: '1.5rem', opacity: 0.3, display: 'block', marginBottom: '0.5rem' }} />
                  Sin resultados
                </td>
              </tr>
            )}
            {rows.map((u) => (
              <tr key={u.id} style={{ transition: 'background 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-input)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Avatar name={u.name} size="sm" />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)' }}>{u.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ ...td, whiteSpace: 'nowrap', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{u.phone}</td>
                <td style={td}>{u.role}</td>
                <td style={{ ...td, textAlign: 'center' }}>
                  <Badge color={u.enabled ? 'success' : 'danger'} variant="solid">
                    {u.enabled ? 'HABILITADO' : 'INHABILITADO'}
                  </Badge>
                </td>
                <td style={{ ...td, whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>{u.created}</td>
                <td style={{ ...td, textAlign: 'center' }}>
                  <button
                    title="Editar"
                    onClick={() => onEditUser && onEditUser(u)}
                    style={{
                      width: 30, height: 30, borderRadius: '50%',
                      border: 'none', background: 'var(--surface-input)',
                      color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(310deg,#7928ca,#ff0080)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-input)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <em className="fas fa-pencil" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
window.UsersView = UsersView;
