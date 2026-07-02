// User detail view — edit (or create) an admin/operator account.
function UserDetailView({ user, onBack }) {
  const { Card, Button, Input, Switch } = window.GordaDesignSystem_019e24;
  const isMobile = window.useIsMobile();
  const isNew = !user;

  const [form, setForm] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'Operador',
    enabled: user?.enabled !== undefined ? user.enabled : true,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const roleOption = (value, label) => {
    const active = form.role === value;
    return (
      <label style={{
        display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer',
        fontFamily: "'Open Sans', sans-serif",
      }}>
        <span
          onClick={() => setForm((f) => ({ ...f, role: value }))}
          style={{
            width: 20, height: 20, borderRadius: '0.35rem', flex: 'none',
            border: `2px solid ${active ? '#cb0c9f' : 'var(--border-color)'}`,
            background: active ? '#cb0c9f' : 'var(--surface-input)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '0.62rem',
          }}
        >
          {active && <em className="fas fa-check" />}
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)' }}>{label}</span>
      </label>
    );
  };

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif" }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <Button color="secondary" variant="outline" size="sm" icon="fas fa-arrow-left" onClick={onBack}>
          Regresar
        </Button>
      </div>

      <Card>
        <h6 style={{ margin: '0 0 1.25rem', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-heading)', textAlign: isMobile ? 'left' : 'center' }}>
          {isNew ? 'Crear información del usuario' : 'Editar información del usuario'}
        </h6>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '2rem' }}>

          {/* Photo placeholder */}
          <div style={{ flex: isMobile ? 'none' : '0 0 260px', position: 'relative' }}>
            <div style={{
              width: '100%', aspectRatio: '3 / 4', borderRadius: '0.85rem',
              background: 'repeating-linear-gradient(135deg, var(--surface-input) 0px, var(--surface-input) 10px, var(--body-bg) 10px, var(--body-bg) 20px)',
              border: '1px solid var(--border-subtle)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}>
              <em className="fas fa-image" style={{ fontSize: '1.6rem', color: 'var(--text-secondary)', opacity: 0.6 }} />
              <span style={{ fontFamily: "'SFMono-Regular', Menlo, Monaco, monospace", fontSize: '0.68rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '0 1rem' }}>
                foto de perfil
              </span>
            </div>
            <button title="Cambiar foto" style={{
              position: 'absolute', bottom: 12, left: 12,
              width: 34, height: 34, borderRadius: '50%', border: 'none',
              background: 'linear-gradient(310deg,#7928ca,#ff0080)', color: '#fff',
              cursor: 'pointer', fontSize: '0.8rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
            }}>
              <em className="fas fa-pencil" />
            </button>
          </div>

          {/* Form fields */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.1rem', minWidth: 0 }}>
            <Input label="Nombre" value={form.name} onChange={set('name')} placeholder="Nombre completo" icon="fas fa-user" />

            <div>
              <Input label="Correo electrónico" value={form.email} onChange={set('email')} placeholder="correo@ejemplo.com" icon="fas fa-envelope" />
              <button style={{
                marginTop: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontSize: '0.75rem', fontWeight: 700, color: '#cb0c9f', fontFamily: 'inherit',
              }}>
                ¿Restablecer contraseña?
              </button>
            </div>

            <Input label="Teléfono" value={form.phone} onChange={set('phone')} placeholder="+57 300 000 0000" icon="fas fa-phone" />

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.55rem', marginLeft: '0.25rem' }}>Rol</div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                {roleOption('Operador', 'Operador')}
                {roleOption('Administrador', 'Administrador')}
              </div>
            </div>

            <Switch
              checked={form.enabled}
              onChange={(v) => setForm((f) => ({ ...f, enabled: v }))}
              label={form.enabled ? 'Habilitado' : 'Inhabilitado'}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', marginTop: '1.5rem' }}>
          <Button color="secondary" variant="outline" size="sm" onClick={onBack}>Cancelar</Button>
          <Button color="primary" variant="gradient" size="sm" icon="fas fa-check" onClick={onBack}>Guardar cambios</Button>
        </div>
      </Card>
    </div>
  );
}
window.UserDetailView = UserDetailView;
