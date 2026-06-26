// ─── Settings View · Ajustes Generales · Tarifas · Mensajes ─────────────────

// ── Icon-button style factory ─────────────────────────────────────────────────
const sBtn = (bg, fg = '#fff', border) => ({
  width: 34, height: 34, flex: 'none', cursor: 'pointer', padding: 0,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: '0.45rem', fontSize: '0.8rem',
  background: bg, color: fg,
  border: border ? '1px solid var(--border-color)' : 'none',
});

// ── Section card ──────────────────────────────────────────────────────────────
function SCard({ title, action, children, noPad, style: extraStyle }) {
  return (
    <div style={{
      background: 'var(--surface-card)', borderRadius: '1rem',
      boxShadow: 'var(--shadow-card)', overflow: 'hidden',
      ...extraStyle,
    }}>
      {(title || action) && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.1rem 1.25rem 0',
        }}>
          {title && <h6 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-heading)', fontFamily: "'Open Sans', sans-serif" }}>{title}</h6>}
          {action}
        </div>
      )}
      <div style={{ padding: noPad ? 0 : '1.25rem' }}>{children}</div>
    </div>
  );
}

// ── Inline-editable field ─────────────────────────────────────────────────────
function EField({ label, value, onChange, locked }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value != null ? String(value) : '');
  const ref = React.useRef(null);

  const activate = () => {
    if (locked) return;
    setDraft(value != null ? String(value) : '');
    setEditing(true);
    setTimeout(() => ref.current && ref.current.focus(), 10);
  };
  const commit = () => { setEditing(false); onChange && onChange(draft); };
  const cancel = () => { setEditing(false); setDraft(value != null ? String(value) : ''); };

  return (
    <div>
      <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 5, fontFamily: "'Open Sans', sans-serif" }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <input ref={ref}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          readOnly={!editing || locked}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel(); }}
          style={{
            flex: 1, padding: '0.48rem 0.65rem',
            background: 'var(--surface-input)',
            border: `1px solid ${editing ? '#17c1e8' : 'var(--border-color)'}`,
            borderRadius: '0.45rem', outline: 'none',
            color: 'var(--text-heading)', fontFamily: "'Open Sans', sans-serif", fontSize: '0.875rem',
            cursor: (editing && !locked) ? 'text' : 'default',
            transition: 'border-color 0.15s',
            opacity: locked ? 0.6 : 1,
          }}
        />
        {locked ? (
          <span style={{ ...sBtn('transparent', 'var(--text-muted)'), border: '1px solid var(--border-color)' }}>
            <em className="fas fa-ban" />
          </span>
        ) : editing ? (
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={commit} style={sBtn('#17c1e8')}><em className="fas fa-check" /></button>
            <button onClick={cancel} style={sBtn('transparent', 'var(--text-body)', true)}><em className="fas fa-xmark" /></button>
          </div>
        ) : (
          <button onClick={activate} style={sBtn('#17c1e8')}><em className="fas fa-pencil" /></button>
        )}
      </div>
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function SToggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
      background: on ? 'linear-gradient(310deg,#17ad37,#98ec2d)' : 'var(--surface-input)',
      boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--border-color)',
      position: 'relative', padding: 0, flexShrink: 0, transition: 'background 0.2s',
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,.3)', transition: 'left 0.18s ease',
      }} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1 · Ajustes Generales
// ─────────────────────────────────────────────────────────────────────────────
function SettTab1() {
  const [cities, setCities] = React.useState([
    { id: 'c1', nombre: 'Popayán', activa: true, pct: 10 },
    { id: 'c2', nombre: 'Cali',    activa: true, pct: 12 },
    { id: 'c3', nombre: 'Bogotá',  activa: false, pct: 8  },
  ]);
  const [editId, setEditId]   = React.useState(null);
  const [pctDraft, setPctDraft] = React.useState('');

  const startEdit = c => { setEditId(c.id); setPctDraft(String(c.pct)); };
  const commitPct = id => {
    setCities(cs => cs.map(c => c.id === id ? { ...c, pct: parseFloat(pctDraft) || c.pct } : c));
    setEditId(null);
  };

  return (
    <SCard
      title="Sucursales"
      action={
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '0.4rem 1rem',
          background: 'var(--gradient-primary)', border: 'none', borderRadius: '0.45rem',
          color: '#fff', fontFamily: "'Open Sans', sans-serif", fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
        }}>
          <em className="fas fa-plus" /> Agregar sucursal
        </button>
      }
    >
      <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0.75rem', padding: '1.1rem 1.25rem' }}>
        {/* Country header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2.6rem', lineHeight: 1, flexShrink: 0 }}>🇨🇴</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)', fontFamily: "'Open Sans', sans-serif", lineHeight: 1.1, marginBottom: 8 }}>Colombia</div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontFamily: "'Open Sans', sans-serif" }}>Código de Llamada</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-heading)', fontFamily: "'Open Sans', sans-serif" }}>+57</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontFamily: "'Open Sans', sans-serif" }}>Código de Moneda</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-heading)', fontFamily: "'Open Sans', sans-serif" }}>COP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cities */}
        <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', fontFamily: "'Open Sans', sans-serif", marginBottom: '0.6rem' }}>
          Ciudades
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {cities.map(c => (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 0.9rem', borderRadius: '0.55rem',
              background: 'var(--surface-input)', border: '1px solid var(--border-color)',
              transition: 'border-color 0.15s',
            }}>
              <SToggle on={c.activa} onChange={() => setCities(cs => cs.map(x => x.id === c.id ? { ...x, activa: !x.activa } : x))} />

              <span style={{ flex: 1, fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.88rem', fontFamily: "'Open Sans', sans-serif" }}>{c.nombre}</span>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: "'Open Sans', sans-serif" }}>Porcentaje actual</span>
                {editId === c.id ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <input
                      value={pctDraft} onChange={e => setPctDraft(e.target.value)} autoFocus
                      onKeyDown={e => { if (e.key === 'Enter') commitPct(c.id); if (e.key === 'Escape') setEditId(null); }}
                      style={{
                        width: 54, padding: '0.28rem 0.45rem', textAlign: 'center',
                        background: 'var(--surface-input)', border: '1px solid #17c1e8',
                        borderRadius: '0.35rem', color: 'var(--text-heading)',
                        fontFamily: "'Open Sans', sans-serif", fontSize: '0.9rem', fontWeight: 800, outline: 'none',
                      }}
                    />
                    <span style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>%</span>
                    <button onClick={() => commitPct(c.id)} style={sBtn('#17c1e8')}><em className="fas fa-check" /></button>
                    <button onClick={() => setEditId(null)} style={sBtn('transparent', 'var(--text-body)', true)}><em className="fas fa-xmark" /></button>
                  </div>
                ) : (
                  <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem', minWidth: 32, textAlign: 'right', fontFamily: "'Open Sans', sans-serif" }}>{c.pct}%</span>
                )}
              </div>

              {editId !== c.id && (
                <button onClick={() => startEdit(c)} style={sBtn('#17c1e8')}><em className="fas fa-pencil" /></button>
              )}
            </div>
          ))}
        </div>
      </div>
    </SCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2 · Tarifas
// ─────────────────────────────────────────────────────────────────────────────
function SettTab2({ onSave }) {
  const [base, setBase] = React.useState({
    precioKm: '800', precioMin: '190',
    tarifaBase: '2400', adicionales: '500',
    tarifaMinActual: '6500',
    multiplicador: '1,1', nocturno: '1,1',
    domingosFestivos: '1,1', domingosFestivosNocturnos: '1,15',
  });
  const [minDin, setMinDin] = React.useState({
    diurna: '6500', nocturna: '6500', festivaDiurna: '6500', festivaNocturna: '6500',
  });
  const [mults, setMults] = React.useState([
    { id: 1, nombre: 'Hora pico Mañana', valor: '1.1', inicio: '06:00', fin: '08:00' },
    { id: 2, nombre: 'Medio Día',         valor: '1.1', inicio: '12:00', fin: '14:00' },
    { id: 3, nombre: 'Hora pico Tarde',   valor: '1.2', inicio: '17:00', fin: '19:00' },
  ]);
  const nextId = React.useRef(4);

  const updBase = k => v => setBase(b => ({ ...b, [k]: v }));
  const updMin  = k => v => setMinDin(m => ({ ...m, [k]: v }));
  const updMult = (id, k, v) => setMults(ms => ms.map(m => m.id === id ? { ...m, [k]: v } : m));
  const delMult = id => setMults(ms => ms.filter(m => m.id !== id));
  const addMult = () => {
    setMults(ms => [...ms, { id: nextId.current++, nombre: 'Nueva franja', valor: '1.0', inicio: '08:00', fin: '10:00' }]);
  };

  const EnviarBtn = ({ label }) => (
    <button onClick={() => onSave(label + ' guardado')} style={{
      padding: '0.55rem 2rem', background: 'var(--gradient-primary)',
      border: 'none', borderRadius: '0.5rem', color: '#fff',
      fontFamily: "'Open Sans', sans-serif", fontSize: '0.75rem', fontWeight: 800,
      cursor: 'pointer', letterSpacing: '0.08em',
    }}>ENVIAR</button>
  );

  const inputTime = { padding: '0.3rem 0.5rem', background: 'var(--surface-card)', border: '1px solid var(--border-color)', borderRadius: '0.4rem', color: 'var(--text-heading)', fontFamily: "'Open Sans', sans-serif", fontSize: '0.8rem', outline: 'none' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Row 1: two cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <SCard title="Tarifas Base">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <EField label="Precio por Kilómetro"       value={base.precioKm}                onChange={updBase('precioKm')} />
            <EField label="Precio por Minuto"           value={base.precioMin}               onChange={updBase('precioMin')} />
            <EField label="Tarifa Base"                 value={base.tarifaBase}              onChange={updBase('tarifaBase')} />
            <EField label="Tarifas Adicionales"         value={base.adicionales}             onChange={updBase('adicionales')} />
            <EField label="Tarifa Mínima Actual"        value={base.tarifaMinActual}         locked />
            <EField label="Multiplicador"               value={base.multiplicador}           onChange={updBase('multiplicador')} />
            <EField label="Nocturno"                    value={base.nocturno}                onChange={updBase('nocturno')} />
            <EField label="Domingos y Festivos"         value={base.domingosFestivos}        onChange={updBase('domingosFestivos')} />
            <div style={{ gridColumn: '1 / -1' }}>
              <EField label="Domingos y Festivos Nocturnos" value={base.domingosFestivosNocturnos} onChange={updBase('domingosFestivosNocturnos')} />
            </div>
          </div>
          <div style={{ marginTop: '1.1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <EnviarBtn label="Tarifas base" />
          </div>
        </SCard>

        <SCard title="Tarifa Mínima Dinámica">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <EField label="Tarifa Mínima Diurna"          value={minDin.diurna}         onChange={updMin('diurna')} />
            <EField label="Tarifa Mínima Nocturna"        value={minDin.nocturna}       onChange={updMin('nocturna')} />
            <EField label="Tarifa Mínima Festiva Diurna"  value={minDin.festivaDiurna}  onChange={updMin('festivaDiurna')} />
            <EField label="Tarifa Mínima Festiva Nocturna" value={minDin.festivaNocturna} onChange={updMin('festivaNocturna')} />
          </div>
          <div style={{ marginTop: '1.1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <EnviarBtn label="Tarifa mínima dinámica" />
          </div>
        </SCard>
      </div>

      {/* Row 2: dynamic multipliers */}
      <SCard
        title="Multiplicador Dinámico de Tarifa"
        action={
          <button onClick={addMult} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '0.4rem 1rem',
            background: 'var(--gradient-primary)', border: 'none', borderRadius: '0.45rem',
            color: '#fff', fontFamily: "'Open Sans', sans-serif", fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
          }}>
            <em className="fas fa-plus" /> Agregar franja
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {mults.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: "'Open Sans', sans-serif" }}>
              No hay franjas configuradas
            </div>
          )}
          {mults.map(m => (
            <div key={m.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              background: 'var(--surface-input)', borderRadius: '0.65rem',
              padding: '0.85rem 1rem', border: '1px solid var(--border-color)',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Name + badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.55rem' }}>
                  <input
                    value={m.nombre} onChange={e => updMult(m.id, 'nombre', e.target.value)}
                    style={{
                      background: 'transparent', border: 'none', outline: 'none',
                      fontWeight: 700, color: 'var(--text-heading)', fontSize: '0.9rem',
                      fontFamily: "'Open Sans', sans-serif", cursor: 'text', padding: 0, flex: 1,
                    }}
                  />
                  <span style={{
                    padding: '0.18rem 0.6rem', borderRadius: '0.4rem', flexShrink: 0,
                    background: 'var(--gradient-primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 800,
                  }}>{m.valor}</span>
                </div>
                {/* Time range */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontFamily: "'Open Sans', sans-serif" }}>Horarios</span>
                  <input type="time" value={m.inicio} onChange={e => updMult(m.id, 'inicio', e.target.value)} style={inputTime} />
                  <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>–</span>
                  <input type="time" value={m.fin} onChange={e => updMult(m.id, 'fin', e.target.value)} style={inputTime} />
                </div>
              </div>
              <button onClick={() => delMult(m.id)} style={sBtn('#ea0606')}>
                <em className="fas fa-trash" />
              </button>
            </div>
          ))}
        </div>
      </SCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3 · Mensajes
// ─────────────────────────────────────────────────────────────────────────────
function SettTab3() {
  const [grupos, setGrupos] = React.useState([
    {
      id: 'conf', titulo: 'Mensajes de Confirmación',
      items: [
        { key: 'cancelaciones',    nombre: 'Cancelaciones',           comentario: 'Cuando no se ha asignado un conductor',    mensaje: '_Que pena contigo_ 😔 ...', habilitado: true  },
        { key: 'cancelado',        nombre: 'Cancelado',               comentario: 'Cuando un servicio es cancelado',          mensaje: 'se ha cancelado tu solicitud...', habilitado: false },
        { key: 'conductor_llegado',nombre: 'Conductor ha llegado',    comentario: 'Cuando el conductor llega al punto',       mensaje: '¡Tu conductor ha llegado...',    habilitado: true  },
        { key: 'asignado',         nombre: 'Servicio asignado',       comentario: 'Cuando un conductor es asignado',          mensaje: 'Placa 🚗 *[[PLATE]]* col...',    habilitado: true  },
        { key: 'terminado',        nombre: 'Servicio terminado',      comentario: 'Cuando el servicio es terminado',          mensaje: 'Servicio completado! Gr...',     habilitado: false },
        { key: 'creado',           nombre: 'Servicio creado',         comentario: 'Cuando se crea el servicio',               mensaje: '*Con gusto!* 😊 en un ...',      habilitado: true  },
      ],
    },
    {
      id: 'bot', titulo: 'Chatbot Mensajes',
      items: [
        { key: 'cancelar_sin_c',    nombre: 'Cancelar si no hay conductor',      comentario: 'Solicita cancelar el servicio',              mensaje: '🔍 Seguimos buscando...',    habilitado: false },
        { key: 'cancelar_asignado', nombre: 'Cancelar en estado asignado',       comentario: 'Cuando el cliente escribe para cancelar',     mensaje: 'Tu conductor está en ca...', habilitado: false },
        { key: 'preg_ubicacion',    nombre: 'Preguntar por la ubicación',        comentario: 'Pregunta por la ubicación de recogida',       mensaje: '*[[USERNAME]]*, por fa...', habilitado: true  },
        { key: 'nombre_ubicacion',  nombre: 'Nombre de la ubicación',            comentario: 'Cuando el usuario envía su ubicación',        mensaje: '✅ *Ya tenemos tu ubic...',  habilitado: true  },
      ],
    },
  ]);

  const toggle = (gid, key) => setGrupos(gs => gs.map(g => g.id !== gid ? g : {
    ...g, items: g.items.map(it => it.key === key ? { ...it, habilitado: !it.habilitado } : it),
  }));

  const C = { nom: '22%', com: '27%', msg: '27%', st: '16%', act: '8%' };

  const th = txt => (
    <span style={{ fontSize: '0.64rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: "'Open Sans', sans-serif" }}>
      {txt}
    </span>
  );

  return (
    <SCard title="Tabla de Mensajes WhatsApp" noPad>
      {/* Column headers */}
      <div style={{ display: 'flex', padding: '0.85rem 1.25rem 0.7rem', borderBottom: '2px solid var(--border-subtle)', gap: 8 }}>
        <div style={{ width: C.nom }}>{th('Nombre')}</div>
        <div style={{ width: C.com }}>{th('Comentario')}</div>
        <div style={{ width: C.msg }}>{th('Mensajes')}</div>
        <div style={{ width: C.st  }}>{th('Estado')}</div>
        <div style={{ width: C.act }}>{th('Acciones')}</div>
      </div>

      {grupos.map(g => (
        <div key={g.id}>
          {/* Group row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.8rem 1.25rem 0.3rem' }}>
            <span style={{ width: 3, height: 15, borderRadius: 2, background: 'var(--gradient-primary)', flexShrink: 0, display: 'inline-block' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-heading)', fontFamily: "'Open Sans', sans-serif" }}>{g.titulo}</span>
          </div>

          {g.items.map((it, i) => (
            <div key={it.key} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '0.65rem 1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              background: i % 2 === 1 ? 'var(--surface-input)' : 'transparent',
            }}>
              <div style={{ width: C.nom, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-heading)', fontFamily: "'Open Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                {it.nombre}
              </div>
              <div style={{ width: C.com, fontSize: '0.78rem', color: 'var(--text-body)', fontFamily: "'Open Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                {it.comentario}
              </div>
              <div style={{ width: C.msg, fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: "'Open Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8, fontStyle: 'italic' }}>
                {it.mensaje}
              </div>
              <div style={{ width: C.st, display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'nowrap' }}>
                <SToggle on={it.habilitado} onChange={() => toggle(g.id, it.key)} />
                <span style={{
                  padding: '0.18rem 0.48rem', borderRadius: '0.4rem', flexShrink: 0,
                  fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.04em', whiteSpace: 'nowrap',
                  fontFamily: "'Open Sans', sans-serif",
                  background: it.habilitado ? 'var(--badge-success-bg)' : 'var(--badge-danger-bg)',
                  color:      it.habilitado ? 'var(--badge-success-fg)' : 'var(--badge-danger-fg)',
                }}>
                  {it.habilitado ? 'HABILITADO' : 'INHABILITADO'}
                </span>
              </div>
              <div style={{ width: C.act }}>
                <button style={sBtn('#17c1e8')}><em className="fas fa-pencil" /></button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </SCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN · SettingsView
// ─────────────────────────────────────────────────────────────────────────────
function SettingsView() {
  const [tab, setTab]         = React.useState('general');
  const [toast, setToast]     = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const timerRef              = React.useRef(null);

  const showToast = msg => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(msg);
    timerRef.current = setTimeout(() => setToast(null), 2800);
  };

  // Simulate a save: show loading overlay for 1.8 s then toast
  const handleSave = msg => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(msg);
    }, 1800);
  };

  const TABS = [
    { id: 'general',  label: 'Ajustes Generales', icon: 'fas fa-sliders'       },
    { id: 'tarifas',  label: 'Tarifas',            icon: 'fas fa-dollar-sign'   },
    { id: 'mensajes', label: 'Mensajes',            icon: 'fas fa-envelope'      },
  ];

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: 'var(--gradient-success)',
          color: '#fff', borderRadius: '0.75rem', padding: '0.7rem 1.2rem',
          boxShadow: '0 8px 24px rgba(23,173,55,0.35)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.85rem', fontWeight: 700, fontFamily: "'Open Sans', sans-serif",
        }}>
          <em className="fas fa-check-circle" />
          {toast}
        </div>
      )}

      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: '0.45rem',
              padding: '0.65rem 1.3rem', background: 'transparent', border: 'none',
              borderBottom: `2px solid ${active ? 'var(--primary)' : 'transparent'}`,
              marginBottom: -2, cursor: 'pointer',
              color: active ? 'var(--primary)' : 'var(--text-body)',
              fontFamily: "'Open Sans', sans-serif", fontSize: '0.85rem',
              fontWeight: active ? 700 : 500, whiteSpace: 'nowrap',
              transition: 'color 0.15s, border-color 0.15s',
            }}>
              <em className={t.icon} style={{ fontSize: '0.78rem' }} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Loading overlay */}
      <LoadingModal open={loading} />

      {/* Content */}
      {tab === 'general'  && <SettTab1 onSave={handleSave} />}
      {tab === 'tarifas'  && <SettTab2 onSave={handleSave} />}
      {tab === 'mensajes' && <SettTab3 />}
    </div>
  );
}

window.SettingsView = SettingsView;
