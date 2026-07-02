// Services view — always-visible create form + Pendientes / En curso / Historial tabs
function ServicesView() {
  const { Card, StatusBadge } = window.GordaDesignSystem_019e24;
  const data = window.GordaData;
  const isMobile = window.useIsMobile();
  const [tab, setTab] = React.useState('pendings');
  const [driverSearch, setDriverSearch] = React.useState('');
  const [form, setForm] = React.useState({
    line: data.adminLines[0].id, countryCode: '+57', phone: '', name: '',
    startAddress: '', endAddress: '', comment: '', qty: '1',
  });
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleCreate = () => {
    setForm(f => ({ ...f, phone: '', name: '', startAddress: '', endAddress: '', comment: '', qty: '1' }));
  };

  const tabs = [
    { id: 'pendings',   label: 'Pendientes', count: data.pendings.length },
    { id: 'inProgress', label: 'En curso',   count: data.inProgress.length },
    { id: 'history',    label: 'Historial' },
    { id: 'map',        label: 'Mapa' },
  ];

  /* ── shared micro-styles ── */
  const lbl = {
    display: 'block', fontSize: '0.6rem', fontWeight: 700,
    letterSpacing: '0.05rem', textTransform: 'uppercase',
    color: 'var(--text-muted)', marginBottom: '0.3rem',
  };
  const inp = {
    width: '100%', background: 'var(--surface-input)',
    border: '1px solid var(--border-color)', borderRadius: '0.45rem',
    color: 'var(--text-heading)', padding: '0.48rem 0.7rem',
    fontSize: '0.8rem', outline: 'none',
    fontFamily: "'Open Sans', sans-serif",
    transition: 'border-color 0.2s',
  };
  const th = {
    textAlign: 'left', textTransform: 'uppercase', fontSize: '0.6rem',
    fontWeight: 700, letterSpacing: '0.04rem', color: 'var(--text-secondary)',
    padding: '0.65rem 0.9rem', borderBottom: '1px solid var(--border-subtle)',
  };
  const td = {
    padding: '0.72rem 0.9rem', fontSize: '0.8rem', color: 'var(--text-body)',
    borderBottom: '1px solid var(--border-subtle)', verticalAlign: 'middle',
  };
  const iconBtn = {
    width: 28, height: 28, borderRadius: '0.4rem', border: 'none',
    background: 'transparent', color: 'var(--text-secondary)',
    cursor: 'pointer', fontSize: '0.85rem',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
  };

  const OriginBadge = ({ origin }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      fontSize: '0.7rem', fontWeight: 600,
      color: origin === 'bot' ? '#25d366' : 'var(--text-secondary)',
    }}>
      <em className={origin === 'bot' ? 'fa-brands fa-whatsapp' : 'fas fa-desktop'} />
      {origin === 'bot' ? 'WhatsApp Bot' : 'Admin'}
    </span>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {tabs.map((t) => {
          const on = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 1rem', borderRadius: '0.5rem',
              border: on ? '1px solid var(--border-subtle)' : '1px solid transparent',
              cursor: 'pointer',
              fontFamily: "'Open Sans', sans-serif", fontSize: '0.8rem', fontWeight: 700,
              background: on ? 'var(--surface-card)' : 'transparent',
              color: on ? 'var(--text-heading)' : 'var(--text-secondary)',
              boxShadow: on ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.18s',
            }}>
              {t.label}
              {t.count != null && (
                <span style={{
                  background: on ? '#cb0c9f' : 'var(--border-subtle)',
                  color: on ? '#fff' : 'var(--text-secondary)',
                  borderRadius: '50rem', fontSize: '0.62rem', fontWeight: 700,
                  padding: '0.08rem 0.42rem', minWidth: 18, textAlign: 'center',
                }}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── History and Map tabs get their own dedicated layouts ── */}
      {tab === 'history' && <HistoryView />}
      {tab === 'map' && <MapView />}
      {(tab === 'pendings' || tab === 'inProgress') && (
      <React.Fragment>

      {/* ── Create Service panel — Pendientes only ── */}
      {tab === 'pendings' && (
      <div style={{
        background: 'var(--surface-card)',
        borderRadius: '0.875rem',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}>
        {/* Panel accent bar */}
        <div style={{
          height: 3,
          background: 'linear-gradient(90deg, #7928ca, #ff0080)',
          borderRadius: '0.875rem 0.875rem 0 0',
        }} />
        <div style={{ padding: '0.9rem 1.25rem 1.1rem' }}>

          {/* Fields row — the fields that change per service */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : '74px 118px 1fr 1.3fr 1.3fr 1.2fr 64px',
            gap: '0.625rem',
            alignItems: 'end',
          }}>

            {/* Country code — sits next to phone, they're one unit */}
            <div>
              <label style={lbl}>Código</label>
              <select value={form.countryCode} onChange={e => setField('countryCode', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                <option value="+57">+57 CO</option>
                <option value="+1">+1  US</option>
                <option value="+52">+52 MX</option>
                <option value="+54">+54 AR</option>
                <option value="+58">+58 VE</option>
                <option value="+56">+56 CL</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label style={lbl}>Teléfono</label>
              <input
                type="tel"
                placeholder="300 000 0000"
                value={form.phone}
                onChange={e => setField('phone', e.target.value)}
                style={inp}
              />
            </div>

            {/* Name */}
            <div>
              <label style={lbl}>Nombre</label>
              <input
                type="text"
                placeholder="Nombre del pasajero"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                style={inp}
              />
            </div>

            {/* Start address */}
            <div>
              <label style={lbl}>Dirección inicial</label>
              <input
                type="text"
                placeholder="Punto de recogida"
                value={form.startAddress}
                onChange={e => setField('startAddress', e.target.value)}
                style={inp}
              />
            </div>

            {/* End address */}
            <div>
              <label style={lbl}>Dirección final</label>
              <input
                type="text"
                placeholder="Destino (opcional)"
                value={form.endAddress}
                onChange={e => setField('endAddress', e.target.value)}
                style={inp}
              />
            </div>

            {/* Comment */}
            <div>
              <label style={lbl}>Comentario</label>
              <input
                type="text"
                placeholder="Nota adicional"
                value={form.comment}
                onChange={e => setField('comment', e.target.value)}
                style={inp}
              />
            </div>

            {/* Qty */}
            <div>
              <label style={lbl}>Cant.</label>
              <select value={form.qty} onChange={e => setField('qty', e.target.value)} style={{ ...inp, textAlign: 'center', cursor: 'pointer' }}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {/* Line (rarely changes between services) + submit */}
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'end', gap: '0.625rem' }}>
            <div style={{ width: 192 }}>
              <label style={lbl}>Línea</label>
              <select value={form.line} onChange={e => setField('line', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                {data.adminLines.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
            </div>
            <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={handleCreate}
              style={{
                background: 'linear-gradient(310deg,#7928ca,#ff0080)',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.58rem 1.75rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.06rem',
                cursor: 'pointer',
                fontFamily: "'Open Sans', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 12px rgba(121,40,202,0.4)',
                transition: 'opacity 0.15s, transform 0.1s',
              }}
              onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <em className="fas fa-paper-plane" style={{ fontSize: '0.72rem' }} />
              CREAR SERVICIO
            </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ── Services table ── */}
      <Card padding="0">
        {/* Table header — title + count, search only on En curso */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem',
          padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <span style={{
              width: 32, height: 32, borderRadius: '0.5rem', flex: 'none',
              background: tab === 'pendings' ? 'linear-gradient(310deg,#f53939,#fbcf33)' : 'linear-gradient(310deg,#2152ff,#21d4fd)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem',
            }}>
              <em className={tab === 'pendings' ? 'fas fa-clock' : 'fas fa-spinner'} />
            </span>
            <h6 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)' }}>
              {tab === 'pendings' ? 'Servicios pendientes' : 'Servicios en curso'}
            </h6>
            <span style={{
              background: 'var(--surface-input)', border: '1px solid var(--border-subtle)',
              borderRadius: '50rem', padding: '0.1rem 0.6rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)',
            }}>{tab === 'pendings' ? data.pendings.length : data.inProgress.length}</span>
          </div>
          {tab === 'inProgress' && (
            <div style={{ width: isMobile ? '100%' : 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-input)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '0.48rem 0.75rem' }}>
                <em className="fas fa-magnifying-glass" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }} />
                <input
                  type="text"
                  placeholder="Buscar conductor o pasajero"
                  value={driverSearch}
                  onChange={(e) => setDriverSearch(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: '0.8rem', color: 'var(--text-body)', width: '100%' }}
                />
              </div>
            </div>
          )}
        </div>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Open Sans', sans-serif", minWidth: 640 }}>
          <thead>
            <tr>
              <th style={{ ...th, width: 44 }}>#</th>
              <th style={th}>{tab === 'history' ? 'Fecha' : 'Hora'}</th>
              <th style={th}>Estado</th>
              <th style={th}>Dir. inicial</th>
              <th style={th}>Teléfono</th>
              <th style={th}>Nombre</th>
              {(tab === 'inProgress' || tab === 'history') && <th style={th}>Conductor</th>}
              {tab === 'pendings' && <th style={th}>Comentario</th>}
              <th style={th}>Origen</th>
              <th style={{ ...th, textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {(tab === 'inProgress'
              ? data.inProgress.filter((s) => !driverSearch || (s.name + ' ' + s.phone + ' ' + s.driver).toLowerCase().includes(driverSearch.toLowerCase()))
              : data[tab]
            ).map((s, i) => (
              <tr key={s.id} style={{ transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--body-bg)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...td, textAlign: 'center', position: 'relative', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {i + 1}
                  {tab === 'pendings' && s.applicants > 0 && (
                    <span title={`${s.applicants} conductor(es) postulado(s)`} style={{
                      position: 'absolute', top: 4, right: 0,
                      background: '#ea0606', color: '#fff',
                      fontSize: '0.52rem', fontWeight: 700,
                      borderRadius: '50%', width: 15, height: 15,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(234,6,6,0.4)',
                    }}>{s.applicants}</span>
                  )}
                </td>
                <td style={{ ...td, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                  {tab === 'history' ? s.date : s.a_go}
                </td>
                <td style={td}><StatusBadge status={s.status} /></td>
                <td style={{ ...td, maxWidth: 160 }}>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.start}
                  </span>
                </td>
                <td style={{ ...td, whiteSpace: 'nowrap', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {s.phone}
                </td>
                <td style={{ ...td, color: 'var(--text-heading)', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%', flex: 'none',
                      background: 'linear-gradient(310deg,#7928ca,#ff0080)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.6rem', fontWeight: 700,
                    }}>{s.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}</span>
                    {s.name}
                  </div>
                </td>
                {tab === 'inProgress' && <td style={td}>{s.driver}</td>}
                {tab === 'history'    && <td style={td}>{s.driverName}</td>}
                {tab === 'pendings'   && (
                  <td style={{ ...td, maxWidth: 140, color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.comment}
                    </span>
                  </td>
                )}
                <td style={td}><OriginBadge origin={s.origin} /></td>
                <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    {tab === 'pendings' && (
                      <button title="Editar recogida" style={iconBtn}
                        onMouseOver={e => { e.currentTarget.style.color = '#cb0c9f'; e.currentTarget.style.background = 'var(--body-bg)'; }}
                        onMouseOut={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
                      >
                        <em className="fas fa-pen" />
                      </button>
                    )}
                    <button title="Más opciones" style={iconBtn}
                      onMouseOver={e => { e.currentTarget.style.color = '#cb0c9f'; e.currentTarget.style.background = 'var(--body-bg)'; }}
                      onMouseOut={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      <em className="fas fa-ellipsis-vertical" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>

      </React.Fragment>
      )}

    </div>
  );
}
window.ServicesView = ServicesView;
