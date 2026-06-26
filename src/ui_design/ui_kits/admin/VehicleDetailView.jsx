// Vehicle detail view — info card + linked drivers with selectable toggles.
function VehicleDetailView({ vehicle: initialVehicle, onBack }) {
  const { Card, Badge, Button, Switch } = window.GordaDesignSystem_019e24;

  const [vehicle, setVehicle] = React.useState(initialVehicle);

  function toggleSelectable(driverId, newVal) {
    setVehicle(v => ({
      ...v,
      linkedDrivers: v.linkedDrivers.map(d =>
        d.id === driverId ? { ...d, selectable: newVal } : d
      ),
    }));
  }

  // Expiry status helper
  function expiryStatus(dateStr) {
    if (!dateStr || dateStr === '—') return 'neutral';
    const exp  = new Date(dateStr);
    const now  = new Date();
    const diff = (exp - now) / (1000 * 60 * 60 * 24); // days
    if (diff < 0)   return 'expired';
    if (diff < 30)  return 'warning';
    return 'ok';
  }

  function ExpiryBadge({ date }) {
    const status = expiryStatus(date);
    const cfg = {
      expired: { bg: '#fde0e0', fg: '#b30505', icon: 'fas fa-triangle-exclamation', label: 'Vencido' },
      warning: { bg: '#fef6d8', fg: '#9a7b00', icon: 'fas fa-clock',                label: 'Por vencer' },
      ok:      { bg: '#eafad0', fg: '#4d8b00', icon: 'fas fa-check',                label: null },
      neutral: { bg: 'var(--surface-input)', fg: 'var(--text-secondary)', icon: null, label: null },
    }[status];
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-heading)' }}>
        {date || '—'}
        {cfg.icon && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.1rem 0.45rem', borderRadius: '50rem',
            background: cfg.bg, color: cfg.fg, fontSize: '0.62rem', fontWeight: 700,
          }}>
            <em className={cfg.icon} />{cfg.label}
          </span>
        )}
      </span>
    );
  }

  // ── table styles ──────────────────────────────────────────────────────────
  const thD = {
    textAlign: 'left', textTransform: 'uppercase',
    fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.04em',
    color: 'var(--text-secondary)', padding: '0.55rem 1rem',
    borderBottom: '1px solid var(--border-subtle)',
    background: 'var(--body-bg)',
  };
  const tdKey = {
    padding: '0.65rem 1rem', fontSize: '0.75rem', fontWeight: 700,
    color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)',
    textTransform: 'uppercase', letterSpacing: '0.02em', width: '42%',
    whiteSpace: 'nowrap',
  };
  const tdVal = {
    padding: '0.65rem 1rem', fontSize: '0.82rem',
    color: 'var(--text-heading)', borderBottom: '1px solid var(--border-subtle)',
  };
  const thL = {
    textAlign: 'left', textTransform: 'uppercase',
    fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.04em',
    color: 'var(--text-secondary)', padding: '0.55rem 1rem',
    borderBottom: '1px solid var(--border-subtle)',
    background: 'var(--body-bg)',
  };
  const tdL = {
    padding: '0.65rem 1rem', fontSize: '0.8rem',
    color: 'var(--text-heading)', borderBottom: '1px solid var(--border-subtle)',
    verticalAlign: 'middle',
  };

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif" }}>

      {/* ── Page header breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span style={{ opacity: 0.6 }}>Vehículos</span>
            <span style={{ margin: '0 0.4rem', opacity: 0.5 }}>/</span>
            <span style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{vehicle.plate}</span>
          </div>
          <h6 style={{ margin: '0.1rem 0 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            {vehicle.brand} {vehicle.model}
          </h6>
        </div>

        {/* Action buttons — mirrors the screenshot exactly */}
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button onClick={onBack} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.45rem 1.1rem', borderRadius: '0.5rem', border: 'none',
            background: 'linear-gradient(310deg,#2152ff,#21d4fd)',
            color: '#fff', fontFamily: "'Open Sans', sans-serif",
            fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(33,82,255,0.35)', transition: 'opacity 0.15s',
            letterSpacing: '0.02em',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <em className="fas fa-arrow-left" />REGRESAR
          </button>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.45rem 1.1rem', borderRadius: '0.5rem',
            border: '1.5px solid #cb0c9f', background: 'transparent',
            color: '#cb0c9f', fontFamily: "'Open Sans', sans-serif",
            fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.15s', letterSpacing: '0.02em',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#cb0c9f'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#cb0c9f'; }}
          >
            <em className="fas fa-pencil" />EDITAR
          </button>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.25rem', alignItems: 'start' }}>

        {/* LEFT — Detalle del Vehículo */}
        <Card padding="0">
          {/* Card header */}
          <div style={{
            padding: '1rem 1.25rem 0.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span style={{
              width: 30, height: 30, borderRadius: '0.45rem', flex: 'none',
              background: 'linear-gradient(310deg,#7928ca,#ff0080)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '0.75rem',
            }}>
              <em className="fas fa-car-side" />
            </span>
            <h6 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)' }}>
              Detalle del Vehículo
            </h6>
          </div>

          {/* Vehicle photo / placeholder */}
          <div style={{
            margin: '1.25rem auto',
            width: 180, height: 140,
            borderRadius: '0.75rem',
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            background: 'var(--surface-input)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {vehicle.photoUrl ? (
              <img src={vehicle.photoUrl} alt={vehicle.plate}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <em className="fas fa-car-side" style={{ fontSize: '3.5rem', opacity: 0.25 }} />
                <div style={{ fontSize: '0.65rem', marginTop: '0.4rem', opacity: 0.4 }}>Sin foto</div>
              </div>
            )}
          </div>

          {/* Details table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Open Sans', sans-serif" }}>
            <tbody>
              {[
                { key: 'Placa',   val: <span style={{ fontWeight: 800, color: '#cb0c9f', letterSpacing: '0.06em' }}>{vehicle.plate}</span> },
                { key: 'Marca',   val: vehicle.brand },
                { key: 'Modelo',  val: vehicle.model },
                { key: 'Año',     val: vehicle.year },
                {
                  key: 'Color', val: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{
                        width: 14, height: 14, borderRadius: '50%', flex: 'none',
                        background: vehicle.color?.hex || '#ccc',
                        border: '1.5px solid var(--border-color)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                      {vehicle.color?.name ?? '—'}
                    </div>
                  ),
                },
                {
                  key: 'Estado', val: (
                    <Badge color={vehicle.enabled ? 'success' : 'danger'} variant="solid">
                      {vehicle.enabled ? 'HABILITADO' : 'INHABILITADO'}
                    </Badge>
                  ),
                },
                { key: 'Venc. SOAT',    val: <ExpiryBadge date={vehicle.soat} /> },
                { key: 'Venc. Tec-Mec', val: <ExpiryBadge date={vehicle.tec}  /> },
              ].map(({ key, val }) => (
                <tr key={key}>
                  <td style={tdKey}>{key}</td>
                  <td style={tdVal}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* RIGHT — Conductores Vinculados */}
        <Card padding="0">
          {/* Card header */}
          <div style={{
            padding: '1rem 1.25rem 0.75rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span style={{
              width: 30, height: 30, borderRadius: '0.45rem', flex: 'none',
              background: 'linear-gradient(310deg,#17ad37,#98ec2d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '0.75rem',
            }}>
              <em className="fas fa-users" />
            </span>
            <h6 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)' }}>
              Conductores Vinculados
            </h6>
            <span style={{
              marginLeft: 'auto',
              background: 'var(--surface-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50rem',
              padding: '0.1rem 0.6rem',
              fontSize: '0.7rem', fontWeight: 700,
              color: 'var(--text-secondary)',
            }}>{vehicle.linkedDrivers.length}</span>
          </div>

          {vehicle.linkedDrivers.length === 0 ? (
            <div style={{
              padding: '3rem 1.5rem', textAlign: 'center',
              color: 'var(--text-secondary)',
            }}>
              <em className="fas fa-users-slash" style={{ fontSize: '2rem', opacity: 0.25, display: 'block', marginBottom: '0.75rem' }} />
              <p style={{ margin: 0, fontSize: '0.82rem' }}>No hay conductores vinculados a este vehículo.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Open Sans', sans-serif" }}>
              <thead>
                <tr>
                  <th style={thL}>Nombre</th>
                  <th style={{ ...thL, textAlign: 'right' }}>Seleccionable</th>
                </tr>
              </thead>
              <tbody>
                {vehicle.linkedDrivers.map((d) => (
                  <tr key={d.id}
                    style={{ transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-input)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={tdL}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        {/* Avatar initials */}
                        <span style={{
                          width: 30, height: 30, borderRadius: '50%', flex: 'none',
                          background: 'linear-gradient(310deg,#7928ca,#ff0080)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                        }}>
                          {d.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                        </span>
                        <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{d.name}</span>
                      </div>
                    </td>
                    <td style={{ ...tdL, textAlign: 'right' }}>
                      <Switch
                        checked={d.selectable}
                        onChange={(val) => toggleSelectable(d.id, val)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Info strip */}
          <div style={{
            margin: '0.75rem 1rem',
            padding: '0.6rem 0.85rem',
            background: 'var(--body-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '0.5rem',
            display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
            fontSize: '0.73rem', color: 'var(--text-secondary)', lineHeight: 1.45,
          }}>
            <em className="fas fa-circle-info" style={{ color: '#17c1e8', marginTop: '0.1rem', flex: 'none' }} />
            <span>
              Activa <strong style={{ color: 'var(--text-heading)' }}>Seleccionable</strong> para que el conductor pueda usar este vehículo al aceptar servicios. Solo un conductor puede tener el vehículo activo a la vez.
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

window.VehicleDetailView = VehicleDetailView;
