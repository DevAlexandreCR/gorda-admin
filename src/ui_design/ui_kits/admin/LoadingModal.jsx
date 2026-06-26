// ─── LoadingModal · Gorda Admin ──────────────────────────────────────────────
// "Por favor espere…" overlay. Brand-gradient orbit ring + indeterminate bar.
// Fully theme-aware (light & dark) via design tokens.
// Usage: <LoadingModal open={bool} message="Por favor espere..." sub="…" />

(function () {
  const { useEffect } = React;

  const STYLE_ID = 'gorda-loading-modal-styles';
  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      @keyframes gordaLmSpin   { to { transform: rotate(360deg); } }
      @keyframes gordaLmPulse  { 0%,100% { transform: scale(1);   opacity: 1; }
                                 50%      { transform: scale(.55); opacity: .55; } }
      @keyframes gordaLmBar    { 0%   { transform: translateX(-110%); }
                                 100% { transform: translateX(420%);  } }
      @keyframes gordaLmIn     { from { opacity: 0; transform: translateY(8px) scale(.97); }
                                 to   { opacity: 1; transform: translateY(0)   scale(1);  } }

      /* Backdrop — theme aware */
      .gorda-lm-backdrop { background: rgba(233,236,239,.66); }
      [data-theme="dark"] .gorda-lm-backdrop { background: rgba(8,11,20,.62); }
      @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) .gorda-lm-backdrop { background: rgba(8,11,20,.62); }
      }
      @media (prefers-reduced-motion: reduce) {
        .gorda-lm-ring, .gorda-lm-core, .gorda-lm-seg, .gorda-lm-card { animation: none !important; }
      }
    `;
    document.head.appendChild(s);
  }

  function LoadingModal({ open, message = 'Por favor espere...', sub = 'Esto solo tomará un momento' }) {
    useEffect(() => { ensureStyles(); }, []);
    if (!open) return null;

    const RING = 84;     // ring diameter
    const STROKE = 6;    // ring thickness

    return (
      <div className="gorda-lm-backdrop" style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Card */}
        <div className="gorda-lm-card" style={{
          background: 'var(--surface-card)',
          borderRadius: '1.25rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card), 0 24px 70px rgba(20,23,39,.18)',
          width: 360, maxWidth: 'calc(100vw - 2rem)',
          overflow: 'hidden',
          fontFamily: "'Open Sans', sans-serif",
          animation: 'gordaLmIn .28s cubic-bezier(.2,.7,.3,1) both',
        }}>
          {/* Body */}
          <div style={{
            padding: '2.4rem 2rem 1.9rem',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          }}>
            {/* Orbit ring */}
            <div style={{ position: 'relative', width: RING, height: RING, marginBottom: '1.4rem' }}>
              {/* Track */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: `${STROKE}px solid var(--border-subtle)`,
              }} />
              {/* Spinning gradient arc (conic + ring mask) */}
              <div className="gorda-lm-ring" style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: 'conic-gradient(from 90deg, rgba(203,12,159,0) 8%, #cb0c9f 62%, #ff0080 100%)',
                WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${STROKE}px), #000 calc(100% - ${STROKE}px))`,
                mask: `radial-gradient(farthest-side, transparent calc(100% - ${STROKE}px), #000 calc(100% - ${STROKE}px))`,
                animation: 'gordaLmSpin .85s linear infinite',
              }} />
              {/* Pulsing brand core */}
              <div className="gorda-lm-core" style={{
                position: 'absolute', top: '50%', left: '50%',
                width: 18, height: 18, marginTop: -9, marginLeft: -9, borderRadius: '50%',
                background: 'var(--gradient-primary)',
                boxShadow: '0 4px 12px rgba(203,12,159,.35)',
                animation: 'gordaLmPulse 1.3s ease-in-out infinite',
              }} />
            </div>

            {/* Title */}
            <div style={{
              fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-heading)',
              letterSpacing: '-0.01em', lineHeight: 1.2,
            }}>
              {message}
            </div>
            {/* Subtitle */}
            {sub && (
              <div style={{
                marginTop: '.4rem', fontSize: '.8rem', fontWeight: 400,
                color: 'var(--text-muted)',
              }}>
                {sub}
              </div>
            )}
          </div>

          {/* Indeterminate progress bar */}
          <div style={{
            position: 'relative', height: 4, overflow: 'hidden',
            background: 'var(--border-subtle)',
          }}>
            <div className="gorda-lm-seg" style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, width: '28%',
              borderRadius: 4,
              background: 'var(--gradient-primary)',
              animation: 'gordaLmBar 1.25s cubic-bezier(.5,0,.3,1) infinite',
            }} />
          </div>
        </div>
      </div>
    );
  }

  window.LoadingModal = LoadingModal;
})();
