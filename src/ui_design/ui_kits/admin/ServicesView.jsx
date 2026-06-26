// Services view — always-visible create form + Pendientes / En curso / Historial tabs
function ServicesView() {
  const { Card, StatusBadge } = window.GordaDesignSystem_019e24;
  const data = window.GordaData;
  const [tab, setTab] = React.useState('pendings');
  const [form, setForm] = React.useState({
    countryCode: '+57', phone: '', name: '',
    startAddress: '', endAddress: '', comment: '', qty: '1',
  });
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleCreate = () => {
    setForm({ countryCode: '+57', phone: '', name: '', startAddress: '', endAddress: '', comment: '', qty: '1' });
  };

  const tabs = [
    { id: 'pendings',   label: 'Pendientes', count: data.pendings.length },
    { id: 'inProgress', label: 'En curso',   count: data.inProgress.length },
    { id: 'history',    label: 'Historial',  count: data.history.length },
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
              <span style={{
                background: on ? '#cb0c9f' : 'var(--border-subtle)',
                color: on ? '#fff' : 'var(--text-secondary)',
                borderRadius: '50rem', fontSize: '0.62rem', fontWeight: 700,
                padding: '0.08rem 0.42rem', minWidth: 18, textAlign: 'center',
              }}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Always-visible Create Service panel ── */}
      <div style={{
        background: 'var(--surface-card)',
        borderRadius: '0.875rem',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}>
        {/* Panel accent bar + header */}
        <div style={{
          height: 3,
          background: 'linear-gradient(90deg, #7928ca, #ff0080)',
          borderRadius: '0.875rem 0.875rem 0 0',
        }} />
        <div style={{ padding: '0.9rem 1.25rem 1.1rem' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
            <span style={{
              width: 26, height: 26, borderRadius: '0.4rem',
              background: 'linear-gradient(310deg,#7928ca,#ff0080)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <em className="fas fa-plus" style={{ fontSize: '0.65rem', color: '#fff' }} />
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '0.01rem' }}>
              Crear servicio
            </span>
            <span style={{
              marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-muted)',
              background: 'var(--body-bg)', border: '1px solid var(--border-subtle)',
              borderRadius: '0.35rem', padding: '0.15rem 0.5rem', fontWeight: 600,
            }}>
              Admin · 5731731030
            </span>
          </div>

          {/* Fields row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '88px 148px 1fr 1fr 1fr 1fr 68px',
            gap: '0.625rem',
            alignItems: 'end',
          }}>

            {/* Country code */}
            <div>
              <label style={lbl}>Código</label>
              <select value={form.countryCode} onChange={e => setField('countryCode', e.target.value)} style={inp}>
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

          {/* CREAR button row */}
          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
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

      {/* ── Services table ── */}
      <Card padding="0">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Open Sans', sans-serif" }}>
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
            {data[tab].map((s, i) => (
              <tr key={s.id} style={{ transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--body-bg)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...td, textAlign: 'center', position: 'relative', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {i + 1}
                  {tab === 'pendings' && s.applicants > 0 && (
                    <span style={{
                      position: 'absolute', top: 6, right: 4,
                      background: '#ea0606', color: '#fff',
                      fontSize: '0.52rem', fontWeight: 700,
                      borderRadius: '50%', width: 14, height: 14,
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
                <td style={{ ...td, color: 'var(--text-heading)', fontWeight: 600 }}>{s.name}</td>
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
                  {tab === 'pendings' && (
                    <em className="fas fa-pen" style={{ color: 'var(--text-secondary)', cursor: 'pointer', marginRight: 14, transition: 'color 0.15s' }}
                      onMouseOver={e => e.target.style.color = '#cb0c9f'}
                      onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
                      title="Editar recogida"
                    />
                  )}
                  <em className="fas fa-ellipsis-vertical" style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

    </div>
  );
}
window.ServicesView = ServicesView;
