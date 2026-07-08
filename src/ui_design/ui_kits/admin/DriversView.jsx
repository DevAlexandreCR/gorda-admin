// Drivers view — searchable roster table with avatars, status badges & row actions.
function DriversView({ onEditDriver }) {
  const { Card, Avatar, Badge, Button, Switch, Select, Input } = window.GordaDesignSystem_019e24;
  const data = window.GordaData;
  const [query, setQuery] = React.useState('');

  const defaultFilters = { estado: 'todos', pago: 'todos', estadoPago: 'todos', periodo: 'jul-2026', inactividad: 'ninguno' };
  const [filters, setFilters] = React.useState(defaultFilters);
  const setFilter = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));

  const [enabledMap, setEnabledMap] = React.useState(
    Object.fromEntries(data.drivers.map((d) => [d.id, d.enabled]))
  );

  // Periodo only makes sense once a payment status has been chosen.
  const showPeriodo = filters.estadoPago !== 'todos';
  const hasActiveFilters = query !== '' || Object.keys(defaultFilters).some((k) => k !== 'periodo' && filters[k] !== defaultFilters[k]);

  const clearFilters = () => { setQuery(''); setFilters(defaultFilters); };

  const rows = data.drivers.filter((d) => {
    const matchQ = (d.name + d.email + d.plate).toLowerCase().includes(query.toLowerCase());
    const matchEstado = filters.estado === 'todos' || (filters.estado === 'activo' ? enabledMap[d.id] : !enabledMap[d.id]);
    return matchQ && matchEstado;
  });

  const th = { textAlign: 'left', textTransform: 'uppercase', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.02rem', color: 'var(--text-secondary)', padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border-subtle)' };
  const td = { padding: '0.6rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-body)', borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'middle' };

  const fieldStyle = { minWidth: 0 };

  return (
    <Card padding="0">
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1rem 0.75rem', flexWrap: 'wrap' }}>
        <h6 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)' }}>Drivers · {data.drivers.length}</h6>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.6rem' }}>
          <Button color="warning" variant="gradient" size="sm" icon="fas fa-paper-plane">Enviar mensaje</Button>
          <Button color="primary" size="sm" rounded icon="fas fa-plus" />
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: '0 1rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem 1rem', alignItems: 'end',
        }}>
          <Input
            label="Buscar" icon="fas fa-magnifying-glass" placeholder="Buscar conductor..."
            value={query} onChange={(e) => setQuery(e.target.value)} style={fieldStyle}
          />
          <Select
            label="Estado" value={filters.estado} onChange={setFilter('estado')} style={fieldStyle}
            options={[{ value: 'todos', label: 'Todos' }, { value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }]}
          />
          <Select
            label="Pago" value={filters.pago} onChange={setFilter('pago')} style={fieldStyle}
            options={[{ value: 'todos', label: 'Todos' }, { value: 'efectivo', label: 'Efectivo' }, { value: 'tarjeta', label: 'Tarjeta' }]}
          />
          <Select
            label="Estado de pago" value={filters.estadoPago} onChange={setFilter('estadoPago')} style={fieldStyle}
            options={[{ value: 'todos', label: 'Todos' }, { value: 'pagado', label: 'Pagado' }, { value: 'pendiente', label: 'Pendiente' }, { value: 'vencido', label: 'Vencido' }]}
          />
          {showPeriodo && (
            <Select
              label="Periodo" value={filters.periodo} onChange={setFilter('periodo')} style={fieldStyle}
              options={[{ value: 'jul-2026', label: 'Julio 2026' }, { value: 'jun-2026', label: 'Junio 2026' }, { value: 'may-2026', label: 'Mayo 2026' }]}
            />
          )}
          <Select
            label="Inactividad" value={filters.inactividad} onChange={setFilter('inactividad')} style={fieldStyle}
            options={[{ value: 'ninguno', label: 'Ninguno' }, { value: '7d', label: '+7 días' }, { value: '15d', label: '+15 días' }, { value: '30d', label: '+30 días' }]}
          />
        </div>
        {hasActiveFilters && (
          <button onClick={clearFilters} style={{
            marginTop: '0.75rem', border: 'none', background: 'none', cursor: 'pointer',
            fontFamily: "'Open Sans', sans-serif", fontSize: '0.75rem', fontWeight: 700,
            color: 'var(--primary)', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
          }}>
            <em className="fas fa-xmark" style={{ fontSize: '0.7rem' }} />
            Limpiar filtros
          </button>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Open Sans', sans-serif", minWidth: 700 }}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Phone</th>
            <th style={th}>Vehicle</th>
            <th style={th}>Plate</th>
            <th style={th}>Status</th>
            <th style={th}>Last connection</th>
            <th style={th}>Balance</th>
            <th style={{ ...th, textAlign: 'right' }}>Edit</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.id}>
              <td style={td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Avatar name={d.name} size="sm" status={d.status} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-heading)' }}>{d.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d.email}</div>
                  </div>
                </div>
              </td>
              <td style={{ ...td, fontWeight: 600, whiteSpace: 'nowrap' }}>{d.phone}</td>
              <td style={td}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-heading)' }}>{d.brand}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d.model}</div>
              </td>
              <td style={td}>
                <span style={{ color: 'var(--success)', marginRight: 4 }}>●</span>
                <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--primary)', fontWeight: 600 }}>{d.plate}</a>
              </td>
              <td style={td}>
                <Badge color={enabledMap[d.id] ? 'success' : 'danger'} variant="solid">{enabledMap[d.id] ? 'Enabled' : 'Disabled'}</Badge>
              </td>
              <td style={{ ...td, whiteSpace: 'nowrap' }}>{d.last}</td>
              <td style={{ ...td, fontWeight: 700, color: d.balance.includes('−') ? 'var(--danger)' : 'var(--text-heading)' }}>{d.balance}</td>
              <td style={{ ...td, textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Switch checked={enabledMap[d.id]} onChange={(v) => setEnabledMap((m) => ({ ...m, [d.id]: v }))} />
                  <em className="fas fa-pencil" style={{ color: 'var(--primary)', cursor: 'pointer' }} title="Edit" onClick={() => onEditDriver && onEditDriver(d)} />
                  <em className="fas fa-paper-plane" style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} title="Message" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span>Showing 1–{rows.length} of {data.drivers.length}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={pagBtn(false)}>‹</button>
          <button style={pagBtn(true)}>1</button>
          <button style={pagBtn(false)}>2</button>
          <button style={pagBtn(false)}>›</button>
        </div>
      </div>
    </Card>
  );
}
function pagBtn(active) {
  return {
    width: 30, height: 30, borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
    fontFamily: "'Open Sans', sans-serif", fontSize: '0.75rem', fontWeight: 700,
    background: active ? 'var(--gradient-primary)' : 'var(--surface-input)',
    color: active ? '#fff' : 'var(--text-secondary)',
    boxShadow: active ? '0 4px 7px -1px rgba(0,0,0,0.11)' : 'var(--shadow-sm)',
  };
}
window.DriversView = DriversView;
