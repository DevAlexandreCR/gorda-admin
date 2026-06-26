// Vehicles index view — searchable + sortable table with status filter & row actions.
function VehiclesView({ onViewVehicle }) {
  const { Card, Badge, Button } = window.GordaDesignSystem_019e24;
  const data = window.GordaData;

  const [query, setQuery]       = React.useState('');
  const [filter, setFilter]     = React.useState('all');
  const [sortField, setSortField] = React.useState('plate');
  const [sortDir, setSortDir]   = React.useState('asc');
  const [page, setPage]         = React.useState(1);
  const perPage = 8;

  const vehicles = data.vehicles || [];

  // ── filter + sort ─────────────────────────────────────────────────────────
  const filtered = vehicles.filter((v) => {
    const q = query.toLowerCase();
    const matchQ = (v.plate + v.brand + v.model).toLowerCase().includes(q);
    const matchF =
      filter === 'all' ||
      (filter === 'enabled'  &&  v.enabled) ||
      (filter === 'disabled' && !v.enabled);
    return matchQ && matchF;
  }).sort((a, b) => {
    let va = a[sortField] ?? '';
    let vb = b[sortField] ?? '';
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    if (va < vb) return sortDir === 'asc' ? -1 :  1;
    if (va > vb) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage   = Math.min(page, totalPages);
  const rows       = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  function toggleSort(field) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    setPage(1);
  }

  function SortIcon({ field }) {
    if (sortField !== field) return <em className="fas fa-sort" style={{ marginLeft: '0.3rem', opacity: 0.3, fontSize: '0.65rem' }} />;
    return <em className={`fas fa-sort-${sortDir === 'asc' ? 'up' : 'down'}`} style={{ marginLeft: '0.3rem', color: '#cb0c9f', fontSize: '0.65rem' }} />;
  }

  // ── styles ────────────────────────────────────────────────────────────────
  const th = {
    textAlign: 'left', textTransform: 'uppercase',
    fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.02rem',
    color: 'var(--text-secondary)', padding: '0.6rem 0.75rem',
    borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap',
    background: 'var(--surface-card)',
  };
  const td = {
    padding: '0.55rem 0.75rem', fontSize: '0.8rem',
    color: 'var(--text-body)', borderBottom: '1px solid var(--border-subtle)',
    verticalAlign: 'middle',
  };
  const filters = [
    { id: 'all',      label: 'Todos' },
    { id: 'enabled',  label: 'Habilitado' },
    { id: 'disabled', label: 'Inhabilitado' },
  ];
  const filterColors = { all: '#8392ab', enabled: '#82d616', disabled: '#ea0606' };

  return (
    <Card padding="0">
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1rem 0.75rem', flexWrap: 'wrap' }}>
        <h6 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)' }}>
          Vehículos · {filtered.length}
        </h6>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--surface-input)', border: '1px solid var(--border-color)',
          borderRadius: '0.5rem', padding: '0.38rem 0.7rem', width: 220,
        }}>
          <em className="fas fa-magnifying-glass" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }} />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Buscar vehículo..."
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontFamily: "'Open Sans', sans-serif", fontSize: '0.8rem',
              color: 'var(--text-body)', width: '100%',
            }}
          />
        </div>

        {/* Status filter pills */}
        <div style={{ display: 'flex', gap: 4 }}>
          {filters.map((f) => {
            const active = filter === f.id;
            const col = filterColors[f.id];
            return (
              <button key={f.id} onClick={() => { setFilter(f.id); setPage(1); }} style={{
                padding: '0.35rem 0.9rem', borderRadius: '50rem',
                border: `1.5px solid ${active ? col : 'var(--border-subtle)'}`,
                cursor: 'pointer', fontFamily: "'Open Sans', sans-serif",
                fontSize: '0.7rem', fontWeight: 700,
                background: active ? (f.id === 'all' ? 'var(--surface-input)' : f.id === 'enabled' ? 'rgba(130,214,22,0.12)' : 'rgba(234,6,6,0.1)') : 'transparent',
                color: active ? col : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}>{f.label}</button>
            );
          })}
        </div>

        {/* Add button */}
        <div style={{ marginLeft: 'auto' }}>
          <Button color="primary" size="sm" rounded icon="fas fa-plus" />
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Open Sans', sans-serif" }}>
          <thead>
            <tr>
              <th style={{ ...th, cursor: 'pointer' }} onClick={() => toggleSort('plate')}>
                Placa <SortIcon field="plate" />
              </th>
              <th style={{ ...th, cursor: 'pointer' }} onClick={() => toggleSort('brand')}>
                Marca <SortIcon field="brand" />
              </th>
              <th style={th}>Modelo</th>
              <th style={th}>Color</th>
              <th style={{ ...th, textAlign: 'center' }}>Estado</th>
              <th style={{ ...th, textAlign: 'center' }}>Conductores vinculados</th>
              <th style={{ ...th, cursor: 'pointer', textAlign: 'center' }} onClick={() => toggleSort('created')}>
                Creado <SortIcon field="created" />
              </th>
              <th style={{ ...th, textAlign: 'center' }}>Editar</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ ...td, textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  <em className="fas fa-car" style={{ fontSize: '1.5rem', opacity: 0.3, display: 'block', marginBottom: '0.5rem' }} />
                  Sin resultados
                </td>
              </tr>
            )}
            {rows.map((v) => (
              <tr key={v.id} style={{ transition: 'background 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-input)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Plate */}
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {v.photoUrl ? (
                      <img src={v.photoUrl} alt={v.plate}
                        style={{ width: 32, height: 32, borderRadius: '0.4rem', objectFit: 'cover', border: '1px solid var(--border-subtle)', flex: 'none' }} />
                    ) : (
                      <div style={{
                        width: 32, height: 32, borderRadius: '0.4rem', flex: 'none',
                        background: 'var(--surface-input)', border: '1px solid var(--border-subtle)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <em className="fas fa-car" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }} />
                      </div>
                    )}
                    <a href="#" onClick={(e) => { e.preventDefault(); onViewVehicle && onViewVehicle(v); }}
                      style={{ fontWeight: 700, fontSize: '0.82rem', color: '#cb0c9f', textDecoration: 'none', letterSpacing: '0.02em' }}>
                      {v.plate}
                    </a>
                  </div>
                </td>

                {/* Brand */}
                <td style={td}>
                  <span style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.8rem' }}>{v.brand}</span>
                </td>

                {/* Model */}
                <td style={{ ...td, color: 'var(--text-secondary)' }}>{v.model}</td>

                {/* Color */}
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{
                      width: 13, height: 13, borderRadius: '50%', flex: 'none',
                      background: v.color?.hex || '#ccc',
                      border: '1.5px solid var(--border-color)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                    <span style={{ fontSize: '0.78rem' }}>{v.color?.name ?? '—'}</span>
                  </div>
                </td>

                {/* Status */}
                <td style={{ ...td, textAlign: 'center' }}>
                  <Badge color={v.enabled ? 'success' : 'danger'} variant="solid">
                    {v.enabled ? 'HABILITADO' : 'INHABILITADO'}
                  </Badge>
                </td>

                {/* Linked drivers count */}
                <td style={{ ...td, textAlign: 'center' }}>
                  <span style={{
                    fontWeight: 700, fontSize: '0.82rem',
                    color: v.linkedDrivers.length > 0 ? 'var(--text-heading)' : 'var(--text-secondary)',
                  }}>{v.linkedDrivers.length}</span>
                </td>

                {/* Created */}
                <td style={{ ...td, textAlign: 'center', color: 'var(--text-secondary)', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
                  {v.created}
                </td>

                {/* Edit */}
                <td style={{ ...td, textAlign: 'center' }}>
                  <button
                    title="Editar"
                    onClick={() => onViewVehicle && onViewVehicle(v)}
                    style={{
                      width: 30, height: 30, borderRadius: '0.4rem',
                      border: '1.5px solid #cb0c9f', background: 'transparent',
                      color: '#cb0c9f', cursor: 'pointer', fontSize: '0.75rem',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#cb0c9f'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cb0c9f'; }}
                  >
                    <em className="fas fa-pencil" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <span>Mostrando {Math.min((safePage - 1) * perPage + 1, filtered.length)}–{Math.min(safePage * perPage, filtered.length)} de {filtered.length}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} style={pagBtnV(false)}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)} style={pagBtnV(safePage === n)}>{n}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} style={pagBtnV(false)}>›</button>
        </div>
      </div>
    </Card>
  );
}

function pagBtnV(active) {
  return {
    width: 30, height: 30, borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
    fontFamily: "'Open Sans', sans-serif", fontSize: '0.75rem', fontWeight: 700,
    background: active ? 'linear-gradient(310deg,#7928ca,#ff0080)' : 'var(--surface-card)',
    color: active ? '#fff' : 'var(--text-secondary)',
    boxShadow: active ? '0 4px 7px -1px rgba(0,0,0,0.11)' : '0 1px 3px rgba(0,0,0,0.08)',
    border: active ? 'none' : '1px solid var(--border-subtle)',
  };
}

window.VehiclesView = VehiclesView;
