// EditMessageModal.jsx — Gorda Design System
// Redesigned WhatsApp message template editor

/* ── WA markup → React elements ──────────────────────────── */
function parseWAMarkup(raw) {
  if (!raw) return null;
  return raw.split('\n').map((line, li, arr) => {
    const parts = [];
    let rest = line, k = 0;
    while (rest.length) {
      const bm = rest.match(/\*([^*\n]+)\*/);
      const im = rest.match(/_([^_\n]+)_/);
      let chosen = null, type = null;
      if (bm && im) {
        if (bm.index <= im.index) { chosen = bm; type = 'b'; }
        else { chosen = im; type = 'i'; }
      } else if (bm) { chosen = bm; type = 'b'; }
      else if (im) { chosen = im; type = 'i'; }
      if (chosen) {
        if (chosen.index > 0) parts.push(<span key={k++}>{rest.slice(0, chosen.index)}</span>);
        if (type === 'b') parts.push(<strong key={k++}>{chosen[1]}</strong>);
        else parts.push(<span key={k++} style={{ fontStyle: 'italic' }}>{chosen[1]}</span>);
        rest = rest.slice(chosen.index + chosen[0].length);
      } else {
        parts.push(<span key={k++}>{rest}</span>);
        break;
      }
    }
    return (
      <React.Fragment key={li}>
        {parts}
        {li < arr.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

/* ── WhatsApp phone preview ───────────────────────────────── */
function WAPhonePreview({ message, buttons }) {
  const validBtns = (buttons || []).filter(b => b.label && b.label.trim());
  const timeStr = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  return (
    <div style={{ fontFamily: '-apple-system,"Segoe UI",Helvetica,sans-serif', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 10px 36px rgba(0,0,0,0.22)' }}>
      {/* header */}
      <div style={{ background: '#075e54', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#25d366,#128c7e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <em className="fa-brands fa-whatsapp" style={{ color: '#fff', fontSize: '1rem' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 700, lineHeight: 1.2 }}>Gorda Taxi</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.63rem' }}>en línea</div>
        </div>
        <div style={{ display: 'flex', gap: '0.7rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
          <em className="fas fa-video" />
          <em className="fas fa-phone" />
          <em className="fas fa-ellipsis-vertical" />
        </div>
      </div>
      {/* chat bg */}
      <div style={{ background: '#e5ddd5', padding: '0.85rem 0.75rem', minHeight: 120 }}>
        {message ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ maxWidth: '88%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              {/* bubble */}
              <div style={{ background: '#dcf8c6', borderRadius: '0.7rem 0 0.7rem 0.7rem', padding: '0.5rem 0.7rem 0.3rem', boxShadow: '0 1px 2px rgba(0,0,0,0.12)', fontSize: '0.79rem', color: '#1a1a1a', lineHeight: 1.55, position: 'relative' }}>
                <div style={{ position: 'absolute', right: -7, top: 0, width: 0, height: 0, borderTop: '8px solid #dcf8c6', borderLeft: '8px solid transparent' }} />
                {parseWAMarkup(message)}
                <div style={{ textAlign: 'right', fontSize: '0.58rem', color: '#7a9c7a', marginTop: '0.22rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem' }}>
                  {timeStr}
                  <em className="fas fa-check-double" style={{ fontSize: '0.55rem', color: '#4fc3f7' }} />
                </div>
              </div>
              {/* buttons */}
              {validBtns.length > 0 && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.22rem' }}>
                  {validBtns.map((btn, i) => (
                    <div key={i} style={{ background: '#fff', borderRadius: '0.45rem', padding: '0.4rem 0.7rem', textAlign: 'center', fontSize: '0.76rem', color: '#128c7e', fontWeight: 500, boxShadow: '0 1px 2px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                      <em className="fas fa-reply" style={{ fontSize: '0.58rem' }} />
                      {btn.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: '#999', fontSize: '0.73rem' }}>
            Escribe un mensaje para ver la vista previa
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Variable chip ────────────────────────────────────────── */
function WAVarChip({ label, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={`Insertar {{${label}}}`}
      style={{
        padding: '0.18rem 0.5rem', borderRadius: '50rem',
        border: `1px solid ${hov ? 'var(--primary)' : 'var(--border-color)'}`,
        background: hov ? 'var(--badge-primary-bg)' : 'transparent',
        color: hov ? 'var(--primary)' : 'var(--text-muted)',
        fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.04em',
        cursor: 'pointer', transition: 'all 0.13s',
        fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

/* ── Toolbar + textarea combo ────────────────────────────── */
const WA_VARS = ['PLACA', 'COLOR', 'NOMBRE', 'PQR', 'LUGAR', 'EMPRESA'];

function WAEditorBlock({ value, onChange, taRef, rows, placeholder }) {
  const [focused, setFocused] = React.useState(false);

  function insertVar(v) {
    const tag = `{{${v}}}`;
    const el = taRef.current;
    if (el) {
      const s = el.selectionStart, e = el.selectionEnd;
      const next = value.slice(0, s) + tag + value.slice(e);
      onChange(next);
      setTimeout(() => { el.focus(); el.setSelectionRange(s + tag.length, s + tag.length); }, 0);
    } else {
      onChange(value + tag);
    }
  }

  function wrap(char) {
    const el = taRef.current;
    if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd;
    const inner = value.slice(s, e) || 'texto';
    const wrapped = `${char}${inner}${char}`;
    const next = value.slice(0, s) + wrapped + value.slice(e);
    onChange(next);
    setTimeout(() => { el.focus(); el.setSelectionRange(s + wrapped.length, s + wrapped.length); }, 0);
  }

  return (
    <div style={{
      border: `1.5px solid ${focused ? 'var(--primary)' : 'var(--border-color)'}`,
      borderRadius: '0.5rem', overflow: 'hidden',
      transition: 'border-color 0.15s',
    }}>
      {/* toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.2rem',
        padding: '0.3rem 0.5rem', background: 'var(--surface-input)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {/* B */}
        <button title="Negrita (*texto*)" onClick={() => wrap('*')} style={{ width: 28, height: 28, borderRadius: '0.35rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia', fontWeight: 900, fontSize: '0.9rem', transition: 'all 0.12s' }}>B</button>
        {/* I */}
        <button title="Cursiva (_texto_)" onClick={() => wrap('_')} style={{ width: 28, height: 28, borderRadius: '0.35rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia', fontStyle: 'italic', fontSize: '0.9rem', transition: 'all 0.12s' }}>I</button>
        {/* emoji */}
        <button title="Emoji" style={{ width: 28, height: 28, borderRadius: '0.35rem', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>😀</button>
        <div style={{ width: 1, height: 16, background: 'var(--border-subtle)', margin: '0 0.1rem' }} />
        {WA_VARS.map(v => <WAVarChip key={v} label={v} onClick={() => insertVar(v)} />)}
      </div>
      {/* textarea */}
      <textarea
        ref={taRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={rows || 5}
        placeholder={placeholder || ''}
        style={{
          width: '100%', display: 'block', padding: '0.6rem 0.75rem',
          border: 'none', background: 'var(--surface-input)',
          color: 'var(--text-heading)', fontFamily: 'var(--font-sans)',
          fontSize: '0.875rem', outline: 'none', resize: 'vertical', lineHeight: 1.65,
        }}
      />
    </div>
  );
}

/* ── EditMessageModal ─────────────────────────────────────── */
function EditMessageModal({ msg, onClose, onSave }) {
  const [name, setName] = React.useState(msg?.name || 'Nueva plantilla');
  const [text, setText] = React.useState(msg?.text || '');
  const [desc, setDesc] = React.useState(msg?.desc || '');
  const [interactive, setInteractive] = React.useState(msg?.interactive ?? false);
  const [msgType, setMsgType] = React.useState(msg?.msgType || 'button');
  const [iText, setIText] = React.useState(msg?.iText || '');
  const [btns, setBtns] = React.useState(msg?.btns || [{ label: '', action: '' }]);

  const mainRef = React.useRef(null);
  const iRef = React.useRef(null);

  const IS = {
    width: '100%', padding: '0.55rem 0.75rem',
    border: '1.5px solid var(--border-color)', borderRadius: '0.5rem',
    background: 'var(--surface-input)', color: 'var(--text-heading)',
    fontFamily: 'var(--font-sans)', fontSize: '0.875rem', outline: 'none',
    transition: 'border-color 0.15s',
  };
  const LS = {
    display: 'block', fontSize: '0.7rem', fontWeight: 700,
    color: 'var(--text-heading)', marginBottom: '0.4rem',
    letterSpacing: '0.05em', textTransform: 'uppercase',
  };
  function fi(e) { e.target.style.borderColor = 'var(--primary)'; }
  function bi(e) { e.target.style.borderColor = 'var(--border-color)'; }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: 'var(--font-sans)' }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--body-bg)', borderRadius: '1.25rem', width: '100%', maxWidth: 1080, maxHeight: 'calc(100vh - 2rem)', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.45)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-card)', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flex: 1 }}>
            <div style={{ width: 38, height: 38, borderRadius: '0.65rem', flex: 'none', background: 'linear-gradient(310deg,#128c7e,#25d366)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}>
              <em className="fa-brands fa-whatsapp" style={{ color: '#fff', fontSize: '1.1rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)', lineHeight: 1.2 }}>Editar Mensaje de WhatsApp</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                Plantilla · <span style={{ color: 'var(--text-body)', fontWeight: 600 }}>{name || '—'}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '0.4rem', border: 'none', background: 'var(--surface-input)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flex: 'none' }}>
            <em className="fas fa-xmark" />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Card 1: basic */}
          <div style={{ background: 'var(--surface-card)', borderRadius: '0.875rem', boxShadow: 'var(--shadow-card)', padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
              {/* left */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={LS}>Nombre</label>
                  <input value={name} onChange={e => setName(e.target.value)} onFocus={fi} onBlur={bi} placeholder="Nombre de la plantilla" style={IS} />
                </div>
                <div>
                  <label style={LS}>Mensaje</label>
                  <WAEditorBlock value={text} onChange={setText} taRef={mainRef} rows={6} placeholder="Escribe tu mensaje… usa *negrita* o _cursiva_" />
                </div>
              </div>
              {/* right */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={LS}>Vista Previa</label>
                  <WAPhonePreview message={text} />
                </div>
                <div>
                  <label style={LS}>Descripción</label>
                  <textarea value={desc} onChange={e => setDesc(e.target.value)} onFocus={fi} onBlur={bi} rows={4} placeholder="Describe cuándo se usa esta plantilla…"
                    style={{ ...IS, resize: 'vertical', lineHeight: 1.6 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive toggle */}
          <button
            onClick={() => setInteractive(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.1rem', width: '100%', textAlign: 'left', background: interactive ? 'var(--badge-success-bg)' : 'var(--surface-card)', border: `1.5px solid ${interactive ? 'var(--success)' : 'var(--border-subtle)'}`, borderRadius: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s' }}
          >
            <div style={{ width: 34, height: 34, borderRadius: '0.5rem', flex: 'none', background: interactive ? 'linear-gradient(310deg,#17ad37,#98ec2d)' : 'var(--surface-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: interactive ? '#fff' : 'var(--text-muted)', fontSize: '0.85rem', boxShadow: interactive ? '0 4px 12px rgba(130,214,22,0.3)' : 'none', transition: 'all 0.2s' }}>
              <em className={interactive ? 'fas fa-bolt' : 'fas fa-bolt-slash'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.83rem', fontWeight: 700, color: interactive ? 'var(--badge-success-fg)' : 'var(--text-heading)' }}>
                {interactive ? 'Modo interactivo habilitado' : 'Modo interactivo deshabilitado'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                {interactive ? 'El mensaje incluye botones de respuesta rápida' : 'Activa para añadir botones de respuesta rápida'}
              </div>
            </div>
            {/* pill */}
            <div style={{ width: 40, height: 22, borderRadius: 50, flex: 'none', background: interactive ? 'var(--success)' : 'var(--border-color)', position: 'relative', transition: 'background 0.2s', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)' }}>
              <span style={{ position: 'absolute', top: 3, left: interactive ? 20 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </div>
          </button>

          {/* Card 2: interactive */}
          {interactive && (
            <div style={{ background: 'var(--surface-card)', borderRadius: '0.875rem', boxShadow: 'var(--shadow-card)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.1rem' }}>
                <div style={{ width: 26, height: 26, borderRadius: '0.4rem', background: 'linear-gradient(310deg,#17ad37,#98ec2d)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem' }}>
                  <em className="fas fa-bolt" />
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-heading)' }}>Mensaje Interactivo</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
                {/* left */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={LS}>Tipo de mensaje</label>
                    <div style={{ position: 'relative' }}>
                      <select value={msgType} onChange={e => setMsgType(e.target.value)} onFocus={fi} onBlur={bi}
                        style={{ ...IS, appearance: 'none', paddingRight: '2.2rem', cursor: 'pointer' }}>
                        <option value="button">Botón</option>
                        <option value="list">Lista</option>
                        <option value="product">Producto</option>
                      </select>
                      <em className="fas fa-chevron-down" style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)', fontSize: '0.7rem' }} />
                    </div>
                  </div>

                  <div>
                    <label style={LS}>Mensaje</label>
                    <WAEditorBlock value={iText} onChange={setIText} taRef={iRef} rows={4} placeholder="Escribe el mensaje interactivo…" />
                  </div>

                  {/* button editor */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.55rem' }}>
                      <label style={{ ...LS, marginBottom: 0 }}>Botones de respuesta</label>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>{btns.length}/3</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 34px', gap: '0.4rem', marginBottom: '0.35rem' }}>
                      {['Etiqueta', 'Acción / ID', ''].map((h, i) => (
                        <div key={i} style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {btns.map((btn, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 34px', gap: '0.4rem', alignItems: 'center' }}>
                          <input value={btn.label} onChange={e => setBtns(bs => bs.map((b, j) => j === i ? { ...b, label: e.target.value } : b))}
                            onFocus={fi} onBlur={bi} placeholder="Texto visible"
                            style={{ ...IS, fontSize: '0.8rem', padding: '0.38rem 0.65rem' }} />
                          <input value={btn.action} onChange={e => setBtns(bs => bs.map((b, j) => j === i ? { ...b, action: e.target.value } : b))}
                            onFocus={fi} onBlur={bi} placeholder="ACCION"
                            style={{ ...IS, fontSize: '0.78rem', padding: '0.38rem 0.65rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }} />
                          <button onClick={() => setBtns(bs => bs.filter((_, j) => j !== i))}
                            style={{ width: 34, height: 34, borderRadius: '0.4rem', border: 'none', background: 'var(--badge-danger-bg)', color: 'var(--badge-danger-fg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem' }}>
                            <em className="fas fa-trash" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {btns.length < 3 && (
                      <button onClick={() => setBtns(bs => [...bs, { label: '', action: '' }])}
                        style={{ marginTop: '0.55rem', padding: '0.35rem 0.8rem', border: '1.5px dashed var(--border-color)', borderRadius: '0.45rem', background: 'transparent', color: 'var(--primary)', fontFamily: 'var(--font-sans)', fontSize: '0.73rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.14s' }}>
                        <em className="fas fa-plus" style={{ fontSize: '0.65rem' }} />
                        Agregar botón
                      </button>
                    )}
                  </div>
                </div>

                {/* right: preview */}
                <div>
                  <label style={{ ...LS, marginBottom: '0.65rem' }}>Vista Previa</label>
                  <WAPhonePreview message={iText} buttons={btns} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: '0.9rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-card)', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <em className="fas fa-circle-info" style={{ fontSize: '0.7rem' }} />
            Los cambios se aplican al guardar
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={onClose} style={{ padding: '0.45rem 1.1rem', borderRadius: '0.5rem', border: '1.5px solid var(--border-color)', background: 'var(--surface-input)', color: 'var(--text-body)', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
              Cerrar
            </button>
            <button
              onClick={() => { onSave && onSave({ name, text, desc, interactive, iText, btns }); onClose(); }}
              style={{ padding: '0.45rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: 'var(--primary)', color: '#fff', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', boxShadow: 'var(--shadow-btn)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <em className="fas fa-paper-plane" style={{ fontSize: '0.72rem' }} />
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.EditMessageModal = EditMessageModal;
