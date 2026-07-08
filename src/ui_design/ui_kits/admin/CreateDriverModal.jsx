// Create Driver modal — Gorda Design System.
// Vehicle info intentionally excluded: vehicles are created/linked from their own modal.
function CreateDriverModal({ onClose, onCreate }) {
  const { Button, Input, Select, Switch } = window.GordaDesignSystem_019e24;

  const [form, setForm] = React.useState({
    name: '', email: '', password: '', phone: '', phone2: '',
    docType: 'CC', doc: '', enabled: false, payMode: 'Mensualidad',
  });
  const [photo, setPhoto] = React.useState(null);
  const [showPass, setShowPass] = React.useState(false);
  const [touched, setTouched] = React.useState({});
  const fileRef = React.useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const errors = {
    name: touched.name && form.name.trim().length === 0 ? 'El nombre es obligatorio'
      : touched.name && form.name.trim().length < 3 ? 'El nombre debe tener al menos 3 caracteres' : null,
    phone: touched.phone && form.phone.trim().length === 0 ? 'El teléfono es obligatorio'
      : touched.phone && form.phone.trim().length < 8 ? 'El teléfono debe tener al menos 8 caracteres' : null,
  };
  const isValid = form.name.trim().length >= 3 && form.email.trim() && form.password.trim()
    && form.phone.trim().length >= 8 && form.doc.trim();

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    setTouched({ name: true, phone: true });
    if (!isValid) return;
    onCreate && onCreate({ ...form, photo });
    onClose && onClose();
  }

  const iLbl = { fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.5rem', marginLeft: '0.25rem' };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', fontFamily: "'Open Sans', sans-serif" }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--body-bg)', borderRadius: '1.25rem', width: '100%', maxWidth: 620, maxHeight: 'calc(100vh - 2rem)', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.45)', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-card)', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flex: 1 }}>
            <div style={{ width: 38, height: 38, borderRadius: '0.65rem', flex: 'none', background: 'linear-gradient(310deg,#7928ca,#ff0080)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(203,12,159,0.3)' }}>
              <em className="fas fa-id-badge" style={{ color: '#fff', fontSize: '1.05rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)', lineHeight: 1.2 }}>Crear Conductor</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Información del conductor</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '0.4rem', border: 'none', background: 'var(--surface-input)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flex: 'none' }}>
            <em className="fas fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>

          {/* Photo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative', flex: 'none' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%', overflow: 'hidden',
                background: photo ? 'transparent' : 'linear-gradient(310deg,#7928ca,#ff0080)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--border-subtle)',
              }}>
                {photo ? (
                  <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <em className="fas fa-user" style={{ color: '#fff', fontSize: '1.6rem', opacity: 0.85 }} />
                )}
              </div>
              <button
                title="Subir foto"
                onClick={() => fileRef.current?.click()}
                style={{
                  position: 'absolute', bottom: -4, right: -4,
                  width: 26, height: 26, borderRadius: '50%', border: '3px solid var(--surface-card)',
                  background: 'linear-gradient(310deg,#17c1e8,#21d4fd)', color: '#fff',
                  cursor: 'pointer', fontSize: '0.62rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                }}
              >
                <em className="fas fa-camera" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)' }}>Foto de perfil</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Opcional · JPG o PNG</div>
            </div>
          </div>

          <Input label="Nombre" value={form.name} onChange={set('name')} placeholder="Ingrese el nombre" icon="fas fa-user"
            error={errors.name} />

          <Input label="Correo electrónico" value={form.email} onChange={set('email')} placeholder="Ingrese el email" icon="fas fa-envelope" type="email" />

          <div>
            <div style={iLbl}>Contraseña</div>
            <div style={{ position: 'relative' }}>
              <Input value={form.password} onChange={set('password')} placeholder="Contraseña" icon="fas fa-lock" type={showPass ? 'text' : 'password'} />
              <button onClick={() => setShowPass((s) => !s)} title={showPass ? 'Ocultar' : 'Mostrar'} style={{
                position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem',
              }}>
                <em className={showPass ? 'fas fa-eye-slash' : 'fas fa-eye'} />
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem' }}>
            <Input label="Teléfono" value={form.phone} onChange={set('phone')} placeholder="Ingrese el teléfono" icon="fas fa-phone"
              error={errors.phone} />
            <Input label="Teléfono 2" value={form.phone2} onChange={set('phone2')} placeholder="Opcional" icon="fas fa-phone" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem' }}>
            <Select label="Tipo doc" value={form.docType} onChange={set('docType')} options={['CC', 'CE', 'NIT', 'PA', 'RC']} />
            <Input label="Documento" value={form.doc} onChange={set('doc')} placeholder="Número de documento" icon="fas fa-id-card" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem', alignItems: 'end' }}>
            <div>
              <div style={iLbl}>Estado</div>
              <div style={{ paddingTop: '0.3rem' }}>
                <Switch checked={form.enabled} onChange={(v) => setForm((f) => ({ ...f, enabled: v }))} label={form.enabled ? 'Habilitado' : 'Inhabilitado'} />
              </div>
            </div>
            <Select label="Modo de pago" value={form.payMode} onChange={set('payMode')} options={['Mensualidad', 'Por servicio', 'Prepago']} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0.9rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.6rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-card)', flex: 'none' }}>
          <Button color="secondary" variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button color="info" variant="gradient" size="sm" icon="fas fa-paper-plane" onClick={handleSubmit}>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
}
window.CreateDriverModal = CreateDriverModal;
