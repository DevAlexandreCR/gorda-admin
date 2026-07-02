// Edit Driver view — Gorda DS
// Layout: full-width profile header + two balanced columns + tabbed history + modals
function EditDriverView({ driver, onBack }) {
  const { Card, Avatar, Badge, Button, Input, Select, Switch } = window.GordaDesignSystem_019e24;
  const isMobile = window.useIsMobile();

  // ── form state ───────────────────────────────────────────────────────────
  const [form, setForm] = React.useState({
    name:    driver.name  || '',
    email:   driver.email || '',
    password:'secreto123',
    phone:   driver.phone || '',
    phone2:  '',
    docType: 'CC',
    doc:     '1097391384',
    enabled: driver.enabled !== undefined ? driver.enabled : true,
    payMode: 'Mensualidad',
  });
  const [emailLocked, setEmailLocked] = React.useState(true);
  const [passLocked,  setPassLocked]  = React.useState(true);
  const [vehicles, setVehicles] = React.useState([
    { id: 1, plate: 'AAA123', model: 'Vehículo Xxx', selectable: true,  enabled: true  },
    { id: 2, plate: 'FPK979', model: 'Mazda Cx-3',   selectable: false, enabled: false },
  ]);
  const [device,     setDevice]     = React.useState('Google Pixel 7');
  const [historyTab, setHistoryTab] = React.useState('saldo');

  // ── modal state ──────────────────────────────────────────────────────────
  const [modal, setModal] = React.useState(null); // 'saldo' | 'mensualidad' | 'vehiculo'
  const closeModal = () => setModal(null);

  // Administrar saldo form
  const [saldoForm, setSaldoForm] = React.useState({ tipo: 'agregar', monto: '', nota: '' });
  // Registrar mensualidad form
  const [mensForm, setMensForm] = React.useState({ periodo: '2026-07', monto: '100000', nota: '' });
  // Agregar vehículo form
  // ── colors & mock vehicle DB ─────────────────────────────────────────────
  const COLORS = [
    { name: 'Negro', hex: '#000000' }, { name: 'Azul', hex: '#0000FF' },
    { name: 'Gris', hex: '#808080' }, { name: 'Verde', hex: '#008000' },
    { name: 'Morado', hex: '#800080' }, { name: 'Rojo', hex: '#FF0000' },
    { name: 'Blanco', hex: '#FFFFFF' }, { name: 'Rosado', hex: '#FFC0CB' },
    { name: 'Naranja', hex: '#FFA500' }, { name: 'Dorado', hex: '#FFD700' },
    { name: 'Amarillo', hex: '#FFFF00' }, { name: 'Café', hex: '#A52A2A' },
    { name: 'Plateado', hex: '#C0C0C0' }, { name: 'Beige', hex: '#F5F5DC' },
  ];
  const VEHICLE_DB = [
    { id: 'vaaa', plate: 'AAA123', brand: 'Vehiculo', model: 'Xxx', year: '2026' },
    { id: 'vfpk', plate: 'FPK979', brand: 'Mazda', model: 'Cx-3', year: '2024' },
    { id: 'vkxt', plate: 'KXT482', brand: 'Chevrolet', model: 'Spark GT', year: '2022' },
    { id: 'vhjs', plate: 'HJS119', brand: 'Renault', model: 'Logan', year: '2021' },
    { id: 'vfbd', plate: 'FBD903', brand: 'Kia', model: 'Picanto', year: '2023' },
    { id: 'vlmn', plate: 'LMN558', brand: 'Mazda', model: '2', year: '2023' },
  ];

  const [vehForm, setVehForm] = React.useState({ placa: '', marca: '', modelo: '', color: '#000000', soat: '', tec: '', fileError: '' });
  // Lookup
  const [showLookup, setShowLookup] = React.useState(false);
  const [lookupInput, setLookupInput] = React.useState('');
  const [lookupFocused, setLookupFocused] = React.useState(false);
  const [lookupActive, setLookupActive] = React.useState(-1);
  const lookupDropdownOpen = lookupFocused && lookupInput.length >= 3;
  const lookupSuggestions = lookupInput.length >= 3
    ? VEHICLE_DB.filter(v => v.plate.toLowerCase().includes(lookupInput.toLowerCase()))
    : [];

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  // ── mock history data ─────────────────────────────────────────────────────
  const [histSaldo, setHistSaldo] = React.useState([
    { date: '15/06/26 03:01', amount: '-2 000',  balance: '8 000',  by: 'Super Admin', note: 'ajuste'    },
    { date: '15/06/26 03:00', amount: '+10 000', balance: '10 000', by: 'Super Admin', note: ''          },
    { date: '14/06/26 18:40', amount: '-500',    balance: '0',      by: 'Super Admin', note: 'descuento' },
  ]);
  const [histMens, setHistMens] = React.useState([
    { period: '2026-06', amount: '100 000', by: 'Super Admin', date: '18/06/26 22:13', note: '' },
    { period: '2026-05', amount: '100 000', by: 'Super Admin', date: '01/05/26 09:00', note: '' },
  ]);
  const [saldoActual, setSaldoActual] = React.useState(8000);

  // ── tokens ────────────────────────────────────────────────────────────────
  const divider  = { border: 0, borderTop: '1px solid #e9ecef', margin: '0.5rem 0' };
  const fLabel   = { fontSize: '0.75rem', fontWeight: 700, color: '#344767', marginBottom: '0.5rem', marginLeft: '0.25rem' };
  const lockBtn  = {
    marginTop: '0.3rem', background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '0.7rem', fontWeight: 700, color: '#cb0c9f',
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem', paddingLeft: '0.25rem',
  };
  const th = {
    textAlign: 'left', textTransform: 'uppercase', fontSize: '0.62rem',
    fontWeight: 700, letterSpacing: '0.04em', color: '#8392ab',
    padding: '0.6rem 1.25rem', background: 'rgba(255,255,255,0.04)',
  };
  const td = { padding: '0.75rem 1.25rem', fontSize: '0.8rem', color: '#67748e', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle' };

  // ── tab pill ──────────────────────────────────────────────────────────────
  function TabPill({ id, label, icon }) {
    const active = historyTab === id;
    return (
      <button onClick={() => setHistoryTab(id)} style={{
        padding: '0.35rem 0.9rem', borderRadius: '50rem', border: '1px solid',
        cursor: 'pointer', fontFamily: "'Open Sans', sans-serif",
        fontSize: '0.72rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        borderColor: active ? '#cb0c9f' : '#e9ecef',
        background:   active ? '#fde6f7' : '#fff',
        color:        active ? '#a30c80' : '#8392ab',
        transition: 'all 0.15s',
      }}><em className={icon} />{label}</button>
    );
  }

  // ── shared Modal wrapper ──────────────────────────────────────────────────
  function Modal({ title, icon, onClose, width = 440, children, footer }) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(52,71,103,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(2px)',
      }} onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={{
          background: '#fff', borderRadius: '1rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          width, maxWidth: 'calc(100vw - 2rem)',
          fontFamily: "'Open Sans', sans-serif",
          overflow: 'hidden',
        }}>
          {/* Modal header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.1rem 1.5rem', borderBottom: '1px solid #e9ecef',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{
                width: 32, height: 32, borderRadius: '0.5rem', flex: 'none',
                background: 'linear-gradient(310deg,#7928ca,#ff0080)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '0.78rem',
              }}><em className={icon} /></span>
              <h6 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#344767' }}>{title}</h6>
            </div>
            <button onClick={onClose} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#8392ab', fontSize: '1rem', lineHeight: 1,
              width: 28, height: 28, borderRadius: '0.4rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><em className="fas fa-xmark" /></button>
          </div>
          {/* Modal body */}
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {children}
          </div>
          {/* Modal footer */}
          {footer && (
            <div style={{ padding: '0 1.5rem 1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Modal: Administrar saldo ──────────────────────────────────────────────
  function ModalSaldo() {
    const isSuma = saldoForm.tipo === 'agregar';
    const preview = saldoForm.monto
      ? (isSuma ? saldoActual + parseInt(saldoForm.monto || 0) : saldoActual - parseInt(saldoForm.monto || 0))
      : null;
    return (
      <Modal
        title="Administrar saldo"
        icon="fas fa-coins"
        onClose={closeModal}
        footer={<>
          <Button color="secondary" variant="outline" size="sm" onClick={closeModal}>Cancelar</Button>
          <Button color="primary" variant="gradient" size="sm" icon="fas fa-check"
            disabled={!saldoForm.monto}
            onClick={() => {
              const delta = parseInt(saldoForm.monto);
              const nuevo = isSuma ? saldoActual + delta : saldoActual - delta;
              setSaldoActual(nuevo);
              const now = new Date();
              const pad = n => String(n).padStart(2,'0');
              const dateStr = `${pad(now.getDate())}/${String(now.getFullYear()).slice(2)}-${pad(now.getMonth()+1)} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
              setHistSaldo(h => [{
                date: dateStr,
                amount: (isSuma ? '+' : '-') + ' ' + delta.toLocaleString('es-CO'),
                balance: nuevo.toLocaleString('es-CO'),
                by: 'Super Admin',
                note: saldoForm.nota,
              }, ...h]);
              setSaldoForm({ tipo: 'agregar', monto: '', nota: '' });
              closeModal();
            }}
          >Aplicar ajuste</Button>
        </>}
      >
        {/* Current balance chip */}
        <div style={{
          background: 'linear-gradient(310deg,#141727,#3a416f)',
          borderRadius: '0.75rem', padding: '0.85rem 1.1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Saldo actual</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>
              {saldoActual.toLocaleString('es-CO')} <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>COP</span>
            </div>
          </div>
          {preview !== null && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Resultante</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: preview >= 0 ? '#82d616' : '#ff6690', letterSpacing: '-0.02em' }}>
                {preview.toLocaleString('es-CO')} <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>COP</span>
              </div>
            </div>
          )}
        </div>

        {/* Tipo toggle */}
        <div>
          <div style={fLabel}>Tipo de ajuste</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[['agregar','fas fa-plus','Agregar','#82d616','#f0fde8'],['descontar','fas fa-minus','Descontar','#ea0606','#fdeaea']].map(([v, ic, lb, col, bg]) => (
              <button key={v} onClick={() => setSaldoForm(f => ({ ...f, tipo: v }))} style={{
                flex: 1, padding: '0.6rem', borderRadius: '0.6rem', cursor: 'pointer',
                border: `2px solid ${saldoForm.tipo === v ? col : '#e9ecef'}`,
                background: saldoForm.tipo === v ? bg : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                fontFamily: "'Open Sans', sans-serif", fontSize: '0.78rem', fontWeight: 700,
                color: saldoForm.tipo === v ? col : '#8392ab',
                transition: 'all 0.15s',
              }}>
                <em className={ic} />{lb}
              </button>
            ))}
          </div>
        </div>

        {/* Monto */}
        <Input
          label="Monto (COP)"
          value={saldoForm.monto}
          onChange={e => setSaldoForm(f => ({ ...f, monto: e.target.value.replace(/\D/g,'') }))}
          placeholder="Ej. 5000"
          icon="fas fa-dollar-sign"
          type="text"
          inputMode="numeric"
        />

        {/* Nota */}
        <div>
          <div style={fLabel}>Nota (opcional)</div>
          <div style={{
            border: '1px solid #d2d6da', borderRadius: '0.5rem', overflow: 'hidden',
          }}>
            <textarea
              value={saldoForm.nota}
              onChange={e => setSaldoForm(f => ({ ...f, nota: e.target.value }))}
              placeholder="Motivo del ajuste…"
              rows={2}
              style={{
                width: '100%', border: 'none', outline: 'none', resize: 'none',
                fontFamily: "'Open Sans', sans-serif", fontSize: '0.875rem', color: '#495057',
                padding: '0.5rem 0.75rem', boxSizing: 'border-box', background: '#fff',
              }}
            />
          </div>
        </div>
      </Modal>
    );
  }

  // ── Modal: Registrar mensualidad ──────────────────────────────────────────
  function ModalMensualidad() {
    const meses = ['2026-08','2026-07','2026-06','2026-05','2026-04'];
    return (
      <Modal
        title="Registrar mensualidad"
        icon="fas fa-calendar-check"
        onClose={closeModal}
        footer={<>
          <Button color="secondary" variant="outline" size="sm" onClick={closeModal}>Cancelar</Button>
          <Button color="primary" variant="gradient" size="sm" icon="fas fa-calendar-plus"
            disabled={!mensForm.periodo || !mensForm.monto}
            onClick={() => {
              const now = new Date();
              const pad = n => String(n).padStart(2,'0');
              const dateStr = `${pad(now.getDate())}/${String(now.getFullYear()).slice(2)}-${pad(now.getMonth()+1)} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
              setHistMens(h => [{
                period: mensForm.periodo,
                amount: parseInt(mensForm.monto).toLocaleString('es-CO'),
                by: 'Super Admin',
                date: dateStr,
                note: mensForm.nota,
              }, ...h]);
              setMensForm({ periodo: '2026-07', monto: '100000', nota: '' });
              closeModal();
            }}
          >Registrar</Button>
        </>}
      >
        {/* Period selector pills */}
        <div>
          <div style={fLabel}>Período</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {meses.map(m => {
              const active = mensForm.periodo === m;
              const [yr, mo] = m.split('-');
              const label = new Date(parseInt(yr), parseInt(mo)-1).toLocaleString('es', { month: 'short', year: '2-digit' });
              return (
                <button key={m} onClick={() => setMensForm(f => ({ ...f, periodo: m }))} style={{
                  padding: '0.35rem 0.75rem', borderRadius: '50rem', border: '1px solid',
                  cursor: 'pointer', fontFamily: "'Open Sans', sans-serif",
                  fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize',
                  borderColor: active ? '#cb0c9f' : '#e9ecef',
                  background:   active ? '#fde6f7' : '#fff',
                  color:        active ? '#a30c80' : '#8392ab',
                }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Monto */}
        <Input
          label="Monto (COP)"
          value={mensForm.monto}
          onChange={e => setMensForm(f => ({ ...f, monto: e.target.value.replace(/\D/g,'') }))}
          placeholder="Ej. 100000"
          icon="fas fa-dollar-sign"
          type="text"
          inputMode="numeric"
        />

        {/* Info strip */}
        <div style={{
          background: '#f8f9fa', borderRadius: '0.6rem', padding: '0.7rem 0.9rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontSize: '0.75rem', color: '#67748e',
        }}>
          <em className="fas fa-circle-info" style={{ color: '#17c1e8' }} />
          El pago quedará registrado a nombre de <strong style={{ color: '#344767' }}>Super Admin</strong> con la fecha y hora actual.
        </div>

        {/* Nota */}
        <div>
          <div style={fLabel}>Nota (opcional)</div>
          <div style={{ border: '1px solid #d2d6da', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <textarea
              value={mensForm.nota}
              onChange={e => setMensForm(f => ({ ...f, nota: e.target.value }))}
              placeholder="Observaciones…"
              rows={2}
              style={{
                width: '100%', border: 'none', outline: 'none', resize: 'none',
                fontFamily: "'Open Sans', sans-serif", fontSize: '0.875rem', color: '#495057',
                padding: '0.5rem 0.75rem', boxSizing: 'border-box', background: '#fff',
              }}
            />
          </div>
        </div>
      </Modal>
    );
  }

  // ── Modal: Crear Vehículo (real form) ──────────────────────────────────────
  function ModalVehiculo() {
    const selectedColor = COLORS.find(c => c.hex === vehForm.color) || COLORS[0];
    const iLbl = {
      display: 'block', fontSize: '0.72rem', fontWeight: 700,
      color: 'var(--text-heading)', marginBottom: '0.35rem',
    };
    const req = { color: '#ea0606', marginLeft: '0.2rem' };
    const iInp = {
      width: '100%', background: 'var(--surface-input)',
      border: '1px solid var(--border-color)', borderRadius: '0.5rem',
      color: 'var(--text-heading)', padding: '0.55rem 0.75rem',
      fontSize: '0.875rem', outline: 'none',
      fontFamily: "'Open Sans', sans-serif", boxSizing: 'border-box',
    };
    return (
      <Modal
        title="Crear Vehículo"
        icon="fas fa-car-side"
        onClose={() => {
          closeModal();
          setShowLookup(false);
          setLookupInput('');
        }}
        width={520}
        footer={null}
      >
        {/* Placa — read-only, pre-filled from lookup */}
        <div>
          <label style={iLbl}>Placa</label>
          <input value={vehForm.placa} disabled style={{ ...iInp, opacity: 0.6, cursor: 'not-allowed' }} />
        </div>

        {/* Marca */}
        <div>
          <label style={iLbl}>Marca <span style={req}>*</span></label>
          <input
            type="text" placeholder="Marca" style={iInp}
            value={vehForm.marca}
            onChange={e => setVehForm(f => ({ ...f, marca: e.target.value }))}
          />
        </div>

        {/* Modelo */}
        <div>
          <label style={iLbl}>Modelo <span style={req}>*</span></label>
          <input
            type="text" placeholder="Modelo" style={iInp}
            value={vehForm.modelo}
            onChange={e => setVehForm(f => ({ ...f, modelo: e.target.value }))}
          />
        </div>

        {/* Color — dropdown + swatch */}
        <div>
          <label style={iLbl}>Color <span style={req}>*</span></label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px', gap: '0.6rem', alignItems: 'stretch' }}>
            <div style={{ position: 'relative' }}>
              <select
                value={vehForm.color}
                onChange={e => setVehForm(f => ({ ...f, color: e.target.value }))}
                style={{ ...iInp, appearance: 'none', paddingRight: '2rem', cursor: 'pointer' }}
              >
                {COLORS.map(c => (
                  <option key={c.hex} value={c.hex}>{c.name}</option>
                ))}
              </select>
              <em className="fas fa-chevron-down" style={{
                position: 'absolute', right: '0.75rem', top: '50%',
                transform: 'translateY(-50%)', fontSize: '0.7rem',
                color: 'var(--text-secondary)', pointerEvents: 'none',
              }} />
            </div>
            <div style={{
              borderRadius: '0.5rem', border: '1px solid var(--border-color)',
              background: selectedColor.hex,
              height: '100%', minHeight: 40,
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15)',
            }} />
          </div>
        </div>

        {/* Venc. SOAT + Venc. Tec-Mec */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={iLbl}>Venc. SOAT</label>
            <input type="date" style={iInp} value={vehForm.soat}
              onChange={e => setVehForm(f => ({ ...f, soat: e.target.value }))} />
          </div>
          <div>
            <label style={iLbl}>Venc. Tec-Mec</label>
            <input type="date" style={iInp} value={vehForm.tec}
              onChange={e => setVehForm(f => ({ ...f, tec: e.target.value }))} />
          </div>
        </div>

        {/* Foto */}
        <div>
          <label style={iLbl}>Foto</label>
          <input
            type="file" accept="image/jpeg,image/png"
            style={{ ...iInp, padding: '0.35rem 0.5rem', cursor: 'pointer' }}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file && file.size / 1024 / 1024 > 1.024) {
                setVehForm(f => ({ ...f, fileError: 'Máx 1 MB (JPG/PNG)' }));
              } else {
                setVehForm(f => ({ ...f, fileError: '' }));
              }
            }}
          />
          {vehForm.fileError && (
            <span style={{ fontSize: '0.72rem', color: '#ea0606', marginTop: '0.25rem', display: 'block' }}>
              {vehForm.fileError}
            </span>
          )}
        </div>

        {/* ENVIAR */}
        <button
          disabled={!vehForm.marca.trim() || !vehForm.modelo.trim()}
          onClick={() => {
            if (!vehForm.marca.trim() || !vehForm.modelo.trim()) return;
            setVehicles(vs => [...vs, {
              id: Date.now(),
              plate: vehForm.placa,
              model: `${vehForm.marca} ${vehForm.modelo}`,
              selectable: false,
              enabled: true,
            }]);
            setVehForm({ placa: '', marca: '', modelo: '', color: '#000000', soat: '', tec: '', fileError: '' });
            setShowLookup(false);
            setLookupInput('');
            closeModal();
          }}
          style={{
            width: '100%', padding: '0.7rem',
            background: (!vehForm.marca.trim() || !vehForm.modelo.trim()) ? '#adb5bd' : '#82d616',
            border: 'none', borderRadius: '0.5rem',
            color: '#fff', fontSize: '0.8rem', fontWeight: 700,
            letterSpacing: '0.08rem', textTransform: 'uppercase',
            fontFamily: "'Open Sans', sans-serif", cursor: 'pointer',
            boxShadow: (!vehForm.marca.trim() || !vehForm.modelo.trim()) ? 'none' : '0 4px 14px rgba(130,214,22,0.4)',
            transition: 'all 0.15s',
          }}
        >
          ENVIAR
        </button>
      </Modal>
    );
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif" }}>

      {/* Modals */}
      {modal === 'saldo'        && <ModalSaldo />}
      {modal === 'mensualidad'  && <ModalMensualidad />}
      {modal === 'vehiculo'     && <ModalVehiculo />}

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#8392ab' }}>
            <span style={{ opacity: 0.6 }}>Conductores</span>
            <span style={{ margin: '0 0.4rem', opacity: 0.5 }}>/</span>
            <span style={{ color: '#344767', fontWeight: 600 }}>Editar conductor</span>
          </div>
          <h6 style={{ margin: '0.1rem 0 0', fontSize: '1rem', fontWeight: 700, color: '#344767' }}>{driver.name}</h6>
        </div>
        <Button color="secondary" variant="outline" size="sm" icon="fas fa-arrow-left" onClick={onBack}>
          Regresar
        </Button>
      </div>

      {/* ── 1. Profile header — full width ──────────────────────────────── */}
      <Card style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1rem' : '2rem', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', paddingTop: '0.25rem' }}>
            <div style={{ position: 'relative' }}>
              <Avatar name={driver.name} size={76} rounded="lg" />
              <button style={{
                position: 'absolute', bottom: -5, right: -5,
                width: 22, height: 22, borderRadius: '50%',
                background: 'linear-gradient(310deg,#2152ff,#21d4fd)',
                border: '2px solid #fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '0.55rem', boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}><em className="fas fa-pencil" /></button>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#adb5bd', fontWeight: 600, textAlign: 'center', maxWidth: 80 }}>
              {driver.name.split(' ')[0]}
            </span>
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: '0.85rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <Input label="Nombre completo" value={form.name} onChange={set('name')} icon="fas fa-user" />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <Input label="Correo electrónico" value={form.email} onChange={set('email')} disabled={emailLocked} icon={emailLocked ? 'fas fa-lock' : 'fas fa-envelope'} />
              <button style={lockBtn} onClick={() => setEmailLocked(l => !l)}>
                <em className={emailLocked ? 'fas fa-lock-open' : 'fas fa-lock'} />
                {emailLocked ? 'Editar' : 'Bloquear'}
              </button>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <Input label="Contraseña" value={form.password} onChange={set('password')} type={passLocked ? 'password' : 'text'} disabled={passLocked} icon={passLocked ? 'fas fa-lock' : 'fas fa-key'} />
              <button style={lockBtn} onClick={() => setPassLocked(l => !l)}>
                <em className={passLocked ? 'fas fa-lock-open' : 'fas fa-lock'} />
                {passLocked ? 'Editar' : 'Bloquear'}
              </button>
            </div>
            <Input label="Teléfono"   value={form.phone}   onChange={set('phone')}   icon="fas fa-phone" />
            <Input label="Teléfono 2" value={form.phone2}  onChange={set('phone2')}  placeholder="Opcional" icon="fas fa-phone" />
            <Select label="Tipo doc"  value={form.docType} onChange={set('docType')} options={['CC','CE','NIT','PA','RC']} />
            <Input  label="Documento" value={form.doc}     onChange={set('doc')}     icon="fas fa-id-card" />
          </div>
        </div>

        {/* Save actions — scoped to this card */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', paddingTop: '1.25rem', borderTop: '1px solid #e9ecef', marginTop: '0.5rem' }}>
          <Button color="secondary" variant="outline" size="sm" onClick={onBack}>Cancelar</Button>
          <Button color="primary" variant="gradient" size="sm" icon="fas fa-check">Guardar cambios</Button>
        </div>
      </Card>

      {/* ── 2. Two balanced columns ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

        {/* LEFT — Vehículos + Dispositivo */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h6 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#344767' }}>
              <em className="fas fa-car-side" style={{ color: '#cb0c9f', marginRight: '0.5rem' }} />Vehículos asignados
            </h6>
            {vehicles.map((v, i) => (
              <div key={v.id} style={{
                display: 'flex', alignItems: 'center', gap: '0.7rem',
                padding: '0.6rem 0.75rem',
                borderBottom: i < vehicles.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}>
                {/* Status dot */}
                <span style={{
                  width: 28, height: 28, borderRadius: '50%', flex: 'none',
                  background: v.enabled ? 'rgba(130,214,22,0.15)' : 'var(--surface-input)',
                  border: `2px solid ${v.enabled ? '#82d616' : 'var(--border-color)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: v.enabled ? '#82d616' : 'var(--border-color)' }} />
                </span>
                {/* Plate + model */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-heading)' }}>{v.plate}</span>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{v.model}</span>
                </div>
                {/* Selectable toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Switch checked={v.selectable} onChange={val => setVehicles(vs => vs.map((x, j) => j === i ? { ...x, selectable: val } : x))} />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Seleccionable</span>
                </div>
                {/* Enabled badge */}
                {v.enabled && (
                  <span style={{
                    background: '#82d616', color: '#fff',
                    fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.04em',
                    padding: '0.22rem 0.65rem', borderRadius: '50rem',
                    textTransform: 'uppercase',
                  }}>HABILITADO</span>
                )}
              </div>
            ))}

            {/* Inline lookup / add vehicle */}
            {!showLookup ? (
              <button
                onClick={() => setShowLookup(true)}
                style={{
                  width: '100%', padding: '0.55rem 1rem',
                  background: 'transparent',
                  border: '1.5px solid #cb0c9f', borderRadius: '0.5rem',
                  color: '#cb0c9f', fontSize: '0.75rem', fontWeight: 800,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  fontFamily: "'Open Sans', sans-serif", cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(203,12,159,0.06)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                + AGREGAR VEHÍCULO
              </button>
            ) : (
              <div style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: '0.65rem',
                overflow: 'visible', position: 'relative',
                padding: '0.75rem',
                background: 'var(--body-bg)',
              }}>
                <div style={{ marginBottom: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-heading)' }}>Placa</span>
                  <button onClick={() => { setShowLookup(false); setLookupInput(''); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.75rem', padding: 0 }}>
                    <em className="fas fa-xmark" />
                  </button>
                </div>
                {/* Input */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Buscar placa..."
                    value={lookupInput}
                    autoComplete="off"
                    onChange={e => {
                      const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      setLookupInput(v);
                      setLookupActive(-1);
                    }}
                    onFocus={() => setLookupFocused(true)}
                    onBlur={() => setTimeout(() => setLookupFocused(false), 160)}
                    onKeyDown={e => {
                      if (!lookupDropdownOpen) return;
                      const total = lookupSuggestions.length + 1;
                      if (e.key === 'ArrowDown') { e.preventDefault(); setLookupActive(a => (a + 1) % total); }
                      else if (e.key === 'ArrowUp') { e.preventDefault(); setLookupActive(a => a <= 0 ? total - 1 : a - 1); }
                      else if (e.key === 'Enter' && lookupActive >= 0) {
                        e.preventDefault();
                        if (lookupActive < lookupSuggestions.length) {
                          const v = lookupSuggestions[lookupActive];
                          setVehicles(vs => [...vs, { id: Date.now(), plate: v.plate, model: `${v.brand} ${v.model}`, selectable: false, enabled: false }]);
                          setShowLookup(false); setLookupInput('');
                        } else {
                          setVehForm(f => ({ ...f, placa: lookupInput }));
                          setModal('vehiculo');
                        }
                      } else if (e.key === 'Escape') { setLookupFocused(false); }
                    }}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: 'var(--surface-input)',
                      border: `1.5px solid ${lookupFocused ? '#cb0c9f' : 'var(--border-color)'}`,
                      borderRadius: lookupDropdownOpen ? '0.45rem 0.45rem 0 0' : '0.45rem',
                      color: 'var(--text-heading)', padding: '0.5rem 0.75rem',
                      fontSize: '0.85rem', outline: 'none',
                      fontFamily: "'Open Sans', sans-serif",
                      boxShadow: lookupFocused ? '0 0 0 3px rgba(203,12,159,0.12)' : 'none',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                  />

                  {/* Dropdown */}
                  {lookupDropdownOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                      background: 'var(--surface-card)',
                      border: '1.5px solid var(--border-subtle)',
                      borderTop: 'none',
                      borderRadius: '0 0 0.5rem 0.5rem',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
                      overflow: 'hidden',
                    }}>
                      {lookupSuggestions.map((v, idx) => (
                        <div
                          key={v.id}
                          onMouseDown={() => {
                            setVehicles(vs => [...vs, { id: Date.now(), plate: v.plate, model: `${v.brand} ${v.model}`, selectable: false, enabled: false }]);
                            setShowLookup(false); setLookupInput('');
                          }}
                          style={{
                            padding: '0.65rem 0.9rem', cursor: 'pointer',
                            borderBottom: '1px solid var(--border-subtle)',
                            background: lookupActive === idx ? 'linear-gradient(310deg, rgba(121,40,202,0.1), rgba(255,0,128,0.1))' : 'transparent',
                            boxShadow: lookupActive === idx ? 'inset 0 0 0 1px rgba(255,0,128,0.2)' : 'none',
                            transition: 'background 0.1s',
                          }}
                        >
                          <strong style={{ fontSize: '0.82rem', color: 'var(--text-heading)', marginRight: '0.5rem' }}>{v.plate}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{v.brand} {v.model} {v.year}</span>
                        </div>
                      ))}
                      {/* Create option */}
                      <div
                        onMouseDown={() => {
                          setVehForm(f => ({ ...f, placa: lookupInput }));
                          setModal('vehiculo');
                          setLookupFocused(false);
                        }}
                        style={{
                          padding: '0.65rem 0.9rem', cursor: 'pointer',
                          background: lookupActive === lookupSuggestions.length ? 'linear-gradient(310deg, rgba(121,40,202,0.1), rgba(255,0,128,0.1))' : 'transparent',
                          boxShadow: lookupActive === lookupSuggestions.length ? 'inset 0 0 0 1px rgba(255,0,128,0.2)' : 'none',
                          fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)',
                        }}
                      >
                        + Crear vehículo con placa <span style={{ color: '#cb0c9f' }}>{lookupInput}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <hr style={divider} />

            <h6 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#344767' }}>
              <em className="fas fa-mobile-screen" style={{ color: '#cb0c9f', marginRight: '0.5rem' }} />Dispositivo
            </h6>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              <Input value={device} onChange={e => setDevice(e.target.value)} icon="fas fa-mobile-screen" style={{ flex: 1 }} placeholder="Sin dispositivo" />
              <button title="Desvincular" style={{
                width: 40, height: 40, borderRadius: '0.5rem', border: 'none',
                cursor: 'pointer', flex: 'none',
                background: 'linear-gradient(310deg,#d60808,#ff6690)',
                color: '#fff', fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 7px -1px rgba(0,0,0,0.11)',
              }}><em className="fas fa-trash-can" /></button>
            </div>
          </div>
        </Card>

        {/* RIGHT — Estado y pagos */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h6 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#344767' }}>
              <em className="fas fa-wallet" style={{ color: '#cb0c9f', marginRight: '0.5rem' }} />Estado y pagos
            </h6>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', alignItems: 'end' }}>
              <div>
                <div style={fLabel}>Estado</div>
                <div style={{ paddingTop: '0.3rem' }}>
                  <Switch checked={form.enabled} onChange={v => setForm(f => ({ ...f, enabled: v }))} label={form.enabled ? 'Habilitado' : 'Deshabilitado'} />
                </div>
              </div>
              <Select label="Modo de pago" value={form.payMode} onChange={set('payMode')} options={['Mensualidad','Por servicio','Prepago']} />
            </div>

            <hr style={divider} />

            <div style={{
              background: 'linear-gradient(310deg,#141727,#3a416f)',
              borderRadius: '0.85rem', padding: '1rem 1.25rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Saldo actual</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>
                    {saldoActual.toLocaleString('es-CO')}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>COP</span>
                </div>
              </div>
              <button onClick={() => setModal('saldo')} style={{
                padding: '0.5rem 1.1rem', borderRadius: '0.5rem', border: 'none',
                background: 'rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer',
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.02em',
                fontFamily: "'Open Sans', sans-serif",
              }}>
                <em className="fas fa-sliders" style={{ marginRight: '0.4rem' }} />Administrar
              </button>
            </div>

            <Button color="primary" variant="outline" fullWidth icon="fas fa-calendar-plus" onClick={() => setModal('mensualidad')}>
              Registrar mensualidad
            </Button>
          </div>
        </Card>
      </div>

      {/* ── 3. Tabbed history ────────────────────────────────────────────── */}
      <Card padding="0">
        <div style={{ padding: '1rem 1.25rem 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e9ecef' }}>
          <h6 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#344767' }}>Historial</h6>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <TabPill id="saldo"         label="Saldo"         icon="fas fa-coins" />
            <TabPill id="mensualidades" label="Mensualidades" icon="fas fa-calendar-check" />
          </div>
        </div>

        {historyTab === 'saldo' && (
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Open Sans', sans-serif", minWidth: 520 }}>
            <thead><tr>{['Fecha','Monto','Saldo resultante','Registrado por','Nota'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {histSaldo.map((row, i) => (
                <tr key={i}>
                  <td style={td}><span style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem' }}><em className="fas fa-clock" style={{ color:'#d2d6da', fontSize:'0.7rem' }} />{row.date}</span></td>
                  <td style={{ ...td, fontWeight: 700, color: row.amount.startsWith('-') ? '#ea0606' : '#82d616' }}>{row.amount} COP</td>
                  <td style={{ ...td, fontWeight: 600, color: '#344767' }}>{row.balance} COP</td>
                  <td style={td}><div style={{ display:'inline-flex', alignItems:'center', gap:'0.45rem' }}><Avatar name={row.by} size={22} />{row.by}</div></td>
                  <td style={td}>{row.note ? <span style={{ background:'#f3f4f6', padding:'0.15rem 0.5rem', borderRadius:'50rem', fontSize:'0.72rem', color:'#67748e' }}>{row.note}</span> : <span style={{ color:'#d2d6da' }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}

        {historyTab === 'mensualidades' && (
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Open Sans', sans-serif", minWidth: 520 }}>
            <thead><tr>{['Período','Monto','Registrado por','Fecha de pago','Nota'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {histMens.map((row, i) => (
                <tr key={i}>
                  <td style={td}><span style={{ background:'linear-gradient(310deg,#7928ca,#ff0080)', color:'#fff', padding:'0.15rem 0.55rem', borderRadius:'50rem', fontSize:'0.72rem', fontWeight:700 }}>{row.period}</span></td>
                  <td style={{ ...td, fontWeight: 700, color: '#344767' }}>{row.amount} COP</td>
                  <td style={td}><div style={{ display:'inline-flex', alignItems:'center', gap:'0.45rem' }}><Avatar name={row.by} size={22} />{row.by}</div></td>
                  <td style={td}><span style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem' }}><em className="fas fa-clock" style={{ color:'#d2d6da', fontSize:'0.7rem' }} />{row.date}</span></td>
                  <td style={td}>{row.note ? <span style={{ background:'#f3f4f6', padding:'0.15rem 0.5rem', borderRadius:'50rem', fontSize:'0.72rem', color:'#67748e' }}>{row.note}</span> : <span style={{ color:'#d2d6da' }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}

        <div style={{ padding: '0.6rem 1.25rem', fontSize: '0.72rem', color: '#adb5bd', borderTop: '1px solid #f3f4f6' }}>
          {historyTab === 'saldo' ? `${histSaldo.length} movimientos` : `${histMens.length} mensualidades`}
        </div>
      </Card>

    </div>
  );
}
window.EditDriverView = EditDriverView;
