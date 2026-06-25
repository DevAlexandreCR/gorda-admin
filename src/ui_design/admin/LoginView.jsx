// Login screen — gradient header card, centered form (mirrors the Vue Login.vue).
function LoginView({ onLogin }) {
  const { Button, Input, Alert } = window.GordaDesignSystem_019e24;
  const [email, setEmail] = React.useState('admin@gorda.co');
  const [pw, setPw] = React.useState('password');
  const [err, setErr] = React.useState(false);

  const submit = () => {
    if (!email || !pw) { setErr(true); return; }
    onLogin();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', fontFamily: "'Open Sans', sans-serif", padding: 24 }}>
      <div style={{ width: 380 }}>
        {/* gradient brand header */}
        <div style={{
          background: 'linear-gradient(310deg, #7928ca, #ff0080)', borderRadius: '1rem',
          padding: '2rem', textAlign: 'center', color: '#fff', marginBottom: '-2.5rem',
          boxShadow: '0 20px 27px 0 rgba(0,0,0,0.15)', position: 'relative', zIndex: 2,
          width: 'calc(100% - 3rem)', marginLeft: 'auto', marginRight: 'auto',
        }}>
          <img src="logo.png" alt="Gorda" style={{ width: 56, height: 56, borderRadius: '0.8rem', marginBottom: '0.5rem' }} />
          <h4 style={{ margin: 0, color: '#fff', fontWeight: 700 }}>Welcome back</h4>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', opacity: 0.9 }}>Sign in to the Gorda admin panel</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)', padding: '3.5rem 2rem 2rem' }}>
          {err && <div style={{ marginBottom: '1rem' }}><Alert color="danger" title="Invalid credentials" onClose={() => setErr(false)}>Check your email and password.</Alert></div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" icon="fas fa-envelope" />
            <Input label="Password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Enter password" icon="fas fa-lock" />
            <Button color="info" fullWidth onClick={submit} style={{ marginTop: '0.5rem' }}>Sign in</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
window.LoginView = LoginView;
