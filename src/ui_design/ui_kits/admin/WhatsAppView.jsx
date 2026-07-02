// WhatsApp Connection View — Gorda Design System
// Follows Soft UI card vocabulary: floating cards, gradient icon chips, --primary magenta CTAs.

/* ── small primitives ─────────────────────────────────────── */

function Toggle({ checked, onChange, disabled, danger }) {
  const track = checked
    ? (danger ? 'var(--danger)' : 'var(--primary)')
    : 'var(--border-color)';
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: 36, height: 20, borderRadius: 50, border: 'none',
        background: track, cursor: disabled ? 'default' : 'pointer',
        position: 'relative', flex: 'none',
        opacity: disabled ? 0.45 : 1,
        transition: 'background 0.2s ease',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)',
      }}
    >
      <span style={{
        position: 'absolute', top: 2,
        left: checked ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        transition: 'left 0.2s ease',
      }} />
    </button>
  );
}

function IconBtn({ icon, gradient, onClick, title }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 34, height: 34, borderRadius: '0.5rem', border: 'none',
        background: hov ? gradient : 'var(--surface-input)',
        color: hov ? '#fff' : 'var(--text-body)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.8rem',
        boxShadow: hov
          ? '0 4px 12px rgba(0,0,0,0.22)'
          : '0 2px 9px -5px rgba(0,0,0,0.25), 0 0 1px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
        flex: 'none',
      }}
    >
      <em className={icon} />
    </button>
  );
}

function PrimaryBtn({ children, onClick, disabled, outline }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '0.45rem 1.25rem',
        borderRadius: '0.5rem',
        border: outline ? '1.5px solid var(--primary)' : 'none',
        background: outline
          ? 'transparent'
          : (hov ? 'linear-gradient(310deg,#7928ca,#ff0080)' : 'var(--primary)'),
        color: outline ? 'var(--primary)' : '#fff',
        fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
        fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        boxShadow: !outline && !disabled ? 'var(--shadow-btn)' : 'none',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
        flex: 'none',
      }}
    >
      {children}
    </button>
  );
}

/* ── toggle row ───────────────────────────────────────────── */
function ToggleRow({ label, sub, checked, onChange, disabled, danger }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
      padding: '0.65rem 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} danger={danger} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-heading)',
          lineHeight: 1.3,
        }}>{label}</div>
        {sub && (
          <div style={{
            fontSize: '0.75rem', color: 'var(--text-muted)',
            marginTop: '0.2rem', lineHeight: 1.4,
          }}>{sub}</div>
        )}
      </div>
    </div>
  );
}

/* ── status pill ──────────────────────────────────────────── */
function StatusPill({ connected, connecting, loading }) {
  let label, bg, fg, dot;
  if (loading) { label = 'Loading…'; bg = 'var(--badge-warning-bg)'; fg = 'var(--badge-warning-fg)'; dot = '#fbcf33'; }
  else if (connecting) { label = 'Connecting'; bg = 'var(--badge-info-bg)'; fg = 'var(--badge-info-fg)'; dot = '#17c1e8'; }
  else if (connected) { label = 'Conectado'; bg = 'var(--badge-success-bg)'; fg = 'var(--badge-success-fg)'; dot = '#82d616'; }
  else { label = 'Desconectado'; bg = 'var(--badge-danger-bg)'; fg = 'var(--badge-danger-fg)'; dot = '#ea0606'; }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      background: bg, color: fg,
      padding: '0.25rem 0.65rem', borderRadius: '50rem',
      fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flex: 'none' }} />
      {label}
    </span>
  );
}

/* ── connection visual ────────────────────────────────────── */
function ConnectionVisual({ connected, connecting, loading, phoneId }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '1.5rem 1rem 1rem', gap: '0.75rem',
    }}>
      {/* artwork */}
      <div style={{
        width: 110, height: 110, borderRadius: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: connected
          ? 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)'
          : 'var(--surface-input)',
        boxShadow: connected
          ? '0 8px 26px -4px rgba(37,211,102,0.35)'
          : 'var(--shadow-card)',
        transition: 'all 0.3s ease',
        flex: 'none',
      }}>
        {loading && (
          <em className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2.5rem', color: '#fbcf33' }} />
        )}
        {connecting && !loading && (
          <em className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2.5rem', color: '#17c1e8' }} />
        )}
        {connected && !connecting && !loading && (
          <em className="fa-brands fa-whatsapp" style={{ fontSize: '3.2rem', color: '#fff' }} />
        )}
        {!connected && !connecting && !loading && (
          <em className="fa-solid fa-circle-exclamation" style={{ fontSize: '2.5rem', color: 'var(--text-muted)' }} />
        )}
      </div>

      {/* phone id */}
      <div style={{
        fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)', textAlign: 'center', wordBreak: 'break-all',
        padding: '0 0.5rem',
      }}>
        {phoneId}
      </div>
    </div>
  );
}

/* ── single connection card ───────────────────────────────── */
function ConnectionCard({ client, isDefault, onSetDefault }) {
  const [connected, setConnected] = React.useState(client.connected);
  const [connecting, setConnecting] = React.useState(false);
  const [settings, setSettings] = React.useState({
    wpNotifications: client.wpNotifications,
    assistant: client.assistant,
    chatBot: client.chatBot,
    full: client.full,
  });
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showRestartModal, setShowRestartModal] = React.useState(false);

  function handleConnect() {
    setConnecting(true);
    // simulate connect
    setTimeout(() => { setConnecting(false); setConnected(true); }, 2200);
  }

  function toggle(key) {
    if (!connected) return;
    setSettings(s => ({ ...s, [key]: !s[key] }));
  }

  return (
    <div style={{
      background: 'var(--surface-card)',
      borderRadius: '1rem',
      boxShadow: 'var(--shadow-card)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'var(--font-sans)',
      border: isDefault ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
      transition: 'box-shadow 0.2s ease',
    }}>

      {/* ── card header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '1rem 1.25rem 0.85rem',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {/* icon chip */}
        <div style={{
          width: 38, height: 38, borderRadius: '0.6rem', flex: 'none',
          background: connected
            ? 'linear-gradient(310deg,#128c7e,#25d366)'
            : 'var(--gradient-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 9px -5px rgba(0,0,0,0.4), 0 0 1px rgba(0,0,0,0.08)',
          color: '#fff', fontSize: '1rem',
        }}>
          <em className="fa-brands fa-whatsapp" />
        </div>

        {/* name + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)', lineHeight: 1.2 }}>
            {client.alias}
          </div>
          <div style={{ marginTop: '0.3rem' }}>
            <StatusPill connected={connected} connecting={connecting} />
          </div>
        </div>

        {/* default badge */}
        {isDefault && (
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em',
            background: 'var(--badge-primary-bg)', color: 'var(--badge-primary-fg)',
            padding: '0.2rem 0.55rem', borderRadius: '50rem',
          }}>DEFAULT</span>
        )}

        {/* actions */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <IconBtn icon="fas fa-rotate" gradient="linear-gradient(310deg,#2152ff,#21d4fd)" title="Reiniciar" onClick={() => setShowRestartModal(true)} />
          <IconBtn icon="fas fa-trash" gradient="linear-gradient(310deg,#d60808,#ff6690)" title="Eliminar" onClick={() => setShowDeleteModal(true)} />
        </div>
      </div>

      {/* ── visual ── */}
      <ConnectionVisual connected={connected} connecting={connecting} phoneId={client.id} />

      {/* ── connect button / chat link ── */}
      <div style={{ padding: '0 1.25rem 1rem', display: 'flex', gap: '0.6rem', justifyContent: connected ? 'flex-end' : 'flex-start' }}>
        {!connected && (
          <PrimaryBtn onClick={handleConnect} disabled={connecting}>
            {connecting ? 'Conectando…' : 'Conectar'}
          </PrimaryBtn>
        )}
        {connected && (
          <a href="#" onClick={e => e.preventDefault()} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.4rem 0.9rem',
            borderRadius: '0.5rem',
            background: 'var(--badge-success-bg)', color: 'var(--badge-success-fg)',
            fontSize: '0.75rem', fontWeight: 700,
            textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}>
            <em className="fas fa-message" />
            Chat
          </a>
        )}
      </div>

      {/* ── toggles ── */}
      <div style={{ padding: '0 1.25rem', marginBottom: '0.75rem' }}>
        <ToggleRow
          label="Confirmaciones de WhatsApp"
          checked={settings.wpNotifications}
          onChange={() => toggle('wpNotifications')}
          disabled={!connected}
        />
        <ToggleRow
          label="Asistente Bot"
          sub={!connected || settings.assistant ? null : 'Activa para que el bot atienda automáticamente'}
          checked={settings.assistant}
          onChange={() => toggle('assistant')}
          disabled={!connected}
        />
        <ToggleRow
          label="WhatsApp ChatBot"
          sub={connected && !settings.chatBot ? 'Habilita el chatBot para que gestione completamente los servicios' : null}
          checked={settings.chatBot}
          onChange={() => toggle('chatBot')}
          disabled={!connected}
        />
        <ToggleRow
          label="Modo Saturado"
          checked={settings.full}
          onChange={() => toggle('full')}
          disabled={!connected}
          danger
        />
        <ToggleRow
          label={isDefault ? 'Cliente por defecto' : 'Seleccionar como cliente por defecto'}
          checked={isDefault}
          onChange={() => !isDefault && onSetDefault(client.id)}
          disabled={isDefault}
        />
      </div>

      {/* ── modals ── */}
      {showDeleteModal && (
        <Modal
          title="Eliminar conexión"
          body={`¿Estás seguro de que deseas eliminar la conexión "${client.alias}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          confirmGradient="linear-gradient(310deg,#d60808,#ff6690)"
          onConfirm={() => setShowDeleteModal(false)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showRestartModal && (
        <Modal
          title="Reiniciar conexión"
          body={`¿Deseas reiniciar la conexión "${client.alias}"? Se desconectará brevemente y volverá a conectar.`}
          confirmLabel="Reiniciar"
          confirmGradient="linear-gradient(310deg,#2152ff,#21d4fd)"
          onConfirm={() => { setShowRestartModal(false); setConnected(false); setConnecting(false); }}
          onCancel={() => setShowRestartModal(false)}
        />
      )}
    </div>
  );
}

/* ── modal ────────────────────────────────────────────────── */
function Modal({ title, body, confirmLabel, confirmGradient, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onCancel}>
      <div style={{
        background: 'var(--surface-card)', borderRadius: '1rem',
        boxShadow: '0 24px 48px rgba(0,0,0,0.22)',
        width: 420, maxWidth: '90vw', padding: '1.75rem',
        fontFamily: 'var(--font-sans)',
      }} onClick={e => e.stopPropagation()}>
        <h5 style={{ margin: '0 0 0.75rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-heading)' }}>
          {title}
        </h5>
        <p style={{ margin: '0 0 1.5rem', fontSize: '0.875rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
          {body}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
          <button onClick={onCancel} style={{
            padding: '0.45rem 1.1rem', borderRadius: '0.5rem',
            border: '1px solid var(--border-color)', background: 'var(--surface-input)',
            color: 'var(--text-body)', fontFamily: 'inherit', fontSize: '0.8rem',
            fontWeight: 600, cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={onConfirm} style={{
            padding: '0.45rem 1.1rem', borderRadius: '0.5rem',
            border: 'none', background: confirmGradient,
            color: '#fff', fontFamily: 'inherit', fontSize: '0.8rem',
            fontWeight: 700, cursor: 'pointer',
            boxShadow: 'var(--shadow-btn)',
          }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ── add number modal ─────────────────────────────────────── */
function AddNumberModal({ onClose }) {
  const [alias, setAlias] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const inputStyle = {
    width: '100%', padding: '0.55rem 0.75rem',
    border: '1px solid var(--border-color)', borderRadius: '0.5rem',
    background: 'var(--surface-input)', color: 'var(--text-body)',
    fontFamily: 'var(--font-sans)', fontSize: '0.85rem', outline: 'none',
    transition: 'border-color 0.15s',
  };
  const labelStyle = {
    display: 'block', fontSize: '0.75rem', fontWeight: 700,
    color: 'var(--text-heading)', marginBottom: '0.35rem',
    letterSpacing: '0.04em', textTransform: 'uppercase',
  };
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface-card)', borderRadius: '1rem',
        boxShadow: '0 24px 48px rgba(0,0,0,0.22)',
        width: 440, maxWidth: '90vw', padding: '1.75rem',
        fontFamily: 'var(--font-sans)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h5 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            Agregar número WhatsApp
          </h5>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: '0.4rem', border: 'none',
            background: 'var(--surface-input)', color: 'var(--text-muted)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem',
          }}><em className="fas fa-xmark" /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Alias</label>
            <input style={inputStyle} placeholder="ej. Línea principal" value={alias} onChange={e => setAlias(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Número de teléfono</label>
            <input style={inputStyle} placeholder="+57 300 000 0000" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1.5rem' }}>
          <button onClick={onClose} style={{
            padding: '0.45rem 1.1rem', borderRadius: '0.5rem',
            border: '1px solid var(--border-color)', background: 'var(--surface-input)',
            color: 'var(--text-body)', fontFamily: 'inherit', fontSize: '0.8rem',
            fontWeight: 600, cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={onClose} style={{
            padding: '0.45rem 1.25rem', borderRadius: '0.5rem', border: 'none',
            background: 'var(--primary)', color: '#fff',
            fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 700,
            cursor: 'pointer', boxShadow: 'var(--shadow-btn)',
          }}>Agregar</button>
        </div>
      </div>
    </div>
  );
}

/* ── sample message templates ─────────────────────────────── */
const WA_SAMPLE_MESSAGES = [
  {
    id: 1, name: 'Cancelaciones', interactive: true, msgType: 'button',
    desc: 'Cuando no se ha asignado el servicio después de cierto tiempo',
    text: '_Que pena contigo_ 😟 por el momento no cuento con móviles disponible cerca al lugar donde debemos recogerte.\n\n*¿Deseas que siga insistiendo con tu solicitud unos minutos mas?*',
    iText: '_Que pena contigo_ 😟 por el momento no cuento con móviles disponible cerca al lugar donde debemos recogerte.\n\n*¿Deseas que siga insistiendo con tu solicitud unos minutos mas?*',
    btns: [{ label: 'Si, Continuar', action: 'INSIST' }, { label: 'Cancelar', action: 'CANCEL' }],
  },
  {
    id: 2, name: 'Confirmación de llegada', interactive: false, msgType: 'button',
    desc: 'Cuando el conductor llega al punto de recogida',
    text: '🚕 Tu conductor *{{NOMBRE}}* ha llegado al punto de recogida.\nVehículo: {{COLOR}} · {{PLACA}}',
    iText: '', btns: [],
  },
  {
    id: 3, name: 'Sin móviles disponibles', interactive: true, msgType: 'button',
    desc: 'Cuando no hay vehículos disponibles en la zona',
    text: 'Lo sentimos, *en este momento no tenemos móviles disponibles* en tu zona.\n\n¿Deseas que sigamos buscando?',
    iText: 'Lo sentimos, *en este momento no tenemos móviles disponibles* en tu zona.\n\n¿Deseas que sigamos buscando?',
    btns: [{ label: 'Sí, seguir buscando', action: 'SEARCH' }, { label: 'Cancelar', action: 'CANCEL' }],
  },
  {
    id: 4, name: 'Bienvenida', interactive: false, msgType: 'button',
    desc: 'Mensaje de bienvenida al iniciar una conversación',
    text: '👋 Hola *{{NOMBRE}}*, bienvenido/a a _Gorda Taxi_.\n¿En qué podemos ayudarte hoy?',
    iText: '', btns: [],
  },
];

/* ── messages list panel ──────────────────────────────────── */
function MessagesPanel({ messages, onEdit, onNew }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <PrimaryBtn onClick={onNew}>
          <em className="fas fa-plus" style={{ marginRight: '0.4rem' }} />
          Nueva plantilla
        </PrimaryBtn>
      </div>

      <div style={{ background: 'var(--surface-card)', borderRadius: '1rem', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
        {/* table head */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2.5fr 120px 80px', padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--body-bg)', minWidth: 460 }}>
          {['Plantilla', 'Descripción', 'Tipo', ''].map((h, i) => (
            <div key={i} style={{ fontSize: '0.63rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {messages.map((msg, i) => (
          <div key={msg.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2.5fr 120px 80px', padding: '0.9rem 1.25rem', alignItems: 'center', borderBottom: i < messages.length - 1 ? '1px solid var(--border-subtle)' : 'none', transition: 'background 0.1s' }}>
            {/* name */}
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-heading)', marginBottom: '0.1rem' }}>{msg.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
                {msg.text ? (msg.text.length > 38 ? msg.text.slice(0, 38).replace(/[*_]/g, '') + '…' : msg.text.replace(/[*_]/g, '')) : '—'}
              </div>
            </div>
            {/* desc */}
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingRight: '1rem', lineHeight: 1.4 }}>{msg.desc}</div>
            {/* type badge */}
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', padding: '0.2rem 0.6rem', borderRadius: '50rem', background: msg.interactive ? 'var(--badge-success-bg)' : 'var(--badge-secondary-bg)', color: msg.interactive ? 'var(--badge-success-fg)' : 'var(--badge-secondary-fg)', fontSize: '0.67rem', fontWeight: 700 }}>
                <em className={msg.interactive ? 'fas fa-bolt' : 'fas fa-comment'} style={{ fontSize: '0.53rem' }} />
                {msg.interactive ? 'Interactivo' : 'Simple'}
              </span>
            </div>
            {/* actions */}
            <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
              <button onClick={() => onEdit(msg)} title="Editar" style={{ width: 30, height: 30, borderRadius: '0.4rem', border: 'none', background: 'var(--surface-input)', color: 'var(--text-body)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.74rem', transition: 'all 0.12s' }}>
                <em className="fas fa-pen" />
              </button>
              <button title="Eliminar" style={{ width: 30, height: 30, borderRadius: '0.4rem', border: 'none', background: 'var(--badge-danger-bg)', color: 'var(--badge-danger-fg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', transition: 'all 0.12s' }}>
                <em className="fas fa-trash" />
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

/* ── main view ────────────────────────────────────────────── */
function WhatsAppView() {
  const [clients, setClients] = React.useState([
    { id: '315465977324579', alias: '573173103090', connected: true, wpNotifications: true, assistant: true, chatBot: false, full: false },
    { id: '6028353514', alias: '602', connected: false, wpNotifications: false, assistant: false, chatBot: false, full: false },
  ]);
  const [defaultClient, setDefaultClient] = React.useState(clients[0].id);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [tab, setTab] = React.useState('connections');
  const [messages, setMessages] = React.useState(WA_SAMPLE_MESSAGES);
  const [editingMsg, setEditingMsg] = React.useState(null);

  const TABS = [
    { id: 'connections', icon: 'fas fa-wifi', label: 'Conexiones' },
    { id: 'messages', icon: 'fas fa-comment-dots', label: 'Mensajes' },
  ];

  function handleSaveMsg(data) {
    setMessages(ms => ms.map(m => m.id === editingMsg.id ? { ...m, ...data } : m));
  }

  function handleNewMsg() {
    const newMsg = { id: Date.now(), name: '', text: '', desc: '', interactive: false, msgType: 'button', iText: '', btns: [] };
    setMessages(ms => [...ms, newMsg]);
    setEditingMsg(newMsg);
  }

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── tab bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.2rem', background: 'var(--surface-card)', padding: '0.25rem', borderRadius: '0.625rem', boxShadow: 'var(--shadow-card)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '0.38rem 1rem', borderRadius: '0.4rem', border: 'none',
              background: tab === t.id ? 'var(--primary)' : 'transparent',
              color: tab === t.id ? '#fff' : 'var(--text-body)',
              fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              boxShadow: tab === t.id ? 'var(--shadow-btn)' : 'none',
            }}>
              <em className={t.icon} style={{ fontSize: '0.74rem' }} />
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'connections' && (
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <PrimaryBtn outline onClick={() => setShowAddModal(true)}>
              <em className="fas fa-plus" style={{ marginRight: '0.4rem' }} />
              Agregar número
            </PrimaryBtn>
            <PrimaryBtn onClick={() => {}}>
              <em className="fas fa-plus" style={{ marginRight: '0.4rem' }} />
              Crear
            </PrimaryBtn>
          </div>
        )}
      </div>

      {/* ── connections ── */}
      {tab === 'connections' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {clients.map(client => (
            <ConnectionCard key={client.id} client={client} isDefault={defaultClient === client.id} onSetDefault={setDefaultClient} />
          ))}
        </div>
      )}

      {/* ── messages ── */}
      {tab === 'messages' && (
        <MessagesPanel messages={messages} onEdit={setEditingMsg} onNew={handleNewMsg} />
      )}

      {showAddModal && <AddNumberModal onClose={() => setShowAddModal(false)} />}
      {editingMsg && <EditMessageModal msg={editingMsg} onClose={() => setEditingMsg(null)} onSave={handleSaveMsg} />}
    </div>
  );
}

window.WhatsAppView = WhatsAppView;
