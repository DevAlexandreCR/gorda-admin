// Vehicle detail view — direct-edit form (no separate read-only mode) + linked drivers.
function VehicleDetailView({ vehicle: initialVehicle, onBack }) {
  const { Card, Badge, Button, Switch, Input } = window.GordaDesignSystem_019e24;
  const isMobile = window.useIsMobile();

  const [vehicle, setVehicle] = React.useState(initialVehicle);
  const [form, setForm] = React.useState({
    plate: initialVehicle.plate || '',
    brand: initialVehicle.brand || '',
    model: initialVehicle.model || '',
    photoUrl: initialVehicle.photoUrl || '',
    enabled: initialVehicle.enabled,
    colorName: initialVehicle.color?.name || '',
    colorHex: initialVehicle.color?.hex || '#8392ab',
    soat: initialVehicle.soat || '',
    tec: initialVehicle.tec || '',
  });
  const [saved, setSaved] = React.useState(false);
  const savedTimer = React.useRef(null);
  const colorPickerRef = React.useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function toggleSelectable(driverId, newVal) {
    setVehicle(v => ({
      ...v,
      linkedDrivers: v.linkedDrivers.map(d =>
        d.id === driverId ? { ...d, selectable: newVal } : d
      ),
    }));
  }

  function handleSubmit() {
    setVehicle(v => ({
      ...v,
      plate: form.plate, brand: form.brand, model: form.model,
      photoUrl: form.photoUrl, enabled: form.enabled,
      color: { name: form.colorName, hex: form.colorHex },
      soat: form.soat, tec: form.tec,
    }));
    setSaved(true);
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 1800);
  }

  React.useEffect(() => () => clearTimeout(savedTimer.current), []);

  // Expiry helper — shown as a small hint under the date fields, not a new field.
  function expiryHint(dateStr) {
    if (!dateStr) return null;
    const exp = new Date(dateStr);
    const now = new Date();
    const diff = Math.round((exp - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { color: '#ea0606', text: 'Vencido' };
    if (diff < 30) return { color: '#fbcf33', text: `Vence en ${diff} días` };
    return { color: '#82d616', text: `Vigente · ${diff} días` };
  }

  const soatHint = expiryHint(form.soat);
  const tecHint = expiryHint(form.tec);

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

        <Button color="info" variant="gradient" size="sm" icon="fas fa-arrow-left" onClick={onBack}>
          Regresar
        </Button>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1.25fr) minmax(0,1fr)', gap: '1.25rem', alignItems: 'start' }}>

        {/* LEFT — Editar Vehículo (direct-edit form) */}
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
              Editar Vehículo
            </h6>
          </div>

          <div style={{ padding: '1.25rem' }}>

            {/* Photo + URL + Estado — centered, compact */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', width: 164, height: 128 }}>
                <div style={{
                  width: '100%', height: '100%',
                  borderRadius: '0.75rem', overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--surface-input)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {form.photoUrl ? (
                    <img src={form.photoUrl} alt={form.plate}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <em className="fas fa-car-side" style={{ fontSize: '3rem', opacity: 0.25 }} />
                    </div>
                  )}
                </div>
                <button
                  title="Cambiar foto"
                  onClick={() => document.getElementById('vehicle-photo-url')?.focus()}
                  style={{
                    position: 'absolute', bottom: -10, right: -10,
                    width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--surface-card)',
                    background: 'linear-gradient(310deg,#17c1e8,#21d4fd)', color: '#fff',
                    cursor: 'pointer', fontSize: '0.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                  }}
                >
                  <em className="fas fa-pencil" />
                </button>
              </div>

              <Input id="vehicle-photo-url" label="URL de la foto" value={form.photoUrl} onChange={set('photoUrl')}
                placeholder="https://…" icon="fas fa-link" style={{ width: '100%', maxWidth: 340 }} />

              <Switch
                checked={form.enabled}
                onChange={(v) => setForm(f => ({ ...f, enabled: v }))}
                label={form.enabled ? 'Habilitado' : 'Inhabilitado'}
              />
            </div>

            {/* Form fields — two per row, so the card stays wide & compact instead of tall & narrow */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem' }}>
                <Input label="Placa" value={form.plate} onChange={set('plate')} placeholder="ABC123" icon="fas fa-id-card" />
                <Input label="Marca" value={form.brand} onChange={set('brand')} placeholder="Marca del vehículo" icon="fas fa-industry" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem' }}>
                <Input label="Modelo" value={form.model} onChange={set('model')} placeholder="Año / modelo" icon="fas fa-calendar" />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.5rem', marginLeft: '0.25rem' }}>Color</div>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'stretch' }}>
                    <Input value={form.colorName} onChange={set('colorName')} placeholder="Nombre del color" style={{ flex: 1, minWidth: 0 }} />
                    <button
                      title="Elegir color"
                      onClick={() => colorPickerRef.current?.click()}
                      style={{
                        width: 42, flex: 'none', borderRadius: '0.5rem',
                        border: '1px solid var(--border-color)', cursor: 'pointer',
                        background: form.colorHex, position: 'relative', overflow: 'hidden',
                      }}
                    >
                      <input
                        ref={colorPickerRef} type="color" value={form.colorHex}
                        onChange={(e) => setForm(f => ({ ...f, colorHex: e.target.value }))}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', border: 'none', padding: 0 }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem' }}>
                <div style={{ minWidth: 0 }}>
                  <Input type="date" label="Soat" value={form.soat} onChange={set('soat')} icon="fas fa-file-shield" />
                  {soatHint && (
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: soatHint.color, marginTop: '0.35rem', marginLeft: '0.25rem' }}>{soatHint.text}</div>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <Input type="date" label="Tecno-mecánica" value={form.tec} onChange={set('tec')} icon="fas fa-gauge" />
                  {tecHint && (
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: tecHint.color, marginTop: '0.35rem', marginLeft: '0.25rem' }}>{tecHint.text}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
              {saved && (
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#82d616', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <em className="fas fa-check-circle" />Guardado
                </span>
              )}
              <Button color="info" variant="gradient" size="sm" icon="fas fa-paper-plane" onClick={handleSubmit}>
                Enviar
              </Button>
            </div>
          </div>
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
