// Historial tab — filters, summary stats and the completed/canceled services
// table. No create-service form here (that only applies to Pendientes).
function HistoryView() {
  const { Card, StatCard, Input, Select } = window.GordaDesignSystem_019e24;
  const data = window.GordaData;
  const isMobile = window.useIsMobile();

  const [filtersOpen, setFiltersOpen] = React.useState(true);
  const [filters, setFilters] = React.useState({ plate: '', client: '', from: '2026-07-01', to: '2026-07-01' });
  const [applied, setApplied] = React.useState({ plate: '', client: '', from: '', to: '' });
  const [perPage, setPerPage] = React.useState('20');
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState(null);

  const setField = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  const rows = data.history.filter((s) => {
    if (applied.plate && !s.plate.toLowerCase().includes(applied.plate.toLowerCase())) return false;
    if (applied.client && !s.phone.replace(/\s/g, '').includes(applied.client.replace(/\s/g, ''))) return false;
    return true;
  });

  const total = rows.length;
  const completed = rows.filter((s) => s.status === 'terminated').length;
  const canceled = rows.filter((s) => s.status === 'canceled').length;
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);

  const th = {
    textAlign: 'left', textTransform: 'uppercase', fontSize: '0.62rem',
    fontWeight: 700, letterSpacing: '0.04rem', color: 'var(--text-secondary)',
    padding: '0.65rem 0.9rem', borderBottom: '1px solid var(--border-subtle)',
  };
  const td = {
    padding: '0.72rem 0.9rem', fontSize: '0.8rem', color: 'var(--text-body)',
    borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'middle',
  };

  const StatusChip = ({ status }) => {
    const { StatusBadge } = window.GordaDesignSystem_019e24;
    const label = status === 'canceled' ? 'Cancelado' : 'Completado';
    return <StatusBadge status={status} label={label} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

      {/* Filtros */}
      <Card padding="0">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem', borderBottom: filtersOpen ? '1px solid var(--border-subtle)' : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              width: 30, height: 30, borderRadius: '0.45rem', flex: 'none',
              background: 'linear-gradient(310deg,#7928ca,#ff0080)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem',
            }}>
              <em className="fas fa-filter" />
            </span>
            <h6 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)' }}>Filtros</h6>
          </div>
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            title={filtersOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
            style={{
              width: 34, height: 34, borderRadius: '0.5rem', border: '1px solid var(--border-color)',
              background: 'var(--surface-input)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem',
            }}
          >
            <em className={filtersOpen ? 'fas fa-chevron-up' : 'fas fa-bars'} />
          </button>
        </div>

        {filtersOpen && (
          <div style={{ padding: '1.1rem 1.25rem 1.25rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 0.8fr 0.8fr auto auto',
              gap: '0.75rem', alignItems: 'end',
            }}>
              <Input label="Placa conductor" placeholder="Placa conductor" value={filters.plate} onChange={(e) => setField('plate', e.target.value)} />
              <Input label="Número del cliente" placeholder="Número del cliente" value={filters.client} onChange={(e) => setField('client', e.target.value)} />
              <Input label="Desde" type="date" value={filters.from} onChange={(e) => setField('from', e.target.value)} />
              <Input label="Hasta" type="date" value={filters.to} onChange={(e) => setField('to', e.target.value)} />
              <button
                onClick={() => { setApplied(filters); setPage(1); }}
                style={{
                  background: 'linear-gradient(310deg,#7928ca,#ff0080)', color: '#fff', border: 'none',
                  borderRadius: '0.5rem', padding: '0.6rem 1.4rem', fontSize: '0.75rem', fontWeight: 700,
                  letterSpacing: '0.05rem', textTransform: 'uppercase', cursor: 'pointer',
                  fontFamily: "'Open Sans', sans-serif", boxShadow: '0 4px 12px rgba(121,40,202,0.35)',
                }}
              >Filtrar</button>
              <button
                onClick={() => { const c = { plate: '', client: '', from: '', to: '' }; setFilters(c); setApplied(c); setPage(1); }}
                style={{
                  background: 'var(--surface-input)', color: 'var(--text-heading)', border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem', padding: '0.6rem 1.3rem', fontSize: '0.75rem', fontWeight: 700,
                  letterSpacing: '0.05rem', textTransform: 'uppercase', cursor: 'pointer',
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >Limpiar filtros</button>
            </div>
          </div>
        )}
      </Card>

      {/* Stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '0.875rem' }}>
        <StatCard label="Total" value={total} delta="Servicios" deltaUp icon="fas fa-arrow-up-short-wide" color="dark" />
        <StatCard label="Completado" value={completed} delta={`${pct(completed)}%`} deltaUp icon="fas fa-thumbs-up" color="primary" />
        <StatCard label="Cancelado" value={canceled} delta={`${pct(canceled)}%`} deltaUp icon="fas fa-thumbs-down" color="danger" />
      </div>

      {/* Table */}
      <Card padding="0">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Open Sans', sans-serif", minWidth: 760 }}>
            <thead>
              <tr>
                <th style={{ ...th, width: 44 }}>#</th>
                <th style={th}>Fecha</th>
                <th style={th}>Estado</th>
                <th style={th}>Dir. inicial</th>
                <th style={th}>Teléfono</th>
                <th style={th}>Nombre</th>
                <th style={th}>Comentario</th>
                <th style={th}>Conductor</th>
                <th style={{ ...th, textAlign: 'right' }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s, i) => (
                <tr
                  key={s.id} onClick={() => setSelected(s)}
                  style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'var(--body-bg)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ ...td, textAlign: 'center', fontWeight: 700, color: 'var(--text-secondary)' }}>{i + 1}</td>
                  <td style={{ ...td, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{s.date}</td>
                  <td style={td}><StatusChip status={s.status} /></td>
                  <td style={{ ...td, maxWidth: 160 }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.start}</span>
                  </td>
                  <td style={{ ...td, whiteSpace: 'nowrap', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{s.phone}</td>
                  <td style={{ ...td, color: 'var(--text-heading)', fontWeight: 600 }}>{s.name}</td>
                  <td style={{ ...td, maxWidth: 140, color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.comment}</span>
                  </td>
                  <td style={td}>{s.driverName}</td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <em className="fas fa-chevron-right" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={9} style={{ ...td, textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>Sin resultados para los filtros aplicados.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: page size + pagination */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
          padding: '0.9rem 1.1rem', borderTop: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-heading)' }}>Elementos por página</span>
            <Select value={perPage} onChange={(e) => setPerPage(e.target.value)} options={['10', '20', '50']} style={{ width: 84 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button style={pagerBtn} disabled><em className="fas fa-chevron-left" /></button>
            <button style={{ ...pagerBtn, background: '#cb0c9f', color: '#fff', border: 'none' }}>1</button>
            <button style={pagerBtn} disabled><em className="fas fa-chevron-right" /></button>
          </div>
        </div>
      </Card>

      <ServiceDetailModal service={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

const pagerBtn = {
  width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border-color)',
  background: 'var(--surface-input)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem',
};

window.HistoryView = HistoryView;
